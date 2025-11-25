import httpx
import re
import base64
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Hardcoded repo - using Dun-sin/Whisper
GITHUB_OWNER = "Dun-sin"
GITHUB_REPO = "Whisper"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Headers with authentication
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

# Fetch CLOSED issues (they have solutions!) - get more to filter out PRs
ISSUES_URL = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues?state=closed&per_page=30"

def is_valid_issue(issue):
    # Skip pull requests
    if "pull_request" in issue:
        return False

    return True


async def fetch_file_content(path):
    """Fetch file content from GitHub"""
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}"
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=HEADERS, timeout=5.0)
        if res.status_code == 200:
            data = res.json()
            content = base64.b64decode(data["content"]).decode("utf-8")
            return {"path": path, "content": content}
    except:
        pass
    return None


async def get_files_from_linked_pr(issue):
    """Get files that were changed in the PR that fixed this issue"""
    
    # Method 1: Check issue body for PR number references like "closes #123" or "fixes #456"
    body = (issue.get("body") or "") + " " + issue.get("title", "")
    pr_pattern = r'#(\d+)'
    pr_numbers = re.findall(pr_pattern, body)
    
    # Method 2: Use timeline API to find closing PR
    timeline_url = issue["timeline_url"]
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(timeline_url, headers=HEADERS, timeout=10.0)
        
        if res.status_code == 200:
            events = res.json()
            for event in events:
                # Look for cross-reference events from PRs
                if event.get("event") == "cross-referenced":
                    source = event.get("source", {})
                    if source.get("issue", {}).get("pull_request"):
                        pr_numbers.append(str(source["issue"]["number"]))
    except:
        pass
    
    # Try each PR number we found
    for pr_num in pr_numbers[:3]:  # Check first 3 PRs mentioned
        try:
            pr_number = int(pr_num)
            files = await get_files_from_pr(pr_number)
            if files:  # If we got files, return them
                return files
        except:
            continue
    
    return []


async def get_files_from_pr(pr_number):
    """Get the BEFORE version of files (buggy code) from a PR"""
    
    # First, get PR details to get the base SHA (code BEFORE fix)
    pr_details_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/pulls/{pr_number}"
    
    async with httpx.AsyncClient() as client:
        pr_res = await client.get(pr_details_url, headers=HEADERS, timeout=5.0)
    
    if pr_res.status_code != 200:
        return []
    
    pr_data = pr_res.json()
    base_sha = pr_data["base"]["sha"]  # SHA BEFORE the fix
    
    # Get list of files that were changed
    pr_files_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/pulls/{pr_number}/files"
    
    async with httpx.AsyncClient() as client:
        files_res = await client.get(pr_files_url, headers=HEADERS, timeout=5.0)
    
    if files_res.status_code != 200:
        return []
    
    files_data = files_res.json()
    
    # Get the BEFORE version of each changed file
    code_files = []
    for file in files_data[:3]:  # Limit to 3 files
        if file["status"] in ["modified", "added"]:
            # Fetch file content at the base SHA (BEFORE fix)
            file_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{file['filename']}?ref={base_sha}"
            
            try:
                async with httpx.AsyncClient() as client:
                    content_res = await client.get(file_url, headers=HEADERS, timeout=5.0)
                
                if content_res.status_code == 200:
                    file_data = content_res.json()
                    content = base64.b64decode(file_data["content"]).decode("utf-8")
                    code_files.append({
                        "path": file["filename"],
                        "content": content,  # BEFORE version (buggy code)
                        "patch": file.get("patch", "")  # Optional: show what should change
                    })
            except:
                pass
    
    return code_files
    
    return code_files


async def map_issue(issue):
    """Map closed issue and fetch files from linked PR"""
    code_files = await get_files_from_linked_pr(issue)
    
    return {
        "id": issue["number"],
        "title": issue["title"],
        "description": issue.get("body", ""),
        "labels": [l["name"] for l in issue.get("labels", [])],
        "html_url": issue["html_url"],
        "created_at": issue["created_at"],
        "closed_at": issue.get("closed_at"),
        "code_files": code_files
    }


@router.get("/get-tasks")
async def get_tasks():
    async with httpx.AsyncClient() as client:
        res = await client.get(ISSUES_URL, headers=HEADERS)

    if res.status_code != 200:
        raise HTTPException(500, "Failed to fetch issues from GitHub")

    issues = res.json()

    issues = [i for i in issues if is_valid_issue(i)]
    
    # Limit to 5 actual issues after filtering out PRs
    issues = issues[:5]

    # Map issues with PR file detection
    tasks = []
    for i in issues:
        task = await map_issue(i)
        tasks.append(task)

    return {"tasks": tasks}


@router.get("/get-tasks/{task_id}")
async def get_task(task_id: int):
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{task_id}"

    async with httpx.AsyncClient() as client:
        res = await client.get(url, headers=HEADERS)

    if res.status_code != 200:
        raise HTTPException(404, "Task not found")

    issue = res.json()

    if not is_valid_issue(issue):
        raise HTTPException(404, "Task is not valid for this platform")

    return await map_issue(issue)


@router.get("/get-file")
async def get_file(path: str):
    """Get any file from the repo - use this for Monaco Editor"""
    file_data = await fetch_file_content(path)
    if not file_data:
        raise HTTPException(404, "File not found")
    return file_data


@router.get("/browse-repo")
async def browse_repo(path: str = ""):
    """Browse repo structure - returns folders and files"""
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}"
    async with httpx.AsyncClient() as client:
        res = await client.get(url, headers=HEADERS)
    
    if res.status_code != 200:
        raise HTTPException(404, "Path not found")
    
    items = res.json()
    # Return simplified structure
    return {
        "path": path,
        "items": [{
            "name": item["name"],
            "path": item["path"],
            "type": item["type"]  # "file" or "dir"
        } for item in items]
    }


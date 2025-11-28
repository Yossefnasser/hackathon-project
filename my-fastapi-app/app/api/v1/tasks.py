import os
import httpx
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

from app.services.task_service import (
    build_headers,
    is_valid_issue,
    fetch_file_content,
    map_issue
)

load_dotenv()

router = APIRouter()

GITHUB_OWNER = "Dun-sin"
GITHUB_REPO = "Whisper"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = build_headers(GITHUB_TOKEN)
ISSUES_URL = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues?state=closed&per_page=30"


def handle_possible_rate_limit(response: httpx.Response):
    if response.status_code == 403:
        try:
            data = response.json()
            message = (data.get("message") or "").lower()
            if "rate limit" in message:
                raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
        except Exception:
            pass


@router.get("/get-tasks")
async def get_tasks():
    async with httpx.AsyncClient() as client:
        res = await client.get(ISSUES_URL, headers=HEADERS, timeout=15.0)
        handle_possible_rate_limit(res)

        if res.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch issues from GitHub")

        issues = res.json()
        issues = [i for i in issues if is_valid_issue(i)]
        issues = issues[:5]

        tasks = []
        for issue in issues:
            tasks.append(await map_issue(issue, GITHUB_OWNER, GITHUB_REPO, client, HEADERS))

    return {"tasks": tasks}


@router.get("/get-tasks/{task_id}")
async def get_task(task_id: int):
    issue_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{task_id}"
    async with httpx.AsyncClient() as client:
        res = await client.get(issue_url, headers=HEADERS, timeout=15.0)
        handle_possible_rate_limit(res)

        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="Task not found")

        issue = res.json()

        if not is_valid_issue(issue):
            raise HTTPException(status_code=404, detail="Task is not valid for this platform")

        task = await map_issue(issue, GITHUB_OWNER, GITHUB_REPO, client, HEADERS)
        return task


@router.get("/get-file")
async def get_file(path: str):
    async with httpx.AsyncClient() as client:
        file_data = await fetch_file_content(path, GITHUB_OWNER, GITHUB_REPO, client, HEADERS)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")
    return file_data


@router.get("/browse-repo")
async def browse_repo(path: str = ""):
    url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/contents/{path}"
    async with httpx.AsyncClient() as client:
        res = await client.get(url, headers=HEADERS, timeout=15.0)
        handle_possible_rate_limit(res)

    if res.status_code != 200:
        raise HTTPException(status_code=404, detail="Path not found")

    items = res.json()
    return {
        "path": path,
        "items": [
            {
                "name": item["name"],
                "path": item["path"],
                "type": item["type"]
            }
            for item in items
        ]
    }


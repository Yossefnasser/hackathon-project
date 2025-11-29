import os
import httpx
from fastapi import APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.services.task_service import (
    build_headers,
    is_valid_issue,
    fetch_file_content,
    map_issue
)
from app.services.db_service import task_exists, save_task, get_all_tasks, get_task_by_id
from app.core.database import SessionLocal
from datetime import datetime

load_dotenv()

router = APIRouter()

GITHUB_OWNER = "Dun-sin"
GITHUB_REPO = "Whisper"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = build_headers(GITHUB_TOKEN)
ISSUES_URL = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues?state=closed&per_page=30"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/get-tasks")
async def get_tasks(db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        res = await client.get(ISSUES_URL, headers=HEADERS, timeout=15.0)

        if res.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch issues from GitHub")

        issues = res.json()
        issues = [i for i in issues if is_valid_issue(i)]
        issues = issues[:5]

        tasks = []
        for issue in issues:
            task_data = await map_issue(issue, GITHUB_OWNER, GITHUB_REPO, client, HEADERS)
            tasks.append(task_data)
            
            # Save to DB only if: (1) not already in DB and (2) has code files
            if not task_exists(db, GITHUB_OWNER, GITHUB_REPO, task_data["id"]):
                if task_data.get("code_files"):
                    save_task(db, task_data, GITHUB_OWNER, GITHUB_REPO)

    return {"tasks": tasks}


@router.get("/get-tasks/{task_id}")
async def get_task(task_id: int):
    issue_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{task_id}"
    async with httpx.AsyncClient() as client:
        res = await client.get(issue_url, headers=HEADERS, timeout=15.0)

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


@router.get("/tasks")
async def get_frontend_tasks(db: Session = Depends(get_db)):
    """Get all tasks formatted for the React frontend"""
    import json
    tasks = get_all_tasks(db)
    
    formatted_tasks = []
    for task in tasks:
        # Calculate days ago from created_at
        days_ago = 1
        if task.created_at:
            try:
                created = datetime.fromisoformat(task.created_at.replace('Z', '+00:00'))
                days_ago = (datetime.now(created.tzinfo) - created).days
            except:
                pass
        
        # Parse fields
        labels_list = task.labels.split(',') if task.labels else []
        techs_list = task.technologies.split(',') if task.technologies else []
        hints_list = json.loads(task.hints) if task.hints else []
        
        formatted_tasks.append({
            "id": task.issue_number,
            "title": task.title,
            "description": task.description or "",
            "detailedDescription": task.detailed_description or "",
            "difficulty": task.difficulty or "Medium",
            "category": task.category or "Bug Fix",
            "timeEstimate": task.time_estimate or "30 min",
            "hints": hints_list,
            "technologies": techs_list,
            "labels": labels_list,
            "daysAgo": days_ago,
            "html_url": task.html_url,
            "created_at": task.created_at,
            "closed_at": task.closed_at,
            "owner": task.owner,
            "repo": task.repo,
            "code_files": [
                {
                    "path": cf.path,
                    "content": cf.content,
                    "language": cf.language,
                    "before_missing": cf.before_missing,
                    "patch": cf.patch
                }
                for cf in task.code_files
            ]
        })
    
    return {"tasks": formatted_tasks}


@router.get("/tasks/{task_id}")
async def get_frontend_task_detail(task_id: int, db: Session = Depends(get_db)):
    """Get a single task detail formatted for the React frontend"""
    task = get_task_by_id(db, GITHUB_OWNER, GITHUB_REPO, task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Calculate days ago
    days_ago = 1
    if task.created_at:
        try:
            created = datetime.fromisoformat(task.created_at.replace('Z', '+00:00'))
            days_ago = (datetime.now(created.tzinfo) - created).days
        except:
            pass
    
    import json
    labels_list = task.labels.split(',') if task.labels else []
    techs_list = task.technologies.split(',') if task.technologies else []
    hints_list = json.loads(task.hints) if task.hints else []
    
    return {
        "id": task.issue_number,
        "title": task.title,
        "description": task.description or "",
        "detailedDescription": task.detailed_description or "",
        "difficulty": task.difficulty or "Medium",
        "category": task.category or "Bug Fix",
        "timeEstimate": task.time_estimate or "30 min",
        "hints": hints_list,
        "technologies": techs_list,
        "labels": labels_list,
        "daysAgo": days_ago,
        "html_url": task.html_url,
        "created_at": task.created_at,
        "closed_at": task.closed_at,
        "owner": task.owner,
        "repo": task.repo,
        "status": "Closed" if task.closed_at else "Open",
        "code_files": [
            {
                "path": cf.path,
                "content": cf.content,
                "language": cf.language,
                "before_missing": cf.before_missing,
                "patch": cf.patch
            }
            for cf in task.code_files
        ]
    }

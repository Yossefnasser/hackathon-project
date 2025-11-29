from sqlalchemy.orm import Session
from app.models.task import Task, TaskCodeFile
from typing import List, Optional


def task_exists(db: Session, owner: str, repo: str, issue_number: int) -> bool:
    """Check if task already exists in DB"""
    return db.query(Task).filter(
        Task.owner == owner,
        Task.repo == repo,
        Task.issue_number == issue_number
    ).first() is not None


def get_all_tasks(db: Session) -> List[Task]:
    """Get all tasks from database with their code files"""
    return db.query(Task).all()


def get_task_by_id(db: Session, owner: str, repo: str, issue_number: int) -> Optional[Task]:
    """Get a specific task by owner, repo, and issue number"""
    return db.query(Task).filter(
        Task.owner == owner,
        Task.repo == repo,
        Task.issue_number == issue_number
    ).first()


def save_task(db: Session, task_data: dict, owner: str, repo: str) -> Task:
    """Save task and its code files to database"""
    import json
    
    # Create task
    task = Task(
        issue_number=task_data["id"],
        owner=owner,
        repo=repo,
        title=task_data["title"],
        description=task_data.get("description", ""),
        detailed_description=task_data.get("detailedDescription", ""),
        labels=",".join(task_data.get("labels", [])),
        difficulty=task_data.get("difficulty"),
        category=task_data.get("category"),
        time_estimate=task_data.get("timeEstimate"),
        hints=json.dumps(task_data.get("hints", [])),
        technologies=",".join(task_data.get("technologies", [])),
        html_url=task_data.get("html_url", ""),
        created_at=task_data.get("created_at", ""),
        closed_at=task_data.get("closed_at", "")
    )
    
    db.add(task)
    db.flush()  # Get task.id
    
    # Create code files
    for file_data in task_data.get("code_files", []):
        code_file = TaskCodeFile(
            task_id=task.id,
            path=file_data["path"],
            content=file_data.get("content", ""),
            language=file_data.get("language"),
            before_missing=file_data.get("before_missing", False),
            patch=file_data.get("patch", ""),
            truncated=file_data.get("truncated", False)
        )
        db.add(code_file)
    
    db.commit()
    db.refresh(task)
    return task

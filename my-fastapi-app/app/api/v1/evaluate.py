import os
import httpx
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from pydantic import BaseModel

from app.services.task_service import build_headers, is_valid_issue, map_issue
from app.services.evaluation import CodeEvaluationService

load_dotenv()

router = APIRouter()

GITHUB_OWNER = "Dun-sin"
GITHUB_REPO = "Whisper"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = build_headers(GITHUB_TOKEN)


class CodeSubmission(BaseModel):
    task_id: int
    file_path: str
    user_code: str


evaluator = CodeEvaluationService()


@router.post("/submit-code")
async def submit_code(submission: CodeSubmission):
    """Submit code for evaluation"""
    try:
        issue_url = f"https://api.github.com/repos/{GITHUB_OWNER}/{GITHUB_REPO}/issues/{submission.task_id}"
        async with httpx.AsyncClient() as client:
            res = await client.get(issue_url, headers=HEADERS, timeout=15.0)

            if res.status_code != 200:
                raise HTTPException(status_code=404, detail="Task not found")

            issue = res.json()
            if not is_valid_issue(issue):
                raise HTTPException(status_code=404, detail="Task is not valid for this platform")

            task = await map_issue(issue, GITHUB_OWNER, GITHUB_REPO, client, HEADERS)

        original_file = next((f for f in task.get("code_files", []) if f["path"] == submission.file_path), None)
        if not original_file:
            raise HTTPException(status_code=400, detail=f"No original file found for path: {submission.file_path}")

        evaluation_result = await evaluator.evaluate_code(
            issue_title=task["title"],
            issue_body=task["description"],
            original_code=original_file["content"],
            user_code=submission.user_code,
        )

        if evaluation_result.get("success"):
            evaluation = evaluation_result["evaluation"]
            score = evaluator.calculate_score(evaluation)
            return {
                "success": True,
                "score": score,
                "evaluation": evaluation,
                "feedback": evaluation_result.get("raw_response"),
            }
        else:
            return {
                "success": False,
                "error": evaluation_result.get("error"),
                "raw_response": evaluation_result.get("raw_response"),
            }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")

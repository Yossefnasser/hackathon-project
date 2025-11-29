import json
import re
from typing import Dict, Any
from g4f import AsyncClient

class CodeEvaluationService:
    def __init__(self):
        self.client = AsyncClient()

        
    async def evaluate_code(self, issue_title: str, issue_body: str, original_code: str, user_code: str) -> Dict[str, Any]:
        """Evaluate user's code submission against the GitHub issue"""
        
        prompt = f"""You are a code reviewer. You are given a GitHub issue with the description and the original buggy code (BEFORE fix). A user has submitted a proposed solution to this issue. Your task is to evaluate the user's code based on the following metrics:

1. Correctness:
    - Does the user's code solve the problem described in the issue?
    - Compare the user's submission to the original buggy code to see if the intended bug or feature is fixed.
    - Output: "Correct", "Partially Correct", or "Incorrect".

2. Readability:
    - Is the code easy to read and understand? Check indentation, variable names, function structure, and basic comments.
    - Output: "Poor", "Good", or "Excellent".

3. Basic Safety / Obvious Bugs:
    - Does the code have syntax errors or obvious runtime issues like undefined variables or unsafe inputs?
    - Output: "Fail" or "Pass".

---

Issue Title: {issue_title}
Issue Description: {issue_body}

Original Code (before fix):
{original_code}

User Submission:
{user_code}

Provide your evaluation in the following JSON format:

{{
    "correctness": "...",
    "readability": "...",
    "basic_safety": "..."
}}

Add one short sentence explanation for each metric."""

        try:
            # Use g4f to get evaluation from LLM
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                web_search=False
            )

            print("Raw LLM response:", response)  # Debug print
            
            # Fix: Access message content as an attribute, not a dict
            message_content = response.choices[0].message.content
            
            # Extract JSON from response
            json_match = re.search(r'\{[^{}]*\}', message_content)
            if json_match:
                evaluation = json.loads(json_match.group())
                
                # Validate the response format
                required_keys = ["correctness", "readability", "basic_safety"]
                if all(key in evaluation for key in required_keys):
                    return {
                        "success": True,
                        "evaluation": evaluation,
                        "raw_response": message_content
                    }
            
            return {
                "success": False,
                "error": "Could not parse evaluation JSON",
                "raw_response": message_content
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "raw_response": None
            }
    
    def calculate_score(self, evaluation: Dict[str, str]) -> int:
        """Calculate numeric score from evaluation metrics"""
        score = 0
        
        # Correctness (50% of total score)
        correctness = evaluation.get("correctness", "").lower()
        if "correct" in correctness and "partially" not in correctness:
            score += 50
        elif "partially" in correctness:
            score += 25
        
        # Readability (30% of total score)
        readability = evaluation.get("readability", "").lower()
        if "excellent" in readability:
            score += 30
        elif "good" in readability:
            score += 20
        elif "poor" in readability:
            score += 5
        
        # Basic Safety (20% of total score)
        safety = evaluation.get("basic_safety", "").lower()
        if "pass" in safety:
            score += 20
        
        return min(score, 100)  # Cap at 100
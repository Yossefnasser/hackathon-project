import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.evaluation import CodeEvaluationService

async def test_evaluation():
    """Test the evaluation service with sample data"""
    
    evaluator = CodeEvaluationService()
    
    # Sample test case
    issue_title = "Fix undefined variable error in login function"
    issue_body = "The login function crashes with 'username is not defined' error when user tries to log in."
    
    original_code = """
def login(email, password):
    if email and password:
        user = authenticate_user(username, password)  # Bug: using 'username' instead of 'email'
        return user
    return None
"""
    
    user_code = """
def login(email, password):
    if email and password:
        user = authenticate_user(email, password)  # Fixed: using 'email' parameter
        return user
    return None
"""
    
    print("Testing evaluation service...")
    print(f"Issue: {issue_title}")
    print(f"Original code: {original_code.strip()}")
    print(f"User code: {user_code.strip()}")
    print("\n" + "="*50 + "\n")
    
    result = await evaluator.evaluate_code(issue_title, issue_body, original_code, user_code)
    
    if result["success"]:
        evaluation = result["evaluation"]
        score = evaluator.calculate_score(evaluation)
        
        print("✅ Evaluation successful!")
        print(f"Score: {score}/100")
        print(f"Correctness: {evaluation['correctness']}")
        print(f"Readability: {evaluation['readability']}")
        print(f"Basic Safety: {evaluation['basic_safety']}")
        print(f"\nFull Response:\n{result['raw_response']}")
    else:
        print("❌ Evaluation failed!")
        print(f"Error: {result['error']}")
        if result.get('raw_response'):
            print(f"Raw response: {result['raw_response']}")

if __name__ == "__main__":
    asyncio.run(test_evaluation())
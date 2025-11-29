import os
import json
import httpx

async def enrich_task(task_data: dict) -> dict:
    """
    Simple LLM enrichment using OpenRouter.
    Takes raw GitHub task data and returns enriched version.
    Falls back to original data if LLM fails.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("⚠️ No OPENROUTER_API_KEY found, skipping enrichment")
        return task_data  # No API key, skip enrichment
    
    print(f"🤖 Enriching task: {task_data.get('title', '')[:50]}...")
    
    # Build simple prompt
    prompt = f"""Improve this GitHub issue for a learning platform. Return ONLY valid JSON.

Issue Title: {task_data.get('title', '')}
Issue Description: {task_data.get('description', '')}
Labels: {', '.join(task_data.get('labels', []))}

Return JSON with these fields:
{{
  "title": "Clear, concise title",
  "description": "Brief description (2-3 sentences)",
  "detailedDescription": "Detailed explanation with context, expected behavior, and what needs to be fixed. Include code examples if helpful. (REQUIRED for Medium/Hard, optional for Easy)",
  "difficulty": "Easy" or "Medium" or "Hard",
  "category": "Bug Fix" or "Feature" or "Refactor" or "Documentation",
  "timeEstimate": "15 min" or "30 min" or "1 hour" or "2 hours",
  "hints": ["hint1", "hint2", "hint3"] (1 hint for Easy, 3 hints for Medium/Hard)
}}"""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "meta-llama/llama-3.3-70b-instruct:free",
                    "messages": [{"role": "user", "content": prompt}]
                }
            )
            
            if response.status_code != 200:
                print(f"❌ OpenRouter API error: {response.status_code}")
                return task_data  # API error, return original
            
            # Parse LLM response
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            
            # Remove markdown code blocks if present
            content = content.strip()
            if content.startswith("```"):
                # Remove ```json or ``` from start
                content = content.split("\n", 1)[1] if "\n" in content else content
                # Remove ``` from end
                if content.endswith("```"):
                    content = content.rsplit("```", 1)[0]
            
            content = content.strip()
            
            # Extract JSON from response
            enriched = json.loads(content)
            
            print(f"✅ Task enriched: difficulty={enriched.get('difficulty')}, category={enriched.get('category')}")
            
            # Merge enriched data with original
            task_data["title"] = enriched.get("title", task_data["title"])
            task_data["description"] = enriched.get("description", task_data["description"])
            task_data["detailedDescription"] = enriched.get("detailedDescription", "")
            task_data["difficulty"] = enriched.get("difficulty", "Medium")
            task_data["category"] = enriched.get("category", "Bug Fix")
            task_data["timeEstimate"] = enriched.get("timeEstimate", "30 min")
            task_data["hints"] = enriched.get("hints", [])
            
            return task_data
            
    except Exception as e:
        # Any error, return original data
        print(f"❌ LLM enrichment failed: {e}")
        print(f"Response content: {content if 'content' in locals() else 'N/A'}")
        return task_data

import os
import re
import base64
from typing import List, Dict, Optional

import httpx
from fastapi import HTTPException

# Map extensions to languages for Monaco/editor hints
EXT_LANGUAGE_MAP = {
	"py": "Python",
	"js": "JavaScript",
	"ts": "TypeScript",
	"tsx": "TypeScript",
	"jsx": "JavaScript",
	"java": "Java",
	"rb": "Ruby",
	"go": "Go",
	"rs": "Rust",
	"php": "PHP",
	"cs": "C#",
	"cpp": "C++",
	"c": "C",
	"h": "C",
	"html": "HTML",
	"css": "CSS",
	"json": "JSON",
	"yml": "YAML",
	"yaml": "YAML",
	"md": "Markdown",
	"sh": "Shell",
	"toml": "TOML",
	"sql": "SQL"
}

TRUNCATION_LIMIT = 200_000
TRUNCATION_PREVIEW = 5_000


def build_headers(token: Optional[str]) -> Dict[str, str]:
	headers = {
		"Accept": "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28"
	}
	if token:
		headers["Authorization"] = f"token {token}"
        
	return headers


def detect_language(path: str) -> Optional[str]:
	if "." not in path:
		return None
	ext = path.rsplit(".", 1)[-1].lower()
	return EXT_LANGUAGE_MAP.get(ext)


def is_rate_limited(response: httpx.Response) -> bool:
	if response.status_code == 403:
		try:
			data = response.json()
			message = (data.get("message") or "").lower()
			return "rate limit" in message
		except Exception:
			return False
	return False


def is_valid_issue(issue: Dict) -> bool:
	return "pull_request" not in issue


async def fetch_file_content(
	path: str,
	owner: str,
	repo: str,
	client: httpx.AsyncClient,
	headers: Dict[str, str]
) -> Optional[Dict]:
	url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
	try:
		res = await client.get(url, headers=headers, timeout=10.0)
		if is_rate_limited(res):
			raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
		if res.status_code == 200:
			data = res.json()
			raw = base64.b64decode(data["content"]).decode("utf-8", errors="replace")
			truncated = False
			if len(raw) > TRUNCATION_LIMIT:
				truncated = True
				raw = raw[:TRUNCATION_PREVIEW]
			return {
				"path": path,
				"content": raw,
				"language": detect_language(path),
				"truncated": truncated
			}
	except HTTPException:
		raise
	except Exception:
		return None
	return None


async def get_files_from_pr(
	pr_number: int,
	owner: str,
	repo: str,
	client: httpx.AsyncClient,
	headers: Dict[str, str]
) -> List[Dict]:
	pr_details_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}"
	try:
		pr_res = await client.get(pr_details_url, headers=headers, timeout=15.0)
		if is_rate_limited(pr_res):
			raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
		if pr_res.status_code != 200:
			return []
		pr_data = pr_res.json()
	except HTTPException:
		raise
	except Exception:
		return []

	base_sha = pr_data["base"]["sha"]
	head_sha = pr_data["head"]["sha"]

	pr_files_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{pr_number}/files"
	try:
		files_res = await client.get(pr_files_url, headers=headers, timeout=15.0)
		if is_rate_limited(files_res):
			raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
		if files_res.status_code != 200:
			return []
		files_data = files_res.json()
	except HTTPException:
		raise
	except Exception:
		return []

	code_files: List[Dict] = []
	for file in files_data[:3]:
		status = file.get("status")
		filename = file.get("filename")
		if status not in ("modified", "added"):
			continue

		language = detect_language(filename)
		patch = file.get("patch", "")

		if status == "modified":
			file_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{filename}?ref={base_sha}"
			before_missing = False
			try:
				content_res = await client.get(file_url, headers=headers, timeout=15.0)
				if is_rate_limited(content_res):
					raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
				if content_res.status_code == 200:
					file_data = content_res.json()
					raw = base64.b64decode(file_data["content"]).decode("utf-8", errors="replace")
					truncated = False
					if len(raw) > TRUNCATION_LIMIT:
						truncated = True
						raw = raw[:TRUNCATION_PREVIEW]
					code_files.append({
						"path": filename,
						"content": raw,
						"patch": patch,
						"language": language,
						"before_missing": before_missing,
						"truncated": truncated
					})
			except HTTPException:
				raise
			except Exception:
				continue

		elif status == "added":
			before_missing = True
			head_url = f"https://api.github.com/repos/{owner}/{repo}/contents/{filename}?ref={head_sha}"
			content_value = ""
			truncated = False
			try:
				head_res = await client.get(head_url, headers=headers, timeout=15.0)
				if is_rate_limited(head_res):
					raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
				if head_res.status_code == 200:
					head_data = head_res.json()
					raw = base64.b64decode(head_data["content"]).decode("utf-8", errors="replace")
					if len(raw) > TRUNCATION_LIMIT:
						truncated = True
						raw = raw[:TRUNCATION_PREVIEW]
					content_value = raw
			except HTTPException:
				raise
			except Exception:
				content_value = ""

			code_files.append({
				"path": filename,
				"content": content_value,
				"patch": patch,
				"language": language,
				"before_missing": before_missing,
				"truncated": truncated
			})

	return code_files


async def get_files_from_linked_pr(
	issue: Dict,
	owner: str,
	repo: str,
	client: httpx.AsyncClient,
	headers: Dict[str, str]
) -> List[Dict]:
	body = (issue.get("body") or "") + " " + issue.get("title", "")
	pr_pattern = r'#(\d+)'
	pr_numbers = re.findall(pr_pattern, body)

	timeline_url = issue.get("timeline_url")
	if timeline_url:
		try:
			timeline_res = await client.get(timeline_url, headers=headers, timeout=15.0)
			if is_rate_limited(timeline_res):
				raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
			if timeline_res.status_code == 200:
				events = timeline_res.json()
				for event in events:
					if event.get("event") == "cross-referenced":
						source = event.get("source", {})
						src_issue = source.get("issue", {})
						if src_issue.get("pull_request"):
							pr_numbers.append(str(src_issue.get("number")))
		except HTTPException:
			raise
		except Exception:
			pass

	seen = set()
	ordered_prs = []
	for n in pr_numbers:
		if n not in seen:
			seen.add(n)
			ordered_prs.append(n)

	for pr_num in ordered_prs[:3]:
		try:
			pr_int = int(pr_num)
			files = await get_files_from_pr(pr_int, owner, repo, client, headers)
			if files:
				return files
		except HTTPException:
			raise
		except Exception:
			continue

	return []


async def map_issue(
	issue: Dict,
	owner: str,
	repo: str,
	client: httpx.AsyncClient,
	headers: Dict[str, str]
) -> Dict:
	code_files = await get_files_from_linked_pr(issue, owner, repo, client, headers)
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


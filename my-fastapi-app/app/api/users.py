# app/api/users.py
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_users():
    return {"users": []}

@router.post("/")
async def create_user():
    return {"message": "User created"}
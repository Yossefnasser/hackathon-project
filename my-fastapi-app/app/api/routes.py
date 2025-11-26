from fastapi import APIRouter
from app.api.v1 import tasks

router = APIRouter()

# Include v1 tasks router
router.include_router(tasks.router, prefix="/api/v1", tags=["tasks"])

@router.get("/")
async def read_root():
    return {"message": "Welcome to my FastAPI application!"}


def setup_routes(app):
    app.include_router(router)
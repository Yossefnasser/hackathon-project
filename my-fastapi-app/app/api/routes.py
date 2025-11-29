from fastapi import APIRouter
from app.api.v1 import tasks, evaluate

router = APIRouter()

# Include v1 routers
router.include_router(tasks.router, prefix="/api/v1", tags=["tasks"])
router.include_router(evaluate.router, prefix="/api/v1", tags=["evaluate"])

@router.get("/")
async def read_root():
    return {"message": "Welcome to my FastAPI application!"}


def setup_routes(app):
    app.include_router(router)
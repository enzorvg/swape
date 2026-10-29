from fastapi import APIRouter

from app.health.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", operation_id="getHealth")
async def get_health() -> HealthResponse:
    return HealthResponse(status="ok")

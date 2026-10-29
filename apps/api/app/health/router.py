from fastapi import APIRouter

from app import __version__
from app.health.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", operation_id="getHealth")
async def get_health() -> HealthResponse:
    return HealthResponse(status="ok", version=__version__)

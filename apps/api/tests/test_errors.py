from fastapi import APIRouter
from httpx import ASGITransport, AsyncClient

from app.core.errors import NotFoundError
from app.main import create_app


async def test_domain_error_becomes_json_http_error() -> None:
    app = create_app()
    router = APIRouter()

    @router.get("/boom")
    async def boom() -> None:
        raise NotFoundError("Offre introuvable", code="offer_not_found")

    app.include_router(router)
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as http:
        response = await http.get("/boom")

    assert response.status_code == 404
    assert response.json() == {"error": {"code": "offer_not_found", "message": "Offre introuvable"}}

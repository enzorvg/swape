from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app import __version__


async def test_health_returns_ok_and_version(client: AsyncClient) -> None:
    response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": __version__}


async def test_health_version_matches_openapi_version(client: AsyncClient) -> None:
    health = (await client.get("/health")).json()
    openapi = (await client.get("/openapi.json")).json()

    assert health["version"] == openapi["info"]["version"]


async def test_health_is_public(client: AsyncClient) -> None:
    response = await client.get("/health", headers={})

    assert response.status_code == 200


async def test_session_uses_test_database(session: AsyncSession) -> None:
    result = await session.execute(text("select current_database()"))

    assert result.scalar_one() == "swape_test"

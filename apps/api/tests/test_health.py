from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def test_health_returns_ok(client: AsyncClient) -> None:
    response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_session_uses_test_database(session: AsyncSession) -> None:
    result = await session.execute(text("select current_database()"))

    assert result.scalar_one() == "swape_test"

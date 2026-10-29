"""Independent review tests for /health endpoint (#27).

Written from acceptance criteria:
1. GET /health returns 200 with {"status": "ok", "version": "<version>"}
2. app.__version__, /health response, and OpenAPI info.version all match
3. /health is public (accessible without authentication)
4. Other HTTP methods are rejected (405)
"""

import re

from httpx import AsyncClient

from app import __version__


async def test_review_health_status_and_version(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert isinstance(data["version"], str)
    assert len(data["version"]) > 0
    # Version should follow semver (e.g. 0.1.0)
    assert re.match(r"^\d+\.\d+\.\d+", data["version"])


async def test_review_health_version_matches_openapi_and_package(client: AsyncClient) -> None:
    health_res = await client.get("/health")
    assert health_res.status_code == 200
    health_version = health_res.json()["version"]

    openapi_res = await client.get("/openapi.json")
    assert openapi_res.status_code == 200
    openapi_version = openapi_res.json()["info"]["version"]

    assert health_version == __version__
    assert openapi_version == __version__


async def test_review_health_is_public_without_auth(client: AsyncClient) -> None:
    response = await client.get("/health", headers={})
    assert response.status_code == 200


async def test_review_health_method_not_allowed(client: AsyncClient) -> None:
    post_res = await client.post("/health", json={"test": "data"})
    assert post_res.status_code == 405

    delete_res = await client.delete("/health")
    assert delete_res.status_code == 405

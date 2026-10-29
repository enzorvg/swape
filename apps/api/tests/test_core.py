from app.llm.provider import FakeLLMProvider, LLMMessage


async def test_fake_provider_returns_scripted_replies_then_echoes() -> None:
    provider = FakeLLMProvider(replies=["first"])
    messages = [LLMMessage(role="user", content="hello")]

    assert await provider.complete(messages) == "first"
    assert await provider.complete(messages) == "[fake] hello"
    assert len(provider.calls) == 2


def test_discovery_finds_health_router() -> None:
    from app.discovery import discover_routers

    paths = {
        getattr(route, "path", None) for router in discover_routers() for route in router.routes
    }

    assert "/health" in paths

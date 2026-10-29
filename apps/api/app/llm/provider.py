"""The only entry point to a language model in Swape.

Business code depends on `LLMProvider`, never on a vendor SDK. Tests use
`FakeLLMProvider`, which is deterministic and never calls the network.
"""

from dataclasses import dataclass
from typing import Literal, Protocol


@dataclass(frozen=True, slots=True)
class LLMMessage:
    role: Literal["system", "user", "assistant"]
    content: str


class LLMProvider(Protocol):
    async def complete(self, messages: list[LLMMessage]) -> str: ...


class FakeLLMProvider:
    """Deterministic provider for tests: returns scripted replies in order, then echoes."""

    def __init__(self, replies: list[str] | None = None) -> None:
        self._replies = list(replies or [])
        self.calls: list[list[LLMMessage]] = []

    async def complete(self, messages: list[LLMMessage]) -> str:
        self.calls.append(messages)
        if self._replies:
            return self._replies.pop(0)
        return f"[fake] {messages[-1].content}" if messages else "[fake]"

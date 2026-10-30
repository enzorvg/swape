"""Independent review tests for the EventLog contract (issue #19)."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError

from app.simulation.schemas import EventLog, IntegritySignal, LogEntry

_STARTED_AT = datetime(2026, 1, 1, 10, 0, 0, tzinfo=UTC)


def _base_log(**overrides: object) -> dict[str, object]:
    data: dict[str, object] = {
        "session_id": "session_1",
        "scenario_id": "scenario_customer_support_demo",
        "candidate_id": "candidate_anon_1",
        "started_at": _STARTED_AT,
    }
    data.update(overrides)
    return data


def test_minimal_event_log_is_valid() -> None:
    log = EventLog.model_validate(_base_log())
    assert log.entries == []
    assert log.integrity_signals == []


def test_ended_at_before_started_at_raises() -> None:
    data = _base_log(ended_at=_STARTED_AT - timedelta(seconds=1))

    with pytest.raises(ValidationError, match="ended_at"):
        EventLog.model_validate(data)


def test_ended_at_after_started_at_is_valid() -> None:
    data = _base_log(ended_at=_STARTED_AT + timedelta(minutes=15))
    log = EventLog.model_validate(data)
    assert log.ended_at is not None


def test_log_entry_requires_non_negative_elapsed_seconds() -> None:
    entry = {
        "id": "log_1",
        "timestamp": _STARTED_AT,
        "elapsed_seconds": -1,
        "branch_id": "branch_triage",
        "actor_type": "candidate",
        "actor_id": "candidate",
        "window": "chat",
        "action": "send_message",
    }

    with pytest.raises(ValidationError):
        LogEntry.model_validate(entry)


def test_log_entry_minimal_valid() -> None:
    entry = LogEntry.model_validate(
        {
            "id": "log_1",
            "timestamp": _STARTED_AT,
            "elapsed_seconds": 12.5,
            "branch_id": "branch_triage",
            "actor_type": "npc",
            "actor_id": "npc_sarah",
            "window": "chat",
            "action": "send_message",
        }
    )
    assert entry.target_id is None
    assert entry.content == {}


def test_integrity_signal_is_descriptive_not_punitive() -> None:
    """Integrity signals must stay factual hints, never a verdict field (AI Act)."""
    signal = IntegritySignal.model_validate(
        {
            "id": "sig_1",
            "type": "paste_burst",
            "timestamp": _STARTED_AT,
            "elapsed_seconds": 10,
            "description": "Pasted a block of text larger than 400 characters.",
        }
    )

    assert signal.type == "paste_burst"
    assert "description" in IntegritySignal.model_fields
    assert not {"score", "penalty", "verdict", "disqualified"} & set(IntegritySignal.model_fields)

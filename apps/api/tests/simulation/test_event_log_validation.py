"""Unit tests for EventLog and LogEntry schema validation."""

from datetime import UTC, datetime, timedelta

import pytest
from pydantic import ValidationError

from app.simulation import EventLog, IntegritySignal, LogEntry


def test_valid_event_log_structure() -> None:
    """Verifies creation and validation of a comprehensive EventLog."""
    now = datetime.now(UTC)
    ended = now + timedelta(minutes=15)

    log_entry_1 = LogEntry(
        id="entry_01",
        timestamp=now + timedelta(seconds=10),
        elapsed_seconds=10.0,
        branch_id="branch_triage",
        actor_type="npc",
        actor_id="npc_sarah",
        window="chat",
        action="send_message",
        target_id="candidate",
        content={"text": "Bonjour !"},
        metadata={"channel": "general"},
    )

    log_entry_2 = LogEntry(
        id="entry_02",
        timestamp=now + timedelta(seconds=45),
        elapsed_seconds=45.5,
        branch_id="branch_triage",
        actor_type="candidate",
        actor_id="candidate",
        window="task",
        action="update_task_status",
        target_id="task_acme_triage",
        content={"new_status": "in_progress"},
        metadata={"click_count": 1},
    )

    log_entry_3 = LogEntry(
        id="entry_03",
        timestamp=now + timedelta(seconds=90),
        elapsed_seconds=90.0,
        branch_id="branch_resolution",
        actor_type="candidate",
        actor_id="candidate",
        window="file",
        action="read_file",
        target_id="doc_billing_faq",
        content={"path": "/docs/billing/errors.md"},
        metadata={"duration_open_ms": 3500},
    )

    signal = IntegritySignal(
        id="sig_01",
        type="paste_burst",
        timestamp=now + timedelta(seconds=120),
        elapsed_seconds=120.0,
        window="email",
        description="Collage rapide de texte dans l'email",
        metrics={"character_count": 320},
    )

    event_log = EventLog(
        session_id="session_test_123",
        scenario_id="scenario_customer_support_demo",
        candidate_id="cand_anon_987",
        started_at=now,
        ended_at=ended,
        entries=[log_entry_1, log_entry_2, log_entry_3],
        integrity_signals=[signal],
    )

    assert event_log.session_id == "session_test_123"
    assert len(event_log.entries) == 3
    assert len(event_log.integrity_signals) == 1
    assert event_log.entries[1].action == "update_task_status"
    assert event_log.integrity_signals[0].type == "paste_burst"


def test_invalid_event_log_ended_before_started() -> None:
    """Verifies that ended_at cannot be prior to started_at."""
    now = datetime.now(UTC)

    with pytest.raises(ValidationError) as exc_info:
        EventLog(
            session_id="session_invalid_chrono",
            scenario_id="scenario_test",
            candidate_id="cand_test",
            started_at=now,
            ended_at=now - timedelta(seconds=10),
            entries=[],
            integrity_signals=[],
        )

    assert "cannot be earlier than 'started_at'" in str(exc_info.value)


def test_invalid_log_entry_negative_elapsed_seconds() -> None:
    """Verifies that elapsed_seconds cannot be negative."""
    now = datetime.now(UTC)

    with pytest.raises(ValidationError):
        LogEntry(
            id="entry_negative",
            timestamp=now,
            elapsed_seconds=-5.0,
            branch_id="branch_main",
            actor_type="candidate",
            actor_id="candidate",
            window="chat",
            action="send_message",
        )

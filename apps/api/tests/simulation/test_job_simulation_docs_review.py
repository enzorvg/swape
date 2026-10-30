"""Independent review tests for the documentation acceptance criteria of issue #19.

Acceptance criteria 1 and 2 require the scenario and event-log contracts to be
described in docs/job-simulation/*.md. These tests check the required concepts are
actually documented, not just that the files exist.
"""

from __future__ import annotations

from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[4]
_DOCS_DIR = _REPO_ROOT / "docs" / "job-simulation"


def _read(name: str) -> str:
    return (_DOCS_DIR / name).read_text(encoding="utf-8")


def test_scenario_doc_describes_required_concepts() -> None:
    content = _read("scenario.md")

    for concept in [
        "schema_version",
        "job_role",
        "duration_minutes",
        "personality",
        "memory",
        "hidden_objectives",
        "branches",
        "evaluation_criteria",
        "candidate_action",
    ]:
        assert concept in content, f"'{concept}' is not documented in scenario.md"


def test_event_log_doc_describes_required_concepts() -> None:
    content = _read("event-log.md")

    for concept in [
        "timestamp",
        "actor_type",
        "window",
        "action",
        "content",
        "integrity_signals",
    ]:
        assert concept in content, f"'{concept}' is not documented in event-log.md"


def test_event_log_doc_states_integrity_signals_are_not_punitive() -> None:
    content = _read("event-log.md").lower()
    assert "sanction" in content

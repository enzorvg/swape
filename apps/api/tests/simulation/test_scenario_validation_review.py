"""Independent review tests for the Scenario contract (issue #19).

Covers the acceptance criteria from scratch: demo scenario validation, and semantic
rejections (unknown character references, orphan branches) with payloads distinct
from the author's own test suite.
"""

from __future__ import annotations

import copy
from typing import Any

import pytest
from pydantic import ValidationError

from app.simulation.demo import get_demo_scenario, get_demo_scenario_data
from app.simulation.schemas import EventTrigger, Scenario


def _demo_data() -> dict[str, Any]:
    return copy.deepcopy(get_demo_scenario_data())


def test_demo_scenario_matches_acceptance_criteria() -> None:
    scenario = get_demo_scenario()

    assert scenario.job_role == "Customer Support Specialist"
    assert scenario.duration_minutes == 15
    assert len(scenario.characters) == 3
    assert 5 <= len(scenario.events) <= 6
    assert len(scenario.evaluation_criteria) >= 1


def test_event_referencing_unknown_sender_raises() -> None:
    data = _demo_data()
    data["events"][0]["sender_id"] = "npc_does_not_exist"

    with pytest.raises(ValidationError, match="Unknown character reference"):
        Scenario.model_validate(data)


def test_event_referencing_unknown_recipient_raises() -> None:
    data = _demo_data()
    data["events"][0]["recipient_id"] = "npc_ghost"

    with pytest.raises(ValidationError, match="Unknown character reference"):
        Scenario.model_validate(data)


def test_branch_fallback_to_unknown_branch_raises() -> None:
    data = _demo_data()
    data["branches"][0]["fallback_branch_id"] = "branch_does_not_exist"

    with pytest.raises(ValidationError, match="Orphan branch reference"):
        Scenario.model_validate(data)


def test_event_next_branch_to_unknown_branch_raises() -> None:
    data = _demo_data()
    data["events"][0]["next_branch_id"] = "branch_nowhere"

    with pytest.raises(ValidationError, match="Orphan branch reference"):
        Scenario.model_validate(data)


def test_event_branch_id_unknown_raises() -> None:
    data = _demo_data()
    data["events"][0]["branch_id"] = "branch_nowhere"

    with pytest.raises(ValidationError, match="Orphan branch reference"):
        Scenario.model_validate(data)


def test_initial_branch_not_declared_raises() -> None:
    data = _demo_data()
    data["initial_branch_id"] = "branch_unknown"

    with pytest.raises(ValidationError, match="Initial branch"):
        Scenario.model_validate(data)


def test_duplicate_character_id_raises() -> None:
    data = _demo_data()
    data["characters"].append(dict(data["characters"][0]))

    with pytest.raises(ValidationError, match="Duplicate character id"):
        Scenario.model_validate(data)


def test_duplicate_branch_id_raises() -> None:
    data = _demo_data()
    data["branches"].append(dict(data["branches"][0]))

    with pytest.raises(ValidationError, match="Duplicate branch id"):
        Scenario.model_validate(data)


def test_non_positive_duration_raises() -> None:
    data = _demo_data()
    data["duration_minutes"] = 0

    with pytest.raises(ValidationError):
        Scenario.model_validate(data)


def test_trigger_time_without_at_second_raises() -> None:
    with pytest.raises(ValidationError, match="must specify 'at_second'"):
        EventTrigger.model_validate({"type": "time"})


def test_trigger_candidate_action_without_action_type_raises() -> None:
    with pytest.raises(ValidationError, match="must specify 'action_type'"):
        EventTrigger.model_validate({"type": "candidate_action"})


def test_trigger_time_with_at_second_is_valid() -> None:
    trigger = EventTrigger.model_validate({"type": "time", "at_second": 0})
    assert trigger.at_second == 0

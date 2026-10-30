"""Unit tests for Scenario schema validation and semantic integrity."""

import pytest
from pydantic import ValidationError

from app.simulation import Scenario, get_demo_scenario, get_demo_scenario_data


def test_demo_scenario_validation_succeeds() -> None:
    """Verifies that the customer support demo scenario passes validation.

    Acceptance criteria:
    - Customer support role (15 min duration)
    - 3 NPCs
    - 5 to 6 events (here 6 events)
    """
    raw_data = get_demo_scenario_data()
    scenario = Scenario.model_validate(raw_data)

    assert scenario.job_role == "Customer Support Specialist"
    assert scenario.duration_minutes == 15
    assert len(scenario.characters) == 3
    assert len(scenario.events) == 6
    assert len(scenario.branches) == 2
    assert len(scenario.evaluation_criteria) == 3

    # Also check helper
    helper_instance = get_demo_scenario()
    assert helper_instance.id == scenario.id


def test_invalid_scenario_unknown_sender_character() -> None:
    """Verifies explicit error when an event references an undeclared sender."""
    data = get_demo_scenario_data()
    data["events"][0]["sender_id"] = "npc_ghost_user"

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    errors_str = str(exc_info.value)
    assert "Unknown character reference" in errors_str
    assert "npc_ghost_user" in errors_str


def test_invalid_scenario_unknown_recipient_character() -> None:
    """Verifies explicit error when an event references an undeclared recipient."""
    data = get_demo_scenario_data()
    data["events"][0]["recipient_id"] = "npc_unknown_recipient"

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    errors_str = str(exc_info.value)
    assert "Unknown character reference" in errors_str
    assert "npc_unknown_recipient" in errors_str


def test_invalid_scenario_orphan_branch_in_event() -> None:
    """Verifies explicit error when an event references an unknown branch."""
    data = get_demo_scenario_data()
    data["events"][0]["branch_id"] = "branch_non_existent"

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    errors_str = str(exc_info.value)
    assert "Orphan branch reference" in errors_str
    assert "branch_non_existent" in errors_str


def test_invalid_scenario_orphan_next_branch() -> None:
    """Verifies explicit error when an event transitions to an undeclared branch."""
    data = get_demo_scenario_data()
    data["events"][2]["next_branch_id"] = "branch_missing_destination"

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    errors_str = str(exc_info.value)
    assert "Orphan branch reference" in errors_str
    assert "branch_missing_destination" in errors_str


def test_invalid_scenario_orphan_fallback_branch() -> None:
    """Verifies explicit error when a branch has an undeclared fallback branch."""
    data = get_demo_scenario_data()
    data["branches"][0]["fallback_branch_id"] = "branch_phantom"

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    errors_str = str(exc_info.value)
    assert "Orphan branch reference" in errors_str
    assert "branch_phantom" in errors_str


def test_invalid_scenario_unknown_initial_branch() -> None:
    """Verifies explicit error when initial_branch_id is unknown."""
    data = get_demo_scenario_data()
    data["initial_branch_id"] = "unknown_start"

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    errors_str = str(exc_info.value)
    assert "Initial branch 'unknown_start' does not exist" in errors_str


def test_invalid_scenario_duplicate_character_ids() -> None:
    """Verifies explicit error when duplicate character IDs are declared."""
    data = get_demo_scenario_data()
    data["characters"].append(data["characters"][0].copy())

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "Duplicate character id detected" in str(exc_info.value)


def test_invalid_scenario_duplicate_branch_ids() -> None:
    """Verifies explicit error when duplicate branch IDs are declared."""
    data = get_demo_scenario_data()
    data["branches"].append(data["branches"][0].copy())

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "Duplicate branch id detected" in str(exc_info.value)


def test_invalid_duration_zero_or_negative() -> None:
    """Verifies validation error if duration is 0 or negative."""
    data = get_demo_scenario_data()
    data["duration_minutes"] = 0

    with pytest.raises(ValidationError):
        Scenario.model_validate(data)


def test_ai_act_empty_required_observations() -> None:
    """Verifies AI Act constraint: criterion required_observations cannot be blank."""
    data = get_demo_scenario_data()
    data["evaluation_criteria"][0]["required_observations"] = "   "

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "AI Act" in str(exc_info.value)
    assert "required_observations" in str(exc_info.value)


def test_ai_act_empty_evidence_sources() -> None:
    """Verifies AI Act constraint: criterion evidence_sources must have valid entries."""
    data = get_demo_scenario_data()
    data["evaluation_criteria"][0]["evidence_sources"] = []

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "evidence_sources" in str(exc_info.value)


def test_event_trigger_consistency() -> None:
    """Verifies trigger validation for time without at_second or action without action_type."""
    data = get_demo_scenario_data()
    data["events"][0]["trigger"] = {"type": "time"}

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "must specify 'at_second'" in str(exc_info.value)

    data = get_demo_scenario_data()
    data["events"][0]["trigger"] = {"type": "candidate_action"}

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "must specify 'action_type'" in str(exc_info.value)


def test_invalid_scenario_duplicate_event_ids() -> None:
    """Verifies explicit error when duplicate event IDs are declared."""
    data = get_demo_scenario_data()
    data["events"].append(data["events"][0].copy())

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "Duplicate event id detected" in str(exc_info.value)


def test_invalid_scenario_duplicate_criterion_ids() -> None:
    """Verifies explicit error when duplicate evaluation criterion IDs are declared."""
    data = get_demo_scenario_data()
    data["evaluation_criteria"].append(data["evaluation_criteria"][0].copy())

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "Duplicate evaluation criterion id detected" in str(exc_info.value)


def test_ai_act_whitespace_evidence_source() -> None:
    """Verifies AI Act constraint: evidence sources cannot contain whitespace-only items."""
    data = get_demo_scenario_data()
    data["evaluation_criteria"][0]["evidence_sources"] = ["window:chat", "   "]

    with pytest.raises(ValidationError) as exc_info:
        Scenario.model_validate(data)

    assert "must contain non-empty sources" in str(exc_info.value)

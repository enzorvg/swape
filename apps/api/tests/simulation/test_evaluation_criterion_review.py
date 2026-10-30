"""Independent review tests for AI Act explainability constraints (issue #19).

Each EvaluationCriterion must carry non-empty factual observations and at least one
non-empty evidence source, per the project's AI Act rules (CLAUDE.md §10): no opaque
score, explainable criterion by criterion.
"""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.simulation.schemas import EvaluationCriterion

_BASE = {
    "id": "crit_test",
    "name": "Test criterion",
    "description": "A test criterion",
    "category": "communication",
    "required_observations": "The candidate does X",
    "evidence_sources": ["window:chat"],
}


def test_valid_criterion_is_accepted() -> None:
    criterion = EvaluationCriterion.model_validate(_BASE)
    assert criterion.weight == 1.0


def test_empty_required_observations_raises() -> None:
    data = {**_BASE, "required_observations": "   "}

    with pytest.raises(ValidationError, match="required_observations"):
        EvaluationCriterion.model_validate(data)


def test_empty_evidence_source_string_raises() -> None:
    data = {**_BASE, "evidence_sources": ["window:chat", "   "]}

    with pytest.raises(ValidationError, match="evidence_sources"):
        EvaluationCriterion.model_validate(data)


def test_missing_evidence_sources_raises() -> None:
    data = {**_BASE, "evidence_sources": []}

    with pytest.raises(ValidationError):
        EvaluationCriterion.model_validate(data)


@pytest.mark.parametrize("weight", [0, -1.0])
def test_non_positive_weight_raises(weight: float) -> None:
    data = {**_BASE, "weight": weight}

    with pytest.raises(ValidationError):
        EvaluationCriterion.model_validate(data)

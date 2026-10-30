"""Pydantic schemas and semantic validation for Job Simulation contracts.

Defines the two core contracts:
1. Scenario: versioned structure for simulation scenarios (job, duration, characters,
   branches, events, AI Act explainable evaluation criteria).
2. EventLog: chronologically ordered journal of actions and integrity signals.
"""

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field, model_validator

TriggerType = Literal["time", "candidate_action"]
WindowType = Literal["chat", "email", "task", "file"]
ActorType = Literal["candidate", "npc", "system"]


class Character(BaseModel):
    """Virtual character (NPC) participating in the simulation."""

    id: str = Field(..., description="Unique identifier of the character (e.g. 'npc_sarah')")
    name: str = Field(..., description="Display name of the character")
    role: str = Field(..., description="Job role in the simulated company")
    personality: str = Field(..., description="Style and tone directives for LLM prompting")
    memory: str = Field(..., description="Context and business facts known by this character")
    hidden_objectives: str = Field(
        ..., description="Secret role-play goals evaluated during the simulation"
    )


class EventTrigger(BaseModel):
    """Trigger conditions for a simulation event."""

    type: TriggerType = Field(..., description="Trigger type: 'time' or 'candidate_action'")
    at_second: int | None = Field(
        None, ge=0, description="Relative second when the event fires (for 'time' trigger)"
    )
    action_type: str | None = Field(
        None, description="Action name triggering this event (for 'candidate_action' trigger)"
    )
    conditions: dict[str, Any] = Field(
        default_factory=dict, description="Additional context or matching conditions"
    )

    @model_validator(mode="after")
    def validate_trigger_consistency(self) -> EventTrigger:
        if self.type == "time" and self.at_second is None:
            raise ValueError("Trigger with type 'time' must specify 'at_second'")
        if self.type == "candidate_action" and not self.action_type:
            raise ValueError("Trigger with type 'candidate_action' must specify 'action_type'")
        return self


class SimulationEvent(BaseModel):
    """Scheduled or reactive event in a simulation branch."""

    id: str = Field(..., description="Unique identifier of the event")
    branch_id: str = Field(..., description="Branch to which this event belongs")
    trigger: EventTrigger = Field(..., description="Trigger condition")
    window: WindowType = Field(..., description="UI window where the event occurs")
    sender_id: str = Field(..., description="Sender: character ID, 'system', or 'candidate'")
    recipient_id: str = Field(
        ..., description="Recipient: character ID, 'candidate', 'system', or 'all'"
    )
    action: str = Field(..., description="Action verb (e.g. 'send_message', 'create_task')")
    payload: dict[str, Any] = Field(
        default_factory=dict, description="Structured event payload (text, ticket details, etc.)"
    )
    next_branch_id: str | None = Field(
        None, description="Optional target branch id if this event transitions to a new branch"
    )


class Branch(BaseModel):
    """Narrative branch grouping a sequence of events."""

    id: str = Field(..., description="Unique identifier of the branch")
    title: str = Field(..., description="Human-readable title of the branch")
    description: str = Field(
        ..., description="Summary of the situation and objective in this branch"
    )
    fallback_branch_id: str | None = Field(
        None, description="Optional fallback branch if actions are uncompleted"
    )


class EvaluationCriterion(BaseModel):
    """Explainable evaluation criterion complying with the EU AI Act.

    AI Act high-risk requirements:
    - No opaque global score.
    - Each criterion must be fully explainable through factual observations and log evidence.
    """

    id: str = Field(..., description="Unique identifier of the criterion")
    name: str = Field(..., description="Name of the evaluated skill / competency")
    description: str = Field(..., description="Detailed description of what is evaluated")
    category: str = Field(
        ..., description="Category (e.g. 'communication', 'problem_solving', 'prioritization')"
    )
    weight: float = Field(1.0, gt=0, description="Relative weight of the criterion (> 0)")
    required_observations: str = Field(
        ..., description="Factual patterns that the evaluator must observe in candidate behavior"
    )
    evidence_sources: list[str] = Field(
        ..., min_length=1, description="Event log filter keys serving as verifiable evidence"
    )

    @model_validator(mode="after")
    def validate_ai_act_explicability(self) -> EvaluationCriterion:
        if not self.required_observations.strip():
            msg = (
                f"EvaluationCriterion '{self.id}' violates AI Act: "
                "'required_observations' cannot be empty"
            )
            raise ValueError(msg)
        if not self.evidence_sources or any(not src.strip() for src in self.evidence_sources):
            msg = (
                f"EvaluationCriterion '{self.id}' violates AI Act: "
                "'evidence_sources' must contain non-empty sources"
            )
            raise ValueError(msg)
        return self


class Scenario(BaseModel):
    """Full Job Simulation scenario contract."""

    schema_version: str = Field("1.0.0", description="SemVer version of the scenario schema")
    id: str = Field(..., description="Unique scenario ID")
    title: str = Field(..., description="Job simulation title")
    job_role: str = Field(..., description="Target job title (e.g. 'Customer Support Specialist')")
    description: str = Field(..., description="General briefing and instructions for the candidate")
    duration_minutes: int = Field(..., gt=0, description="Duration in minutes (must be > 0)")
    characters: list[Character] = Field(..., min_length=1, description="List of NPCs")
    initial_branch_id: str = Field(..., description="ID of the initial branch")
    branches: list[Branch] = Field(..., min_length=1, description="List of branches")
    events: list[SimulationEvent] = Field(..., description="List of simulation events")
    evaluation_criteria: list[EvaluationCriterion] = Field(
        ..., min_length=1, description="Explainable evaluation criteria"
    )

    @model_validator(mode="after")
    def validate_semantic_integrity(self) -> Scenario:
        # 1. Validate uniqueness of IDs
        char_ids = {c.id for c in self.characters}
        if len(char_ids) != len(self.characters):
            raise ValueError("Duplicate character id detected in scenario")

        branch_ids = {b.id for b in self.branches}
        if len(branch_ids) != len(self.branches):
            raise ValueError("Duplicate branch id detected in scenario")

        event_ids = {e.id for e in self.events}
        if len(event_ids) != len(self.events):
            raise ValueError("Duplicate event id detected in scenario")

        crit_ids = {c.id for c in self.evaluation_criteria}
        if len(crit_ids) != len(self.evaluation_criteria):
            raise ValueError("Duplicate evaluation criterion id detected in scenario")

        # 2. Validate initial branch
        if self.initial_branch_id not in branch_ids:
            msg = f"Initial branch '{self.initial_branch_id}' does not exist in declared branches"
            raise ValueError(msg)

        # 3. Validate branch references in branches (fallback_branch_id)
        for branch in self.branches:
            if branch.fallback_branch_id and branch.fallback_branch_id not in branch_ids:
                msg = (
                    f"Orphan branch reference: branch '{branch.id}' "
                    f"references unknown fallback branch '{branch.fallback_branch_id}'"
                )
                raise ValueError(msg)

        # 4. Validate events consistency
        allowed_special_actors = {"candidate", "system", "all"}
        for event in self.events:
            # Check event branch
            if event.branch_id not in branch_ids:
                msg = (
                    f"Orphan branch reference: event '{event.id}' "
                    f"references unknown branch '{event.branch_id}'"
                )
                raise ValueError(msg)

            # Check next_branch_id if present
            if event.next_branch_id and event.next_branch_id not in branch_ids:
                msg = (
                    f"Orphan branch reference: event '{event.id}' "
                    f"transitions to unknown next branch '{event.next_branch_id}'"
                )
                raise ValueError(msg)

            # Check sender
            if event.sender_id not in allowed_special_actors and event.sender_id not in char_ids:
                msg = (
                    f"Unknown character reference: event '{event.id}' "
                    f"references unknown sender '{event.sender_id}'"
                )
                raise ValueError(msg)

            # Check recipient
            if (
                event.recipient_id not in allowed_special_actors
                and event.recipient_id not in char_ids
            ):
                msg = (
                    f"Unknown character reference: event '{event.id}' "
                    f"references unknown recipient '{event.recipient_id}'"
                )
                raise ValueError(msg)

        return self


# ==============================================================================
# Event Log Contracts
# ==============================================================================


class LogEntry(BaseModel):
    """Single factual log entry recording an interaction or event in the simulation."""

    id: str = Field(..., description="Unique entry ID")
    timestamp: datetime = Field(..., description="UTC ISO timestamp of the action")
    elapsed_seconds: float = Field(
        ..., ge=0, description="Seconds elapsed since the start of the simulation"
    )
    branch_id: str = Field(..., description="Branch active when the event occurred")
    actor_type: ActorType = Field(..., description="Category of actor: candidate, npc, system")
    actor_id: str = Field(..., description="ID of the actor (candidate, npc_*, or system)")
    window: WindowType = Field(..., description="Active window (chat, email, task, file)")
    action: str = Field(..., description="Action verb (send_message, update_task, etc.)")
    target_id: str | None = Field(
        None, description="Recipient or target entity ID (e.g. task_12, npc_alex)"
    )
    content: dict[str, Any] = Field(
        default_factory=dict, description="Payload content of the action"
    )
    metadata: dict[str, Any] = Field(
        default_factory=dict, description="Technical metadata (word count, duration, etc.)"
    )


class IntegritySignal(BaseModel):
    """Non-punitive integrity indicator recorded during the simulation.

    AI Act / Swape rule:
    - Integrity signals are factual hints provided to the human recruiter.
    - Never triggers automated disqualification or sanction.
    """

    id: str = Field(..., description="Unique signal ID")
    type: str = Field(
        ..., description="Signal type: 'paste_burst', 'window_blur', 'unusual_typing_speed', etc."
    )
    timestamp: datetime = Field(..., description="UTC timestamp of the signal")
    elapsed_seconds: float = Field(..., ge=0, description="Elapsed seconds since session start")
    window: WindowType | None = Field(
        None, description="UI window where the signal occurred, if applicable"
    )
    description: str = Field(
        ..., description="Human-readable factual description of the observed hint"
    )
    metrics: dict[str, Any] = Field(
        default_factory=dict, description="Quantitative measurements (e.g. character_count: 500)"
    )


class EventLog(BaseModel):
    """Full session event log used as the single source of truth for evaluation."""

    schema_version: str = Field("1.0.0", description="SemVer version of the event log schema")
    session_id: str = Field(..., description="Simulation session UUID")
    scenario_id: str = Field(..., description="Referenced scenario ID")
    candidate_id: str = Field(..., description="Anonymized candidate UUID")
    started_at: datetime = Field(..., description="UTC timestamp of session start")
    ended_at: datetime | None = Field(None, description="UTC timestamp of session end")
    entries: list[LogEntry] = Field(
        default_factory=list, description="Chronological list of log entries"
    )
    integrity_signals: list[IntegritySignal] = Field(
        default_factory=list, description="List of integrity hints for the recruiter"
    )

    @model_validator(mode="after")
    def validate_chronology(self) -> EventLog:
        if self.ended_at and self.ended_at < self.started_at:
            raise ValueError("Session 'ended_at' cannot be earlier than 'started_at'")
        return self

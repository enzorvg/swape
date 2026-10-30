from datetime import datetime
from enum import StrEnum
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    SmallInteger,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, TimestampMixin, UUIDPrimaryKeyMixin, pg_enum


class SwipeDirection(StrEnum):
    LEFT = "left"
    RIGHT = "right"


class ApplicationStatus(StrEnum):
    PENDING = "pending"
    MATCHED = "matched"
    REJECTED = "rejected"


class Swipe(UUIDPrimaryKeyMixin, CreatedAtMixin, Base):
    __tablename__ = "swipes"
    __table_args__ = (UniqueConstraint("candidate_id", "job_offer_id"),)

    candidate_id: Mapped[UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"))
    job_offer_id: Mapped[UUID] = mapped_column(
        ForeignKey("job_offers.id", ondelete="CASCADE"), index=True
    )
    direction: Mapped[SwipeDirection] = mapped_column(pg_enum(SwipeDirection, "swipe_direction"))


class Application(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("candidate_id", "job_offer_id"),
        CheckConstraint("compatibility_score BETWEEN 0 AND 100", name="score_range"),
        CheckConstraint("required_skills_count >= 0", name="required_skills_positive"),
        CheckConstraint(
            "matched_skills_count BETWEEN 0 AND required_skills_count",
            name="matched_skills_range",
        ),
        CheckConstraint("char_length(motivation) <= 2000", name="motivation_length"),
        CheckConstraint("status = 'pending' OR decided_at IS NOT NULL", name="decided_at_set"),
    )

    candidate_id: Mapped[UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"))
    job_offer_id: Mapped[UUID] = mapped_column(
        ForeignKey("job_offers.id", ondelete="CASCADE"), index=True
    )
    status: Mapped[ApplicationStatus] = mapped_column(
        pg_enum(ApplicationStatus, "application_status"),
        server_default=ApplicationStatus.PENDING.value,
        index=True,
    )
    motivation: Mapped[str | None] = mapped_column(Text)
    compatibility_score: Mapped[int] = mapped_column(SmallInteger)
    matched_skills_count: Mapped[int] = mapped_column(SmallInteger)
    required_skills_count: Mapped[int] = mapped_column(SmallInteger)
    decided_by_recruiter_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("recruiters.id", ondelete="SET NULL")
    )
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

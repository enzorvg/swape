from datetime import date, datetime
from enum import StrEnum
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import TimestampMixin, UUIDPrimaryKeyMixin, pg_enum, utc_now


class SubscriptionPlan(StrEnum):
    CANDIDATE_PREMIUM = "candidate_premium"
    COMPANY_PRO_MONTHLY = "company_pro_monthly"
    COMPANY_PRO_YEARLY = "company_pro_yearly"


class SubscriptionStatus(StrEnum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    EXPIRED = "expired"


class Subscription(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "subscriptions"
    __table_args__ = (
        CheckConstraint("num_nonnulls(candidate_id, company_id) = 1", name="single_holder"),
        CheckConstraint(
            "(plan = 'candidate_premium') = (candidate_id IS NOT NULL)", name="plan_matches_holder"
        ),
        Index(
            "uq_subscriptions_active_candidate",
            "candidate_id",
            unique=True,
            postgresql_where=text("status = 'active'"),
        ),
        Index(
            "uq_subscriptions_active_company",
            "company_id",
            unique=True,
            postgresql_where=text("status = 'active'"),
        ),
    )

    candidate_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("candidates.id", ondelete="CASCADE")
    )
    company_id: Mapped[UUID | None] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"))
    plan: Mapped[SubscriptionPlan] = mapped_column(pg_enum(SubscriptionPlan, "subscription_plan"))
    status: Mapped[SubscriptionStatus] = mapped_column(
        pg_enum(SubscriptionStatus, "subscription_status"),
        server_default=SubscriptionStatus.ACTIVE.value,
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    current_period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    canceled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    provider_subscription_id: Mapped[str | None] = mapped_column(String(255), unique=True)


class SwipeCounter(Base):
    __tablename__ = "swipe_counters"
    __table_args__ = (CheckConstraint("swipe_count >= 0", name="count_positive"),)

    candidate_id: Mapped[UUID] = mapped_column(
        ForeignKey("candidates.id", ondelete="CASCADE"), primary_key=True
    )
    # Calendar day in Europe/Paris: a new row each day resets the count without a scheduled job.
    swipe_date: Mapped[date] = mapped_column(Date, primary_key=True)
    swipe_count: Mapped[int] = mapped_column(Integer, server_default=text("0"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, onupdate=utc_now
    )

from enum import StrEnum
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, Integer, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, TimestampMixin, UUIDPrimaryKeyMixin, pg_enum


class ContractType(StrEnum):
    INTERNSHIP = "internship"
    APPRENTICESHIP = "apprenticeship"
    FIXED_TERM = "fixed_term"
    PERMANENT = "permanent"
    TEMPORARY = "temporary"
    STUDENT_JOB = "student_job"


class OfferStatus(StrEnum):
    ACTIVE = "active"
    FILLED = "filled"
    ARCHIVED = "archived"


class SalaryPeriod(StrEnum):
    HOUR = "hour"
    MONTH = "month"
    YEAR = "year"


class JobOffer(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "job_offers"
    __table_args__ = (
        CheckConstraint("duration_months > 0", name="duration_positive"),
        CheckConstraint("salary_min >= 0", name="salary_min_positive"),
        CheckConstraint("salary_max >= 0", name="salary_max_positive"),
        CheckConstraint("salary_max >= salary_min", name="salary_range"),
        CheckConstraint(
            "(salary_min IS NULL AND salary_max IS NULL) OR salary_period IS NOT NULL",
            name="salary_period_set",
        ),
    )

    company_id: Mapped[UUID] = mapped_column(
        ForeignKey("companies.id", ondelete="CASCADE"), index=True
    )
    created_by_recruiter_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("recruiters.id", ondelete="SET NULL")
    )
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    contract_type: Mapped[ContractType] = mapped_column(pg_enum(ContractType, "contract_type"))
    status: Mapped[OfferStatus] = mapped_column(
        pg_enum(OfferStatus, "offer_status"), server_default=OfferStatus.ACTIVE.value, index=True
    )
    city: Mapped[str] = mapped_column(String(100))
    duration_months: Mapped[int | None] = mapped_column(SmallInteger)
    salary_min: Mapped[int | None] = mapped_column(Integer)
    salary_max: Mapped[int | None] = mapped_column(Integer)
    salary_period: Mapped[SalaryPeriod | None] = mapped_column(
        pg_enum(SalaryPeriod, "salary_period")
    )


class OfferSkill(CreatedAtMixin, Base):
    __tablename__ = "offer_skills"

    job_offer_id: Mapped[UUID] = mapped_column(
        ForeignKey("job_offers.id", ondelete="CASCADE"), primary_key=True
    )
    skill_id: Mapped[UUID] = mapped_column(
        ForeignKey("skills.id", ondelete="RESTRICT"), primary_key=True
    )

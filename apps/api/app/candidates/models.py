from datetime import date
from enum import StrEnum
from uuid import UUID

from sqlalchemy import (
    CHAR,
    Boolean,
    CheckConstraint,
    Date,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    false,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, TimestampMixin, UUIDPrimaryKeyMixin, pg_enum


class EducationLevel(StrEnum):
    NO_DEGREE = "no_degree"
    BAC = "bac"
    BAC_2 = "bac_2"
    BAC_3 = "bac_3"
    BAC_5 = "bac_5"
    BAC_8 = "bac_8"


class LanguageLevel(StrEnum):
    A1 = "a1"
    A2 = "a2"
    B1 = "b1"
    B2 = "b2"
    C1 = "c1"
    C2 = "c2"
    NATIVE = "native"


class Candidate(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "candidates"
    __table_args__ = (
        CheckConstraint("char_length(about) <= 2000", name="about_length"),
        CheckConstraint("char_length(cover_letter) <= 5000", name="cover_letter_length"),
    )

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(20))
    about: Mapped[str | None] = mapped_column(Text)
    city: Mapped[str | None] = mapped_column(String(100))
    education_level: Mapped[EducationLevel | None] = mapped_column(
        pg_enum(EducationLevel, "education_level")
    )
    available_from: Mapped[date | None] = mapped_column(Date)
    cv_key: Mapped[str | None] = mapped_column(String(500))
    cover_letter: Mapped[str | None] = mapped_column(Text)
    intro_video_key: Mapped[str | None] = mapped_column(String(500))
    is_verified: Mapped[bool] = mapped_column(Boolean, server_default=false())


class Skill(UUIDPrimaryKeyMixin, CreatedAtMixin, Base):
    __tablename__ = "skills"
    __table_args__ = (CheckConstraint("name = lower(name)", name="name_lowercase"),)

    name: Mapped[str] = mapped_column(String(80), unique=True)


class CandidateSkill(CreatedAtMixin, Base):
    __tablename__ = "candidate_skills"

    candidate_id: Mapped[UUID] = mapped_column(
        ForeignKey("candidates.id", ondelete="CASCADE"), primary_key=True
    )
    skill_id: Mapped[UUID] = mapped_column(
        ForeignKey("skills.id", ondelete="RESTRICT"), primary_key=True
    )


class Education(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "educations"
    __table_args__ = (CheckConstraint("end_date >= start_date", name="end_after_start"),)

    candidate_id: Mapped[UUID] = mapped_column(
        ForeignKey("candidates.id", ondelete="CASCADE"), index=True
    )
    school: Mapped[str] = mapped_column(String(200))
    degree: Mapped[str] = mapped_column(String(200))
    field_of_study: Mapped[str | None] = mapped_column(String(200))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)


class Experience(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "experiences"
    __table_args__ = (CheckConstraint("end_date >= start_date", name="end_after_start"),)

    candidate_id: Mapped[UUID] = mapped_column(
        ForeignKey("candidates.id", ondelete="CASCADE"), index=True
    )
    company_name: Mapped[str] = mapped_column(String(200))
    job_title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)


class CandidateLanguage(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "candidate_languages"
    __table_args__ = (UniqueConstraint("candidate_id", "language_code"),)

    candidate_id: Mapped[UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"))
    language_code: Mapped[str] = mapped_column(CHAR(2))
    level: Mapped[LanguageLevel] = mapped_column(pg_enum(LanguageLevel, "language_level"))

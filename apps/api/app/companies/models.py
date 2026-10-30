from uuid import UUID

from sqlalchemy import CHAR, CheckConstraint, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.db.mixins import CreatedAtMixin, TimestampMixin, UUIDPrimaryKeyMixin


class Company(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "companies"
    __table_args__ = (CheckConstraint("siret ~ '^[0-9]{14}$'", name="siret_digits"),)

    name: Mapped[str] = mapped_column(String(200))
    siret: Mapped[str] = mapped_column(CHAR(14), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String(500))
    city: Mapped[str | None] = mapped_column(String(100))
    logo_key: Mapped[str | None] = mapped_column(String(500))


class Recruiter(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "recruiters"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    company_id: Mapped[UUID] = mapped_column(ForeignKey("companies.id", ondelete="RESTRICT"))
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    job_title: Mapped[str | None] = mapped_column(String(150))


class Favorite(UUIDPrimaryKeyMixin, CreatedAtMixin, Base):
    __tablename__ = "favorites"
    __table_args__ = (UniqueConstraint("recruiter_id", "candidate_id", "job_offer_id"),)

    recruiter_id: Mapped[UUID] = mapped_column(ForeignKey("recruiters.id", ondelete="CASCADE"))
    candidate_id: Mapped[UUID] = mapped_column(ForeignKey("candidates.id", ondelete="CASCADE"))
    job_offer_id: Mapped[UUID] = mapped_column(ForeignKey("job_offers.id", ondelete="CASCADE"))

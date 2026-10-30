"""Column helpers shared by the models of every domain."""

from datetime import UTC, datetime
from enum import StrEnum
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column


def pg_enum(enum_class: type[StrEnum], name: str) -> Enum:
    """Native PostgreSQL enum storing the member values, not their names."""
    return Enum(enum_class, name=name, values_callable=lambda members: [m.value for m in members])


def utc_now() -> datetime:
    return datetime.now(UTC)


class UUIDPrimaryKeyMixin:
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)


class CreatedAtMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class TimestampMixin(CreatedAtMixin):
    # Python-side onupdate: a server-side one would expire the attribute and force a lazy load.
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=utc_now
    )

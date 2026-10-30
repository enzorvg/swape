"""Constraints and deletion rules of docs/mcd.md, checked on real PostgreSQL."""

from collections.abc import Awaitable, Callable
from datetime import UTC, date, datetime

import pytest
from sqlalchemy import ColumnElement, String, cast, delete, func, insert, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.applications.models import Application, ApplicationStatus, Swipe, SwipeDirection
from app.auth.models import User
from app.candidates.models import (
    Candidate,
    CandidateLanguage,
    CandidateSkill,
    Education,
    Experience,
    Skill,
)
from app.companies.models import Company, Favorite, Recruiter
from app.db.base import Base
from app.discovery import import_models
from app.messaging.models import Conversation, Message
from app.offers.models import JobOffer, OfferSkill, OfferStatus, SalaryPeriod
from app.subscriptions.models import (
    Subscription,
    SubscriptionPlan,
    SubscriptionStatus,
    SwipeCounter,
)
from scripts.seed import SeedRefusedError, seed
from tests import factories

FACTORIES = [
    getattr(factories, name) for name in sorted(dir(factories)) if name.startswith("make_")
]


async def assert_rejected(
    session: AsyncSession, action: Callable[[], Awaitable[object]], constraint: str
) -> None:
    with pytest.raises(IntegrityError, match=constraint):
        async with session.begin_nested():
            await action()


async def count_rows(session: AsyncSession, model: type[Base], *where: ColumnElement[bool]) -> int:
    total = await session.scalar(select(func.count()).select_from(model).where(*where))
    return total or 0


def test_every_table_of_the_mcd_has_a_model() -> None:
    import_models()

    assert set(Base.metadata.tables) == {
        "users",
        "candidates",
        "recruiters",
        "companies",
        "job_offers",
        "skills",
        "candidate_skills",
        "offer_skills",
        "educations",
        "experiences",
        "candidate_languages",
        "swipes",
        "swipe_counters",
        "applications",
        "conversations",
        "messages",
        "subscriptions",
        "favorites",
    }


def test_every_model_has_a_factory() -> None:
    import_models()

    assert len(FACTORIES) == len(Base.metadata.tables)


@pytest.mark.parametrize("factory", FACTORIES, ids=lambda factory: factory.__name__)
async def test_factory_persists_a_row(
    session: AsyncSession, factory: Callable[[AsyncSession], Awaitable[object]]
) -> None:
    assert await factory(session) is not None


async def test_server_defaults_are_applied(session: AsyncSession) -> None:
    user = await factories.make_user(session)
    offer = await factories.make_job_offer(session)
    application = await factories.make_application(session)
    subscription = await factories.make_subscription(session)

    assert user.is_active is True
    assert user.created_at.tzinfo is not None
    assert offer.status is OfferStatus.ACTIVE
    assert application.status is ApplicationStatus.PENDING
    assert subscription.status is SubscriptionStatus.ACTIVE


async def test_enums_store_lowercase_values(session: AsyncSession) -> None:
    await factories.make_swipe(session, direction=SwipeDirection.LEFT)

    stored = await session.scalar(select(cast(Swipe.direction, String)))

    assert stored == "left"


async def test_updated_at_changes_on_update(session: AsyncSession) -> None:
    user = await factories.make_user(session)
    before = user.updated_at

    user.is_active = False
    await session.flush()

    assert user.updated_at > before


# --- Unique constraints


@pytest.mark.parametrize(
    ("factory", "field", "value"),
    [
        (factories.make_user, "email", "same@example.com"),
        (factories.make_company, "siret", "12345678901234"),
        (factories.make_skill, "name", "python"),
    ],
)
async def test_unique_columns(
    session: AsyncSession,
    factory: Callable[..., Awaitable[object]],
    field: str,
    value: str,
) -> None:
    await factory(session, **{field: value})

    await assert_rejected(session, lambda: factory(session, **{field: value}), f"_{field}")


async def test_candidate_has_a_single_profile_per_user(session: AsyncSession) -> None:
    candidate = await factories.make_candidate(session)

    await assert_rejected(
        session,
        lambda: factories.make_candidate(session, user_id=candidate.user_id),
        "uq_candidates_user_id",
    )


async def test_one_application_per_candidate_and_offer(session: AsyncSession) -> None:
    application = await factories.make_application(session)

    await assert_rejected(
        session,
        lambda: factories.make_application(
            session,
            candidate_id=application.candidate_id,
            job_offer_id=application.job_offer_id,
        ),
        "uq_applications_candidate_id",
    )


async def test_one_swipe_per_candidate_and_offer(session: AsyncSession) -> None:
    swipe = await factories.make_swipe(session)

    await assert_rejected(
        session,
        lambda: factories.make_swipe(
            session, candidate_id=swipe.candidate_id, job_offer_id=swipe.job_offer_id
        ),
        "uq_swipes_candidate_id",
    )


async def test_one_counter_per_candidate_and_day(session: AsyncSession) -> None:
    counter = await factories.make_swipe_counter(session)

    await assert_rejected(
        session,
        lambda: session.execute(
            insert(SwipeCounter).values(
                candidate_id=counter.candidate_id, swipe_date=counter.swipe_date
            )
        ),
        "pk_swipe_counters",
    )
    await factories.make_swipe_counter(
        session, candidate_id=counter.candidate_id, swipe_date=date(2026, 1, 16)
    )


async def test_one_conversation_per_application(session: AsyncSession) -> None:
    conversation = await factories.make_conversation(session)

    await assert_rejected(
        session,
        lambda: factories.make_conversation(session, application_id=conversation.application_id),
        "uq_conversations_application_id",
    )


async def test_one_language_entry_per_candidate(session: AsyncSession) -> None:
    language = await factories.make_candidate_language(session)

    await assert_rejected(
        session,
        lambda: factories.make_candidate_language(session, candidate_id=language.candidate_id),
        "uq_candidate_languages_candidate_id",
    )


async def test_favorite_is_unique_per_recruiter_candidate_offer(session: AsyncSession) -> None:
    favorite = await factories.make_favorite(session)
    other_offer = await factories.make_job_offer(session)

    await assert_rejected(
        session,
        lambda: factories.make_favorite(
            session,
            recruiter_id=favorite.recruiter_id,
            candidate_id=favorite.candidate_id,
            job_offer_id=favorite.job_offer_id,
        ),
        "uq_favorites_recruiter_id",
    )
    await factories.make_favorite(
        session,
        recruiter_id=favorite.recruiter_id,
        candidate_id=favorite.candidate_id,
        job_offer_id=other_offer.id,
    )


async def test_single_active_subscription_per_holder(session: AsyncSession) -> None:
    subscription = await factories.make_subscription(session)
    company = await factories.make_company(session)
    await factories.make_subscription(session, company_id=company.id)

    await assert_rejected(
        session,
        lambda: factories.make_subscription(session, candidate_id=subscription.candidate_id),
        "uq_subscriptions_active_candidate",
    )
    await assert_rejected(
        session,
        lambda: factories.make_subscription(session, company_id=company.id),
        "uq_subscriptions_active_company",
    )
    await factories.make_subscription(
        session, candidate_id=subscription.candidate_id, status=SubscriptionStatus.EXPIRED
    )


# --- CHECK constraints


@pytest.mark.parametrize(
    ("factory", "overrides", "constraint"),
    [
        (factories.make_user, {"email": "Upper@example.com"}, "email_lowercase"),
        (factories.make_skill, {"name": "Python"}, "name_lowercase"),
        (factories.make_company, {"siret": "12345"}, "siret_digits"),
        (factories.make_company, {"siret": "1234567890123A"}, "siret_digits"),
        (factories.make_candidate, {"about": "x" * 2001}, "about_length"),
        (factories.make_candidate, {"cover_letter": "x" * 5001}, "cover_letter_length"),
        (factories.make_job_offer, {"duration_months": 0}, "duration_positive"),
        (
            factories.make_job_offer,
            {"salary_min": -1, "salary_period": SalaryPeriod.YEAR},
            "salary_min_positive",
        ),
        (
            factories.make_job_offer,
            {"salary_max": -1, "salary_period": SalaryPeriod.YEAR},
            "salary_max_positive",
        ),
        (
            factories.make_job_offer,
            {"salary_min": 20, "salary_max": 10, "salary_period": SalaryPeriod.YEAR},
            "salary_range",
        ),
        (factories.make_job_offer, {"salary_min": 20}, "salary_period_set"),
        (factories.make_application, {"compatibility_score": 101}, "score_range"),
        (factories.make_application, {"compatibility_score": -1}, "score_range"),
        (
            factories.make_application,
            {"matched_skills_count": 7, "required_skills_count": 6},
            "matched_skills_range",
        ),
        (factories.make_application, {"motivation": "x" * 2001}, "motivation_length"),
        (
            factories.make_application,
            {"status": ApplicationStatus.MATCHED},
            "decided_at_set",
        ),
        (factories.make_message, {"body": ""}, "body_length"),
        (factories.make_message, {"body": "x" * 5001}, "body_length"),
        (factories.make_swipe_counter, {"swipe_count": -1}, "count_positive"),
        (
            factories.make_education,
            {"start_date": date(2025, 1, 1), "end_date": date(2024, 1, 1)},
            "end_after_start",
        ),
        (
            factories.make_experience,
            {"start_date": date(2025, 1, 1), "end_date": date(2024, 1, 1)},
            "end_after_start",
        ),
    ],
)
async def test_check_constraints(
    session: AsyncSession,
    factory: Callable[..., Awaitable[object]],
    overrides: dict[str, object],
    constraint: str,
) -> None:
    await assert_rejected(session, lambda: factory(session, **overrides), constraint)


async def test_score_bounds_are_accepted(session: AsyncSession) -> None:
    await factories.make_application(session, compatibility_score=0)
    await factories.make_application(session, compatibility_score=100)


async def test_decided_application_is_accepted(session: AsyncSession) -> None:
    application = await factories.make_application(
        session, status=ApplicationStatus.REJECTED, decided_at=datetime.now(UTC)
    )

    assert application.status is ApplicationStatus.REJECTED


async def test_subscription_needs_exactly_one_holder(session: AsyncSession) -> None:
    candidate = await factories.make_candidate(session)
    company = await factories.make_company(session)

    await assert_rejected(
        session,
        lambda: factories.make_subscription(
            session,
            candidate_id=candidate.id,
            company_id=company.id,
            plan=SubscriptionPlan.CANDIDATE_PREMIUM,
        ),
        "single_holder",
    )
    await assert_rejected(
        session,
        lambda: factories.make_subscription(
            session, candidate_id=None, plan=SubscriptionPlan.COMPANY_PRO_MONTHLY
        ),
        "single_holder",
    )


async def test_subscription_plan_matches_its_holder(session: AsyncSession) -> None:
    candidate = await factories.make_candidate(session)
    company = await factories.make_company(session)

    await assert_rejected(
        session,
        lambda: factories.make_subscription(
            session, candidate_id=candidate.id, plan=SubscriptionPlan.COMPANY_PRO_YEARLY
        ),
        "plan_matches_holder",
    )
    await assert_rejected(
        session,
        lambda: factories.make_subscription(
            session, company_id=company.id, plan=SubscriptionPlan.CANDIDATE_PREMIUM
        ),
        "plan_matches_holder",
    )


# --- GDPR deletion rules


async def _build_marketplace(session: AsyncSession) -> dict[str, object]:
    """A candidate who matched on an offer: every table linked to both sides has a row."""
    company = await factories.make_company(session)
    recruiter = await factories.make_recruiter(session, company_id=company.id)
    offer = await factories.make_job_offer(
        session, company_id=company.id, created_by_recruiter_id=recruiter.id
    )
    candidate = await factories.make_candidate(session)
    skill = await factories.make_skill(session)
    await factories.make_candidate_skill(session, candidate_id=candidate.id, skill_id=skill.id)
    await factories.make_offer_skill(session, job_offer_id=offer.id, skill_id=skill.id)
    await factories.make_education(session, candidate_id=candidate.id)
    await factories.make_experience(session, candidate_id=candidate.id)
    await factories.make_candidate_language(session, candidate_id=candidate.id)
    await factories.make_swipe(session, candidate_id=candidate.id, job_offer_id=offer.id)
    await factories.make_swipe_counter(session, candidate_id=candidate.id)
    await factories.make_subscription(session, candidate_id=candidate.id)
    await factories.make_subscription(session, company_id=company.id)
    application = await factories.make_application(
        session,
        candidate_id=candidate.id,
        job_offer_id=offer.id,
        status=ApplicationStatus.MATCHED,
        decided_by_recruiter_id=recruiter.id,
        decided_at=datetime.now(UTC),
    )
    conversation = await factories.make_conversation(session, application_id=application.id)
    await factories.make_message(
        session, conversation_id=conversation.id, sender_user_id=candidate.user_id
    )
    await factories.make_message(
        session, conversation_id=conversation.id, sender_user_id=recruiter.user_id
    )
    await factories.make_favorite(
        session, recruiter_id=recruiter.id, candidate_id=candidate.id, job_offer_id=offer.id
    )
    return {
        "company": company,
        "recruiter": recruiter,
        "offer": offer,
        "candidate": candidate,
        "application": application,
        "conversation": conversation,
    }


async def test_deleting_a_candidate_account_erases_all_its_data(session: AsyncSession) -> None:
    built = await _build_marketplace(session)
    candidate = built["candidate"]
    offer = built["offer"]

    await session.execute(delete(User).where(User.id == candidate.user_id))

    assert await count_rows(session, Candidate, Candidate.id == candidate.id) == 0
    for model in (
        CandidateSkill,
        Education,
        Experience,
        CandidateLanguage,
        SwipeCounter,
    ):
        assert await count_rows(session, model, model.candidate_id == candidate.id) == 0
    for model in (Swipe, Application, Favorite):
        assert await count_rows(session, model, model.candidate_id == candidate.id) == 0
    assert await count_rows(session, Subscription, Subscription.candidate_id == candidate.id) == 0
    assert await count_rows(session, Conversation) == 0
    assert await count_rows(session, Message) == 0
    assert await count_rows(session, JobOffer, JobOffer.id == offer.id) == 1


async def test_deleting_a_recruiter_keeps_the_company_data(session: AsyncSession) -> None:
    built = await _build_marketplace(session)
    recruiter = built["recruiter"]
    offer = built["offer"]
    application = built["application"]

    await session.execute(delete(User).where(User.id == recruiter.user_id))

    assert await count_rows(session, Recruiter, Recruiter.id == recruiter.id) == 0
    assert await count_rows(session, Favorite, Favorite.recruiter_id == recruiter.id) == 0
    assert (
        await session.scalar(
            select(JobOffer.created_by_recruiter_id).where(JobOffer.id == offer.id)
        )
        is None
    )
    assert (
        await session.scalar(
            select(Application.decided_by_recruiter_id).where(Application.id == application.id)
        )
        is None
    )
    assert await count_rows(session, Conversation) == 1
    assert await count_rows(session, Message) == 2
    assert await count_rows(session, Message, Message.sender_user_id.is_(None)) == 1


async def test_company_with_recruiters_cannot_be_deleted(session: AsyncSession) -> None:
    built = await _build_marketplace(session)
    company = built["company"]

    await assert_rejected(
        session,
        lambda: session.execute(delete(Company).where(Company.id == company.id)),
        "fk_recruiters_company_id_companies",
    )


async def test_deleting_a_company_after_its_recruiters_erases_its_data(
    session: AsyncSession,
) -> None:
    built = await _build_marketplace(session)
    company = built["company"]
    candidate = built["candidate"]
    recruiter = built["recruiter"]

    await session.execute(delete(User).where(User.id == recruiter.user_id))
    await session.execute(delete(Company).where(Company.id == company.id))

    assert await count_rows(session, JobOffer, JobOffer.company_id == company.id) == 0
    assert await count_rows(session, OfferSkill) == 0
    assert await count_rows(session, Swipe) == 0
    assert await count_rows(session, Application) == 0
    assert await count_rows(session, Conversation) == 0
    assert await count_rows(session, Message) == 0
    assert await count_rows(session, Subscription, Subscription.company_id == company.id) == 0
    assert await count_rows(session, Candidate, Candidate.id == candidate.id) == 1


async def test_used_skill_cannot_be_deleted(session: AsyncSession) -> None:
    link = await factories.make_candidate_skill(session)

    await assert_rejected(
        session,
        lambda: session.execute(delete(Skill).where(Skill.id == link.skill_id)),
        "fk_candidate_skills_skill_id_skills",
    )


# --- Seed


async def test_seed_creates_the_expected_volumes(session: AsyncSession) -> None:
    await seed(session)

    assert await count_rows(session, Company) == 2
    assert await count_rows(session, Recruiter) == 3
    assert await count_rows(session, Candidate) == 10
    assert await count_rows(session, JobOffer) == 15
    assert await count_rows(session, Skill) == 12
    assert await count_rows(session, Application) == 30


async def test_seed_only_uses_fictional_emails(session: AsyncSession) -> None:
    await seed(session)

    emails = (await session.scalars(select(User.email))).all()

    assert all(email.endswith("@example.com") for email in emails)


async def test_seed_refuses_a_database_with_users(session: AsyncSession) -> None:
    await factories.make_user(session)

    with pytest.raises(SeedRefusedError):
        await seed(session)

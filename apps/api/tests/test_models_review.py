"""Independent review tests for PR #37 (Issue #22).

Verifies the MCD schema implementation, constraints, cascade deletions,
factories and demo seed according to the acceptance criteria.
"""

from datetime import UTC, datetime

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.applications.models import Application, ApplicationStatus, SwipeDirection
from app.auth.models import User, UserRole
from app.candidates.models import (
    Candidate,
    EducationLevel,
    LanguageLevel,
    Skill,
)
from app.companies.models import Company, Favorite, Recruiter
from app.db.base import Base
from app.messaging.models import Conversation
from app.offers.models import ContractType, JobOffer, OfferStatus, SalaryPeriod
from app.subscriptions.models import (
    SubscriptionPlan,
    SubscriptionStatus,
)
from scripts.seed import SeedRefusedError, seed
from tests.factories import (
    make_application,
    make_candidate,
    make_candidate_language,
    make_candidate_skill,
    make_company,
    make_conversation,
    make_education,
    make_experience,
    make_favorite,
    make_job_offer,
    make_message,
    make_recruiter,
    make_subscription,
    make_swipe,
    make_swipe_counter,
    make_user,
)

pytestmark = pytest.mark.asyncio


# ---------------------------------------------------------------------------
# 1. MCD Schema: Tables and Enums
# ---------------------------------------------------------------------------


async def test_mcd_all_18_tables_registered() -> None:
    expected_tables = {
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
    actual_tables = set(Base.metadata.tables.keys())
    assert expected_tables.issubset(actual_tables), (
        f"Missing tables: {expected_tables - actual_tables}"
    )


async def test_mcd_enums_values() -> None:
    assert {e.value for e in UserRole} == {"candidate", "recruiter"}
    assert {e.value for e in ContractType} == {
        "internship",
        "apprenticeship",
        "fixed_term",
        "permanent",
        "temporary",
        "student_job",
    }
    assert {e.value for e in OfferStatus} == {"active", "filled", "archived"}
    assert {e.value for e in SalaryPeriod} == {"hour", "month", "year"}
    assert {e.value for e in EducationLevel} == {
        "no_degree",
        "bac",
        "bac_2",
        "bac_3",
        "bac_5",
        "bac_8",
    }
    assert {e.value for e in LanguageLevel} == {
        "a1",
        "a2",
        "b1",
        "b2",
        "c1",
        "c2",
        "native",
    }
    assert {e.value for e in SwipeDirection} == {"left", "right"}
    assert {e.value for e in ApplicationStatus} == {"pending", "matched", "rejected"}
    assert {e.value for e in SubscriptionPlan} == {
        "candidate_premium",
        "company_pro_monthly",
        "company_pro_yearly",
    }
    assert {e.value for e in SubscriptionStatus} == {
        "active",
        "past_due",
        "canceled",
        "expired",
    }


# ---------------------------------------------------------------------------
# 2. Constraints and Validations
# ---------------------------------------------------------------------------


async def test_siret_must_be_14_digits(session: AsyncSession) -> None:
    with pytest.raises(IntegrityError):
        await make_company(session, siret="123456789")


async def test_siret_cannot_contain_letters(session: AsyncSession) -> None:
    with pytest.raises(IntegrityError):
        await make_company(session, siret="1234567890123A")


async def test_siret_must_be_unique(session: AsyncSession) -> None:
    company = await make_company(session, siret="11111111111111")
    with pytest.raises(IntegrityError):
        await make_company(session, siret=company.siret)


async def test_application_unique_per_candidate_and_offer(session: AsyncSession) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)

    await make_application(
        session,
        candidate_id=candidate.id,
        job_offer_id=offer.id,
        compatibility_score=75,
    )
    with pytest.raises(IntegrityError):
        await make_application(
            session,
            candidate_id=candidate.id,
            job_offer_id=offer.id,
            compatibility_score=50,
        )


async def test_application_score_must_be_between_0_and_100(session: AsyncSession) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)

    with pytest.raises(IntegrityError):
        await make_application(
            session,
            candidate_id=candidate.id,
            job_offer_id=offer.id,
            compatibility_score=105,
        )


async def test_application_score_cannot_be_negative(session: AsyncSession) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)

    with pytest.raises(IntegrityError):
        await make_application(
            session,
            candidate_id=candidate.id,
            job_offer_id=offer.id,
            compatibility_score=-1,
        )


async def test_application_matched_skills_count_cannot_exceed_required(
    session: AsyncSession,
) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)

    with pytest.raises(IntegrityError):
        await make_application(
            session,
            candidate_id=candidate.id,
            job_offer_id=offer.id,
            matched_skills_count=5,
            required_skills_count=3,
        )


async def test_application_decided_at_required_when_matched(session: AsyncSession) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)

    with pytest.raises(IntegrityError):
        await make_application(
            session,
            candidate_id=candidate.id,
            job_offer_id=offer.id,
            status=ApplicationStatus.MATCHED,
            decided_at=None,
        )


async def test_swipe_unique_per_candidate_and_offer(session: AsyncSession) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)

    await make_swipe(session, candidate_id=candidate.id, job_offer_id=offer.id)
    with pytest.raises(IntegrityError):
        await make_swipe(session, candidate_id=candidate.id, job_offer_id=offer.id)


async def test_favorite_unique_per_recruiter_candidate_and_offer(
    session: AsyncSession,
) -> None:
    candidate = await make_candidate(session)
    offer = await make_job_offer(session)
    recruiter = await make_recruiter(session)

    await make_favorite(
        session,
        recruiter_id=recruiter.id,
        candidate_id=candidate.id,
        job_offer_id=offer.id,
    )
    with pytest.raises(IntegrityError):
        await make_favorite(
            session,
            recruiter_id=recruiter.id,
            candidate_id=candidate.id,
            job_offer_id=offer.id,
        )


async def test_candidate_language_unique_per_candidate_and_language_code(
    session: AsyncSession,
) -> None:
    candidate = await make_candidate(session)
    await make_candidate_language(session, candidate_id=candidate.id, language_code="en")
    with pytest.raises(IntegrityError):
        await make_candidate_language(session, candidate_id=candidate.id, language_code="en")


async def test_subscription_cannot_have_both_holders(session: AsyncSession) -> None:
    candidate = await make_candidate(session)
    company = await make_company(session)

    with pytest.raises(IntegrityError):
        await make_subscription(session, candidate_id=candidate.id, company_id=company.id)


async def test_subscription_must_have_at_least_one_holder(session: AsyncSession) -> None:
    with pytest.raises(IntegrityError):
        await make_subscription(session, candidate_id=None, company_id=None)


async def test_subscription_candidate_plan_must_target_candidate(
    session: AsyncSession,
) -> None:
    company = await make_company(session)

    with pytest.raises(IntegrityError):
        await make_subscription(
            session,
            company_id=company.id,
            candidate_id=None,
            plan=SubscriptionPlan.CANDIDATE_PREMIUM,
        )


async def test_subscription_only_one_active_per_candidate(session: AsyncSession) -> None:
    candidate = await make_candidate(session)

    await make_subscription(
        session,
        candidate_id=candidate.id,
        status=SubscriptionStatus.ACTIVE,
    )
    with pytest.raises(IntegrityError):
        await make_subscription(
            session,
            candidate_id=candidate.id,
            status=SubscriptionStatus.ACTIVE,
        )


async def test_subscription_only_one_active_per_company(session: AsyncSession) -> None:
    company = await make_company(session)

    await make_subscription(
        session,
        company_id=company.id,
        candidate_id=None,
        plan=SubscriptionPlan.COMPANY_PRO_MONTHLY,
        status=SubscriptionStatus.ACTIVE,
    )
    with pytest.raises(IntegrityError):
        await make_subscription(
            session,
            company_id=company.id,
            candidate_id=None,
            plan=SubscriptionPlan.COMPANY_PRO_MONTHLY,
            status=SubscriptionStatus.ACTIVE,
        )


async def test_subscription_canceled_and_active_can_coexist(
    session: AsyncSession,
) -> None:
    candidate = await make_candidate(session)

    await make_subscription(
        session,
        candidate_id=candidate.id,
        status=SubscriptionStatus.ACTIVE,
    )
    # Different status is allowed thanks to partial index
    await make_subscription(
        session,
        candidate_id=candidate.id,
        status=SubscriptionStatus.CANCELED,
    )


async def test_job_offer_duration_must_be_positive(session: AsyncSession) -> None:
    company = await make_company(session)
    with pytest.raises(IntegrityError):
        await make_job_offer(session, company_id=company.id, duration_months=0)


async def test_job_offer_salary_min_cannot_be_negative(session: AsyncSession) -> None:
    company = await make_company(session)
    with pytest.raises(IntegrityError):
        await make_job_offer(session, company_id=company.id, salary_min=-1)


async def test_job_offer_salary_max_must_be_greater_than_min(session: AsyncSession) -> None:
    company = await make_company(session)
    with pytest.raises(IntegrityError):
        await make_job_offer(
            session,
            company_id=company.id,
            salary_min=50000,
            salary_max=40000,
            salary_period=SalaryPeriod.YEAR,
        )


async def test_message_body_cannot_be_empty(session: AsyncSession) -> None:
    with pytest.raises(IntegrityError):
        await make_message(session, body="")


async def test_message_body_cannot_exceed_5000_chars(session: AsyncSession) -> None:
    with pytest.raises(IntegrityError):
        await make_message(session, body="x" * 5001)


# ---------------------------------------------------------------------------
# 3. RGPD Cascade Deletes
# ---------------------------------------------------------------------------


async def test_candidate_deletion_cascades_completely(session: AsyncSession) -> None:
    user = await make_user(session, role=UserRole.CANDIDATE)
    candidate = await make_candidate(session, user_id=user.id)
    recruiter = await make_recruiter(session)
    offer = await make_job_offer(session)

    await make_education(session, candidate_id=candidate.id)
    await make_experience(session, candidate_id=candidate.id)
    await make_candidate_language(session, candidate_id=candidate.id, language_code="fr")
    await make_candidate_skill(session, candidate_id=candidate.id)
    await make_swipe(session, candidate_id=candidate.id, job_offer_id=offer.id)
    await make_swipe_counter(session, candidate_id=candidate.id)
    app = await make_application(session, candidate_id=candidate.id, job_offer_id=offer.id)
    conv = await make_conversation(session, application_id=app.id)
    await make_message(session, conversation_id=conv.id, sender_user_id=user.id)
    await make_favorite(
        session,
        recruiter_id=recruiter.id,
        candidate_id=candidate.id,
        job_offer_id=offer.id,
    )
    await make_subscription(session, candidate_id=candidate.id)

    # Delete candidate user
    await session.delete(user)
    await session.flush()

    # Candidate and related rows must be deleted
    assert (await session.scalar(select(Candidate).where(Candidate.id == candidate.id))) is None
    assert (
        await session.scalar(select(Application).where(Application.candidate_id == candidate.id))
    ) is None
    assert (await session.scalar(select(Conversation).where(Conversation.id == conv.id))) is None
    assert (
        await session.scalar(select(Favorite).where(Favorite.candidate_id == candidate.id))
    ) is None


async def test_recruiter_deletion_cleans_recruiter_and_sets_null_references(
    session: AsyncSession,
) -> None:
    user = await make_user(session, role=UserRole.RECRUITER)
    recruiter = await make_recruiter(session, user_id=user.id)
    candidate = await make_candidate(session)
    offer = await make_job_offer(
        session,
        company_id=recruiter.company_id,
        created_by_recruiter_id=recruiter.id,
    )
    now = datetime.now(UTC)
    app = await make_application(
        session,
        candidate_id=candidate.id,
        job_offer_id=offer.id,
        status=ApplicationStatus.MATCHED,
        decided_by_recruiter_id=recruiter.id,
        decided_at=now,
    )
    conv = await make_conversation(session, application_id=app.id)
    msg = await make_message(session, conversation_id=conv.id, sender_user_id=user.id)
    fav = await make_favorite(
        session,
        recruiter_id=recruiter.id,
        candidate_id=candidate.id,
        job_offer_id=offer.id,
    )

    # Delete recruiter user
    await session.delete(user)
    await session.flush()
    await session.refresh(offer)
    await session.refresh(app)
    await session.refresh(msg)

    # Recruiter and favorite are gone
    assert (await session.scalar(select(Recruiter).where(Recruiter.id == recruiter.id))) is None
    assert await session.scalar(select(Favorite).where(Favorite.id == fav.id)) is None

    # Job offer, application and conversation remain, with recruiter FK set to NULL
    assert offer.created_by_recruiter_id is None
    assert app.decided_by_recruiter_id is None
    assert msg.sender_user_id is None


async def test_company_deletion_restricted_with_recruiters(session: AsyncSession) -> None:
    recruiter = await make_recruiter(session)
    company = await session.get(Company, recruiter.company_id)
    assert company is not None

    # Deleting company while recruiters exist raises IntegrityError (RESTRICT)
    await session.delete(company)
    with pytest.raises(IntegrityError):
        await session.flush()


# ---------------------------------------------------------------------------
# 4. Demo Seed
# ---------------------------------------------------------------------------


async def test_seed_creates_expected_entities_and_fictional_data(
    session: AsyncSession,
) -> None:
    await seed(session)

    # 2 companies, 3 recruiters, 10 candidates, 15 offers
    assert await session.scalar(select(func.count(Company.id))) == 2
    assert await session.scalar(select(func.count(Recruiter.id))) == 3
    assert await session.scalar(select(func.count(Candidate.id))) == 10
    assert await session.scalar(select(func.count(JobOffer.id))) == 15

    # Skills and applications created
    skill_count = await session.scalar(select(func.count(Skill.id)))
    app_count = await session.scalar(select(func.count(Application.id)))
    assert skill_count is not None and skill_count > 0
    assert app_count is not None and app_count > 0

    # Only fictional emails
    emails = (await session.scalars(select(User.email))).all()
    assert all(email.endswith("@example.com") for email in emails)

    # Re-running seed must be refused
    with pytest.raises(SeedRefusedError):
        await seed(session)

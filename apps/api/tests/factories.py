"""One `make_<entity>(session, **overrides)` per model, with entirely fictional data.

Each factory flushes, so the returned object has its id and server defaults. Missing parents
are created on the fly.
"""

from datetime import UTC, date, datetime, timedelta
from itertools import count

from sqlalchemy.ext.asyncio import AsyncSession

from app.applications.models import Application, Swipe, SwipeDirection
from app.auth.models import User, UserRole
from app.candidates.models import (
    Candidate,
    CandidateLanguage,
    CandidateSkill,
    Education,
    Experience,
    LanguageLevel,
    Skill,
)
from app.companies.models import Company, Favorite, Recruiter
from app.messaging.models import Conversation, Message
from app.offers.models import ContractType, JobOffer, OfferSkill
from app.subscriptions.models import Subscription, SubscriptionPlan, SwipeCounter

_sequence = count(1)


async def _save[T](session: AsyncSession, instance: T) -> T:
    session.add(instance)
    await session.flush()
    return instance


async def _ensure_candidate(session: AsyncSession, overrides: dict[str, object]) -> None:
    if "candidate_id" not in overrides:
        overrides["candidate_id"] = (await make_candidate(session)).id


async def _ensure_offer(session: AsyncSession, overrides: dict[str, object]) -> None:
    if "job_offer_id" not in overrides:
        overrides["job_offer_id"] = (await make_job_offer(session)).id


async def _ensure_skill(session: AsyncSession, overrides: dict[str, object]) -> None:
    if "skill_id" not in overrides:
        overrides["skill_id"] = (await make_skill(session)).id


async def make_user(session: AsyncSession, **overrides: object) -> User:
    values: dict[str, object] = {
        "email": f"user{next(_sequence)}@example.com",
        "password_hash": "not-a-real-hash",
        "role": UserRole.CANDIDATE,
    }
    return await _save(session, User(**(values | overrides)))


async def make_candidate(session: AsyncSession, **overrides: object) -> Candidate:
    if "user_id" not in overrides:
        overrides["user_id"] = (await make_user(session, role=UserRole.CANDIDATE)).id
    values: dict[str, object] = {"first_name": "Camille", "last_name": "Exemple"}
    return await _save(session, Candidate(**(values | overrides)))


async def make_company(session: AsyncSession, **overrides: object) -> Company:
    values: dict[str, object] = {
        "name": "Entreprise Fictive",
        "siret": f"{next(_sequence):014d}",
    }
    return await _save(session, Company(**(values | overrides)))


async def make_recruiter(session: AsyncSession, **overrides: object) -> Recruiter:
    if "user_id" not in overrides:
        overrides["user_id"] = (await make_user(session, role=UserRole.RECRUITER)).id
    if "company_id" not in overrides:
        overrides["company_id"] = (await make_company(session)).id
    values: dict[str, object] = {"first_name": "Dominique", "last_name": "Exemple"}
    return await _save(session, Recruiter(**(values | overrides)))


async def make_job_offer(session: AsyncSession, **overrides: object) -> JobOffer:
    if "company_id" not in overrides:
        overrides["company_id"] = (await make_company(session)).id
    values: dict[str, object] = {
        "title": "Poste fictif",
        "description": "Description fictive.",
        "contract_type": ContractType.INTERNSHIP,
        "city": "Lyon",
    }
    return await _save(session, JobOffer(**(values | overrides)))


async def make_skill(session: AsyncSession, **overrides: object) -> Skill:
    values: dict[str, object] = {"name": f"skill-{next(_sequence)}"}
    return await _save(session, Skill(**(values | overrides)))


async def make_candidate_skill(session: AsyncSession, **overrides: object) -> CandidateSkill:
    await _ensure_candidate(session, overrides)
    await _ensure_skill(session, overrides)
    return await _save(session, CandidateSkill(**overrides))


async def make_offer_skill(session: AsyncSession, **overrides: object) -> OfferSkill:
    await _ensure_offer(session, overrides)
    await _ensure_skill(session, overrides)
    return await _save(session, OfferSkill(**overrides))


async def make_education(session: AsyncSession, **overrides: object) -> Education:
    await _ensure_candidate(session, overrides)
    values: dict[str, object] = {
        "school": "École Fictive",
        "degree": "Licence",
        "start_date": date(2023, 9, 1),
    }
    return await _save(session, Education(**(values | overrides)))


async def make_experience(session: AsyncSession, **overrides: object) -> Experience:
    await _ensure_candidate(session, overrides)
    values: dict[str, object] = {
        "company_name": "Société Fictive",
        "job_title": "Assistant",
        "start_date": date(2024, 6, 1),
    }
    return await _save(session, Experience(**(values | overrides)))


async def make_candidate_language(session: AsyncSession, **overrides: object) -> CandidateLanguage:
    await _ensure_candidate(session, overrides)
    values: dict[str, object] = {"language_code": "fr", "level": LanguageLevel.NATIVE}
    return await _save(session, CandidateLanguage(**(values | overrides)))


async def make_swipe(session: AsyncSession, **overrides: object) -> Swipe:
    await _ensure_candidate(session, overrides)
    await _ensure_offer(session, overrides)
    values: dict[str, object] = {"direction": SwipeDirection.RIGHT}
    return await _save(session, Swipe(**(values | overrides)))


async def make_swipe_counter(session: AsyncSession, **overrides: object) -> SwipeCounter:
    await _ensure_candidate(session, overrides)
    values: dict[str, object] = {"swipe_date": date(2026, 1, 15), "swipe_count": 1}
    return await _save(session, SwipeCounter(**(values | overrides)))


async def make_application(session: AsyncSession, **overrides: object) -> Application:
    await _ensure_candidate(session, overrides)
    await _ensure_offer(session, overrides)
    values: dict[str, object] = {
        "compatibility_score": 67,
        "matched_skills_count": 4,
        "required_skills_count": 6,
    }
    return await _save(session, Application(**(values | overrides)))


async def make_conversation(session: AsyncSession, **overrides: object) -> Conversation:
    if "application_id" not in overrides:
        overrides["application_id"] = (await make_application(session)).id
    return await _save(session, Conversation(**overrides))


async def make_message(session: AsyncSession, **overrides: object) -> Message:
    if "conversation_id" not in overrides:
        overrides["conversation_id"] = (await make_conversation(session)).id
    values: dict[str, object] = {"body": "Bonjour !"}
    return await _save(session, Message(**(values | overrides)))


async def make_subscription(session: AsyncSession, **overrides: object) -> Subscription:
    if "company_id" in overrides:
        plan = SubscriptionPlan.COMPANY_PRO_MONTHLY
    else:
        plan = SubscriptionPlan.CANDIDATE_PREMIUM
        await _ensure_candidate(session, overrides)
    now = datetime.now(UTC)
    values: dict[str, object] = {
        "plan": plan,
        "started_at": now,
        "current_period_end": now + timedelta(days=30),
    }
    return await _save(session, Subscription(**(values | overrides)))


async def make_favorite(session: AsyncSession, **overrides: object) -> Favorite:
    if "recruiter_id" not in overrides:
        overrides["recruiter_id"] = (await make_recruiter(session)).id
    await _ensure_candidate(session, overrides)
    await _ensure_offer(session, overrides)
    return await _save(session, Favorite(**overrides))

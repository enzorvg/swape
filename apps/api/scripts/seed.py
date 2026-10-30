"""Fill the dev database with entirely fictional demo data: `make db-seed`.

Refuses to run in production or on a database that already has users.
"""

import asyncio
import logging
from collections.abc import Sequence
from datetime import UTC, date, datetime, timedelta

from argon2 import PasswordHasher
from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.applications.models import Application, ApplicationStatus, Swipe, SwipeDirection
from app.auth.models import User, UserRole
from app.candidates.models import (
    Candidate,
    CandidateLanguage,
    CandidateSkill,
    Education,
    EducationLevel,
    Experience,
    LanguageLevel,
    Skill,
)
from app.companies.models import Company, Favorite, Recruiter
from app.core.config import get_settings
from app.db.session import SessionFactory
from app.messaging.models import Conversation, Message
from app.offers.models import ContractType, JobOffer, OfferSkill, SalaryPeriod
from app.subscriptions.models import Subscription, SubscriptionPlan, SwipeCounter

logger = logging.getLogger(__name__)

# Shared by every demo account. Public on purpose: it only opens fictional local data.
DEMO_LOGIN_PHRASE = "swape-demo"

SKILL_NAMES = (
    "python",
    "sql",
    "react",
    "typescript",
    "figma",
    "communication",
    "excel",
    "gestion de projet",
    "anglais",
    "marketing digital",
    "vente",
    "support client",
)
FIRST_NAMES = (
    "Alix",
    "Camille",
    "Charlie",
    "Dominique",
    "Eden",
    "Lou",
    "Maxime",
    "Noa",
    "Sacha",
    "Yael",
)
CITIES = ("Lyon", "Nantes", "Lille", "Bordeaux", "Toulouse")
OFFER_TITLES = (
    "Développeur web",
    "UX Designer",
    "Chargé de marketing",
    "Assistant commercial",
    "Analyste de données",
)
CONTRACTS = (
    (ContractType.INTERNSHIP, 6, SalaryPeriod.MONTH, 700, 900),
    (ContractType.APPRENTICESHIP, 24, SalaryPeriod.MONTH, 900, 1400),
    (ContractType.FIXED_TERM, 12, SalaryPeriod.YEAR, 28000, 34000),
    (ContractType.PERMANENT, None, SalaryPeriod.YEAR, 35000, 45000),
    (ContractType.TEMPORARY, 3, SalaryPeriod.HOUR, 13, 15),
    (ContractType.STUDENT_JOB, None, SalaryPeriod.HOUR, 12, 13),
)
EDUCATION_LEVELS = tuple(EducationLevel)
OFFER_SKILL_COUNT = 3
CANDIDATE_SKILL_COUNT = 5
APPLICATIONS_PER_CANDIDATE = 3


class SeedRefusedError(Exception):
    """The target database must not receive demo data."""


async def _insert[T](session: AsyncSession, instances: Sequence[T]) -> Sequence[T]:
    # Models have no relationship(): flushing group by group keeps foreign keys ordered.
    session.add_all(instances)
    await session.flush()
    return instances


def _rotated_slice[T](items: Sequence[T], start: int, length: int) -> list[T]:
    return [items[(start + offset) % len(items)] for offset in range(length)]


async def _seed_companies(
    session: AsyncSession, password_hash: str
) -> tuple[Sequence[Company], Sequence[Recruiter]]:
    companies = await _insert(
        session,
        [
            Company(name="Atelier Fictif", siret="00000000000001", city="Lyon"),
            Company(name="Studio Exemple", siret="00000000000002", city="Nantes"),
        ],
    )
    users = await _insert(
        session,
        [
            User(
                email=f"recruteur{number}@example.com",
                password_hash=password_hash,
                role=UserRole.RECRUITER,
            )
            for number in range(1, 4)
        ],
    )
    recruiters = await _insert(
        session,
        [
            Recruiter(
                user_id=user.id,
                company_id=companies[min(index, 1)].id,
                first_name="Recruteur",
                last_name=f"Démo {index + 1}",
                job_title="Chargé de recrutement",
            )
            for index, user in enumerate(users)
        ],
    )
    now = datetime.now(UTC)
    await _insert(
        session,
        [
            Subscription(
                company_id=companies[0].id,
                plan=SubscriptionPlan.COMPANY_PRO_MONTHLY,
                started_at=now,
                current_period_end=now + timedelta(days=30),
            )
        ],
    )
    return companies, recruiters


async def _seed_candidates(
    session: AsyncSession, password_hash: str, skills: Sequence[Skill]
) -> Sequence[Candidate]:
    users = await _insert(
        session,
        [
            User(
                email=f"candidat{number}@example.com",
                password_hash=password_hash,
                role=UserRole.CANDIDATE,
            )
            for number in range(1, len(FIRST_NAMES) + 1)
        ],
    )
    candidates = await _insert(
        session,
        [
            Candidate(
                user_id=user.id,
                first_name=FIRST_NAMES[index],
                last_name="Démo",
                about="Profil de démonstration, entièrement fictif.",
                city=CITIES[index % len(CITIES)],
                education_level=EDUCATION_LEVELS[index % len(EDUCATION_LEVELS)],
                available_from=date(2027, 1, 1),
                is_verified=index % 2 == 0,
            )
            for index, user in enumerate(users)
        ],
    )
    await _insert(
        session,
        [
            CandidateSkill(candidate_id=candidate.id, skill_id=skill.id)
            for index, candidate in enumerate(candidates)
            for skill in _rotated_slice(skills, index, CANDIDATE_SKILL_COUNT)
        ],
    )
    await _insert(
        session,
        [
            Education(
                candidate_id=candidate.id,
                school="École Fictive",
                degree="Licence",
                start_date=date(2022, 9, 1),
                end_date=date(2025, 6, 30),
            )
            for candidate in candidates
        ],
    )
    await _insert(
        session,
        [
            Experience(
                candidate_id=candidate.id,
                company_name="Société Fictive",
                job_title="Stagiaire",
                start_date=date(2025, 1, 6),
                end_date=date(2025, 6, 27),
            )
            for candidate in candidates
        ],
    )
    await _insert(
        session,
        [
            CandidateLanguage(
                candidate_id=candidate.id, language_code="fr", level=LanguageLevel.NATIVE
            )
            for candidate in candidates
        ],
    )
    now = datetime.now(UTC)
    await _insert(
        session,
        [
            Subscription(
                candidate_id=candidates[0].id,
                plan=SubscriptionPlan.CANDIDATE_PREMIUM,
                started_at=now,
                current_period_end=now + timedelta(days=30),
            )
        ],
    )
    return candidates


async def _seed_offers(
    session: AsyncSession,
    companies: Sequence[Company],
    recruiters: Sequence[Recruiter],
    skills: Sequence[Skill],
) -> Sequence[JobOffer]:
    offers: list[JobOffer] = []
    for index in range(15):
        contract, months, period, salary_min, salary_max = CONTRACTS[index % len(CONTRACTS)]
        company_index = index % len(companies)
        offers.append(
            JobOffer(
                company_id=companies[company_index].id,
                created_by_recruiter_id=recruiters[company_index].id,
                title=OFFER_TITLES[index % len(OFFER_TITLES)],
                description="Offre de démonstration, entièrement fictive.",
                contract_type=contract,
                city=CITIES[index % len(CITIES)],
                duration_months=months,
                salary_min=salary_min,
                salary_max=salary_max,
                salary_period=period,
            )
        )
    await _insert(session, offers)
    await _insert(
        session,
        [
            OfferSkill(job_offer_id=offer.id, skill_id=skill.id)
            for index, offer in enumerate(offers)
            for skill in _rotated_slice(skills, index, OFFER_SKILL_COUNT)
        ],
    )
    return offers


async def _seed_applications(
    session: AsyncSession,
    candidates: Sequence[Candidate],
    offers: Sequence[JobOffer],
    recruiters: Sequence[Recruiter],
) -> None:
    now = datetime.now(UTC)
    applications: list[Application] = []
    swipes: list[Swipe] = []
    for index, candidate in enumerate(candidates):
        for rank, offer in enumerate(_rotated_slice(offers, index, APPLICATIONS_PER_CANDIDATE + 1)):
            if rank == APPLICATIONS_PER_CANDIDATE:
                swipes.append(
                    Swipe(
                        candidate_id=candidate.id,
                        job_offer_id=offer.id,
                        direction=SwipeDirection.LEFT,
                    )
                )
                continue
            swipes.append(
                Swipe(
                    candidate_id=candidate.id,
                    job_offer_id=offer.id,
                    direction=SwipeDirection.RIGHT,
                )
            )
            status = tuple(ApplicationStatus)[rank]
            decided = status is not ApplicationStatus.PENDING
            matched = _demo_matched_skills(index, offers.index(offer))
            applications.append(
                Application(
                    candidate_id=candidate.id,
                    job_offer_id=offer.id,
                    status=status,
                    motivation="Motivation de démonstration.",
                    compatibility_score=round(100 * matched / OFFER_SKILL_COUNT),
                    matched_skills_count=matched,
                    required_skills_count=OFFER_SKILL_COUNT,
                    decided_by_recruiter_id=recruiters[0].id if decided else None,
                    decided_at=now if decided else None,
                )
            )
    await _insert(session, swipes)
    await _insert(session, applications)
    await _insert(
        session,
        [
            SwipeCounter(
                candidate_id=candidate.id,
                swipe_date=now.date(),
                swipe_count=APPLICATIONS_PER_CANDIDATE + 1,
            )
            for candidate in candidates
        ],
    )
    matches = [app for app in applications if app.status is ApplicationStatus.MATCHED]
    conversations = await _insert(session, [Conversation(application_id=app.id) for app in matches])
    await _insert(
        session,
        [
            Message(
                conversation_id=conversation.id,
                sender_user_id=recruiters[0].user_id,
                body="Bonjour, votre profil nous intéresse.",
            )
            for conversation in conversations
        ],
    )
    await _insert(
        session,
        [
            Favorite(
                recruiter_id=recruiters[0].id,
                candidate_id=candidates[0].id,
                job_offer_id=offers[0].id,
            )
        ],
    )


def _demo_matched_skills(candidate_index: int, offer_index: int) -> int:
    candidate_skills = set(
        _rotated_slice(range(len(SKILL_NAMES)), candidate_index, CANDIDATE_SKILL_COUNT)
    )
    offer_skills = set(_rotated_slice(range(len(SKILL_NAMES)), offer_index, OFFER_SKILL_COUNT))
    return len(candidate_skills & offer_skills)


async def seed(session: AsyncSession) -> None:
    """Insert the demo data without committing: the caller decides."""
    if await session.scalar(select(exists().where(User.id.is_not(None)))):
        raise SeedRefusedError("La base contient déjà des utilisateurs.")

    password_hash = PasswordHasher().hash(DEMO_LOGIN_PHRASE)
    skills = await _insert(session, [Skill(name=name) for name in SKILL_NAMES])
    companies, recruiters = await _seed_companies(session, password_hash)
    candidates = await _seed_candidates(session, password_hash, skills)
    offers = await _seed_offers(session, companies, recruiters, skills)
    await _seed_applications(session, candidates, offers, recruiters)


async def main() -> None:
    if get_settings().environment == "prod":
        raise SeedRefusedError("Le seed est interdit en production.")
    async with SessionFactory() as session:
        await seed(session)
        await session.commit()
    logger.info("Demo data inserted")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())

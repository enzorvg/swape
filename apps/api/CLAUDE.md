# apps/api — backend FastAPI

Lancer depuis la racine : `make dev-api`, `make test-api`, `make lint-api`. Dans ce dossier : `uv run pytest`, `uv run mypy`.

## Structure

```
app/
  main.py            # create_app() — ne pas y ajouter de routes (fichier chaud)
  discovery.py       # monte app/<domaine>/router.py et importe app/<domaine>/models.py automatiquement
  core/              # config (Settings), logging, errors (DomainError)
  db/                # base.py (Base + naming convention), session.py (get_session)
  llm/provider.py    # LLMProvider + FakeLLMProvider : seul point d'accès à un LLM
  <domaine>/         # auth, candidates, companies, offers, applications, messaging, subscriptions, simulation, llm, health
    router.py        # routes HTTP : validation, auth, appel du service. Pas de SQL ni de logique métier.
    service.py       # logique métier + autorisations. Lève des DomainError. Décide du commit.
    repository.py    # accès base (SQLAlchemy 2 async, select()). Aucune logique métier.
    models.py        # modèles SQLAlchemy (Mapped[...], mapped_column)
    schemas.py       # schémas Pydantic v2 : <Entity>Create, <Entity>Update, <Entity>Read
alembic/versions/    # une migration par ticket
tests/<domaine>/     # tests du domaine ; conftest.py fournit session, client
```

Flux imposé : `router → service → repository → models`. Un router n'importe jamais un repository.

## Ajouter un endpoint (pattern de référence)

```python
# app/offers/router.py
router = APIRouter(prefix="/offers", tags=["offers"])


@router.get("/{offer_id}", operation_id="getOffer")
async def get_offer(
    offer_id: UUID,
    session: Annotated[AsyncSession, Depends(get_session)],
    user: Annotated[CurrentUser, Depends(get_current_user)],
) -> OfferRead:
    return await offers_service.get_offer(session, user, offer_id)


# app/offers/service.py
async def get_offer(session: AsyncSession, user: CurrentUser, offer_id: UUID) -> OfferRead:
    offer = await offers_repository.get(session, offer_id)
    if offer is None:
        raise NotFoundError("Offre introuvable", code="offer_not_found")
    if user.is_recruiter and offer.company_id != user.company_id:
        raise PermissionDeniedError("Accès refusé")
    return OfferRead.model_validate(offer)
```

- Toujours un `operation_id` en camelCase : c'est le nom utilisé par le client TS généré.
- Toujours un type de retour (schéma Pydantic) : il définit l'OpenAPI. Jamais de modèle SQLAlchemy renvoyé.
- Ensuite : `make api-types` et commit de `packages/api-client` dans la même PR.

## Modèles et migrations

- Nouveau modèle dans `app/<domaine>/models.py`, hérite de `app.db.base.Base`. Rien à ajouter dans `base.py`.
- Clés primaires UUID, `created_at` / `updated_at` timezone-aware, noms de tables anglais pluriels (`job_offers`).
- Migration : **après** rebase sur `main`, juste avant `/ship` : `make db-revision m="add job_offers table"`, relire le fichier
  généré (autogenerate rate les enums, renommages, contraintes CHECK), puis `make db-migrate`.
- Si `main` a reçu une migration entre-temps : supprimer la tienne, rebase, la recréer. Jamais deux têtes.

## Tests

- `pytest` + `pytest-asyncio` (mode auto) + `httpx.AsyncClient`. Base PostgreSQL de test réelle (`make db-up`), rollback par test.
- Fixtures : `session` (AsyncSession dans une transaction annulée), `client` (AsyncClient branché sur cette session).
- Données : factories dans `tests/factories.py` (créé par le ticket des modèles ; une fonction `make_<entity>(session, **overrides)` par modèle), données fictives.
- Pour chaque endpoint : cas nominal, 404/409/422, **401 sans token, 403 pour un autre utilisateur / une autre entreprise**.
- LLM : injecter `FakeLLMProvider`. Aucun appel réseau dans les tests.
- Couverture minimale 70 % (`make test-api` échoue en dessous).

## Pièges connus

- Async partout : jamais d'appel bloquant (requests, time.sleep) dans une route ; pas de lazy-loading implicite
  (`selectinload` / `joinedload` explicites, sinon `MissingGreenlet`). Attention aux N+1.
- `expire_on_commit=False` : recharger explicitement un objet si un trigger le modifie.
- Le service commit (`await session.commit()`), pas le repository ni le router.
- Ne jamais logger un objet utilisateur complet (RGPD) : logger son id.

# ADR 0001 — Stack technique et organisation du monorepo

- Statut : accepté
- Date : 2026-10-29
- Décideurs : Enzo Ravignon (lead), équipe Swape

## Contexte

Trois développeurs full-stack, chacun assisté de Claude Code, travaillent en parallèle sur une app mobile candidat,
un SaaS web recruteur et une API commune (cahier des charges : React Native ou Flutter, React, PostgreSQL, WebSockets, RGPD).
Il faut un contrat front ↔ back vérifiable et un découpage qui limite les conflits.

## Décision

| Sujet | Choix | Raison |
|---|---|---|
| Monorepo | uv (Python) + pnpm workspaces (JS), `Makefile` racine | une seule commande par action, lockfiles commités |
| API | FastAPI, Pydantic v2, SQLAlchemy 2 async + asyncpg, Alembic | typage de bout en bout, OpenAPI natif, WebSockets |
| Auth | JWT access + refresh, Argon2 | standard, sans état |
| Tests API | pytest + PostgreSQL de test réelle, rollback par test | pas de divergence SQLite / PostgreSQL |
| Web | React 19 + Vite, React Router, TanStack Query, Tailwind v4 | demandé par le cahier des charges, tokens de charte en CSS |
| Mobile | Expo SDK 58 + Expo Router | React Native multiplateforme, DX |
| Contrat | `openapi-typescript` + `openapi-fetch` → `packages/api-client` | types générés, CI vérifie qu'ils sont à jour |
| Charte | `packages/design-tokens` (TS pour mobile, CSS `@theme` pour web) | une seule source, testée |
| Base | PostgreSQL 18 (docker compose : dev :5434, test :5435 en RAM) | exigence du cahier des charges |
| Organisation API | un dossier par domaine, routers et modèles découverts automatiquement | deux tickets ne modifient pas `main.py` / `base.py` |
| Job Simulation | runtime joué sur une route **web** candidat (`apps/web`, `/simulation/*`), ouverte depuis le mobile | une interface multi-fenêtres ne se joue pas sur téléphone |
| LLM | interface `LLMProvider` côté API uniquement, `FakeLLMProvider` en test | changement de fournisseur, tests déterministes, AI Act |

## Écarts assumés par rapport aux « dernières versions »

- **TypeScript 6.0.3** et non 7.0 : `typescript-eslint` n'accepte que TS < 6.1, et Expo SDK 58 cible 6.0. À revoir quand
  typescript-eslint supportera TS 7.
- **ESLint 9 dans `apps/mobile`** (10 ailleurs) : `eslint-config-expo` embarque `eslint-plugin-react`, incompatible avec ESLint 10.
- **pnpm 12 `allowBuilds`** : scripts d'installation refusés par défaut ; `@parcel/watcher` et `unrs-resolver` explicitement refusés
  (binaires précompilés). Toute autorisation future passe en revue de PR.
- **Ports 5434 / 5435** au lieu de 5432 : évite le conflit avec un PostgreSQL local.
- **Gliker** (police sous licence) non embarquée : fallback Poppins tant que les fichiers ne sont pas fournis.

## Conséquences

- `make api-types` doit accompagner tout changement d'API (règle d'or + check CI).
- Une migration Alembic par ticket ; la CI refuse plusieurs têtes.
- Redis n'est pas encore utilisé : il le sera pour le pub/sub WebSocket quand l'API aura plusieurs workers.

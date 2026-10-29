# Swape — règles pour Claude Code

## 1. Le projet

Swape est le « Tinder du recrutement » (stages, alternances, CDD, CDI, intérim, jobs étudiants).
Candidat : app **mobile** (`apps/mobile`, Expo). Recruteur : SaaS **web desktop** + landing (`apps/web`).
API unique FastAPI + PostgreSQL (`apps/api`). Feature différenciante : la **Job Simulation**
(journée de travail simulée avec des collègues virtuels pilotés par LLM), jouée sur une route **web** candidat.
Source de vérité fonctionnelle : `docs/specs/cahier-des-charges.pdf`. Voir `docs/architecture.md` et `docs/glossaire.md`.
Code, noms, commits en **anglais** ; doc, issues, PR et commentaires de review en **français**.

## 2. Commandes

| Commande | Effet |
|---|---|
| `make setup` | installe tout (uv, pnpm, pre-commit, `.env`, bases) |
| `make dev` | API :8000 + web :5173 (`make dev-mobile` pour Expo) |
| `make test` | tous les tests (API sur vraie base PostgreSQL de test) |
| `make lint` | ruff, mypy strict, ESLint, tsc, prettier (sans modifier) |
| `make fmt` | formate et corrige automatiquement |
| `make db-up` / `make db-migrate` | démarre PostgreSQL (dev :5434, test :5435) / applique les migrations |
| `make db-revision m="..."` | crée une migration Alembic (autogenerate) |
| `make api-types` | régénère `packages/api-client` depuis l'OpenAPI |
| `scripts/board.sh` | déplace / liste les tickets du board (`move`, `set`, `list`) |

## 3. Règles d'or (non négociables)

1. Ne jamais commit ni push sur `main`. Toujours une branche liée à une issue : `<type>/<n>-<slug>`.
2. Ne jamais travailler sur une issue qui n'est pas assignée à ton humain (`gh api user --jq .login`).
3. Ne jamais toucher au code hors du périmètre (`Files`) de l'issue. Autre problème vu → créer une issue, pas le corriger.
4. Ne jamais désactiver un test, baisser un seuil, ajouter `# type: ignore`, `# noqa`, `eslint-disable`, `@ts-ignore`
   ou utiliser `--no-verify` pour faire passer la CI. Corrige la cause.
5. Ne jamais commiter de secret ni de donnée réelle (dépôt **public**). Toute nouvelle variable d'env va dans `.env.example`.
   Ne lis jamais `.env`.
6. Toute modification de modèle SQLAlchemy passe par une migration Alembic.
7. Tout changement de l'API (route, schéma) régénère `packages/api-client` (`make api-types`) dans la même PR.
8. En cas de doute sur le besoin : poser la question en commentaire de l'issue (`gh issue comment`) plutôt que deviner.
9. Ne jamais `push --force`, ni merger autrement que `gh pr merge <n> --squash --auto --delete-branch`.

Un hook (`.claude/hooks/git-guard.sh`) bloque les violations git ; s'il te bloque, ne le contourne pas : dis-le à ton humain.

## 4. Workflow (détail : `docs/workflow.md`)

1. `/next-task` : choisit une issue `Todo` assignée à ton humain, sans recoupement de `Files`, la passe `In Progress`,
   crée la branche depuis `origin/main`, commente le plan (attendre l'ok humain si taille M).
2. Début de chaque session sur une branche : `git fetch && git rebase origin/main` (jamais de merge de `main`).
3. Implémenter en petits commits Conventional Commits : `feat(api): add swipe endpoint (#42)`.
4. `/ship` : `make fmt lint test` verts, migration créée **après** rebase, PR avec `Closes #N`, review demandée
   au relecteur de la rotation, ticket `In Review`.
5. Le relecteur lance `/review` : tests indépendants commités en `test(review): …`, checklist, approve + auto-merge
   ou request changes. Il ne corrige jamais le code de l'auteur.
6. L'auteur lance `/fix-review` : corrige sans modifier les tests du relecteur, répond à chaque commentaire.
7. `/board` : état du sprint. `/info` : ce qui t'attend et ta prochaine action (aussi sur « qu'est-ce que je dois faire ? »).

## 5. Définition de Done

- Critères d'acceptation (Étant donné / Quand / Alors) tous couverts et cochés dans la PR.
- Tests ajoutés : cas nominal + erreurs évidentes + autorisations.
- `make lint` et `make test` verts en local ; CI verte.
- `packages/api-client` à jour si l'API a bougé ; une seule tête Alembic.
- Doc mise à jour si le comportement change (`docs/`, CLAUDE.md d'app).
- PR liée à l'issue (`Closes #N`), board à jour (`In Review` puis `Done` au merge).

## 6. Rotation de review (fixe)

| Auteur | GitHub | Relu par |
|---|---|---|
| Enzo Ravignon | `enzorvg` | Hugo (`hugo-ry02`) |
| Louis Baudat | `louisbdt` | Enzo (`enzorvg`) |
| Hugo Rayaume | `hugo-ry02` | Louis (`louisbdt`) |

Hugo relit Enzo, Enzo relit Louis, Louis relit Hugo. Chacun relit exactement une personne.

## 7. Conventions de code

- Nommage : Python `snake_case` / classes `PascalCase` ; TS `camelCase`, composants `PascalCase`, fichiers de composant `PascalCase.tsx`.
  Tables et colonnes en anglais `snake_case` pluriel (`job_offers`). Correspondance FR ↔ EN : `docs/glossaire.md`.
- Typage strict partout : mypy strict sur `apps/api/app`, TS `strict`. **Pas de `any`**, pas de cast non justifié.
- Erreurs : l'API lève des `DomainError` (`app/core/errors.py`), jamais `HTTPException` dans un service.
  Le front affiche un message utilisateur en français, jamais une stack.
- Logs : module `logging` (Python), jamais `print` ; pas de `console.log` (seuls `console.warn/error`).
- Couleurs, radius, polices : uniquement via `@swape/design-tokens`. **Jamais de couleur en dur.**
- Pas de dépendance ajoutée sans la justifier dans la PR.

## 8. Sécurité et RGPD

- Jamais de donnée personnelle dans les logs (log des ids, pas d'email, nom, téléphone, CV).
- Autorisation vérifiée **côté API sur chaque endpoint** : un recruteur ne voit que les offres et candidatures
  de son entreprise ; un candidat ne voit que ses propres données et candidatures. Un test d'autorisation par endpoint.
- Validation stricte des entrées (schémas Pydantic, contraintes de longueur / format / enum).
- Mots de passe en Argon2, JWT access + refresh, secrets uniquement via variables d'environnement.
- Données de démo entièrement fictives. Hébergement UE (exigence du cahier des charges).

## 9. Règles anti-conflit

- Chaque issue liste ses `Files`. Deux tickets dont les `Files` se recoupent ne sont jamais `In Progress` en même temps.
- Découpage vertical : un ticket = une fonctionnalité dans un domaine (`apps/api/app/<domaine>/` + `apps/web/src/features/<domaine>/`
  ou `apps/mobile/src/features/<domaine>/`).
- **Fichiers chauds** — modifier au minimum, en **ajoutant une ligne** plutôt qu'en réorganisant :
  `apps/api/app/db/base.py`, `apps/api/app/main.py`, `apps/api/alembic/versions/`, `packages/api-client/` (généré),
  `packages/design-tokens/`, `apps/web/src/app/router.tsx`, `apps/mobile/app/_layout.tsx`,
  tous les `package.json`, `pyproject.toml`, `pnpm-lock.yaml`, `uv.lock`, `Makefile`, `.github/workflows/ci.yml`.
- Conflit de lockfile : ne jamais le résoudre à la main. `git checkout origin/main -- <lockfile>` puis `uv lock` / `pnpm install`.
- Client API généré : jamais édité à la main ; en cas de conflit, régénérer après rebase (`make api-types`).
- Alembic : **une migration par ticket**, créée juste avant `/ship`, après rebase sur `main`. La CI refuse deux têtes.
- Les routers et modèles API sont découverts automatiquement (`app/discovery.py`) : ne pas toucher `main.py` pour ajouter un domaine.

## 10. Règles IA (AI Act) — Job Simulation

L'IA de recrutement est à **haut risque** (AI Act). Donc :
- L'IA **observe et résume, elle ne décide jamais**. Aucune action automatique (refus, classement, match) à partir d'une sortie LLM :
  le recruteur tranche toujours.
- Scoring **explicable critère par critère** (critère, observation, preuve dans le journal d'actions). Pas de note globale opaque.
- Le candidat peut consulter son rapport.
- Appels LLM **uniquement côté API**, via l'interface `LLMProvider` (`apps/api/app/llm/provider.py`). Jamais de SDK de fournisseur
  importé ailleurs, jamais d'appel LLM depuis le web ou le mobile, jamais de clé dans le code.
- Les tests utilisent `FakeLLMProvider` (déterministe). **Aucun test n'appelle un vrai LLM.**
- Les signaux de triche sont des indices présentés au recruteur, jamais une sanction automatique.

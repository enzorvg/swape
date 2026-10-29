# Swape

Le « Tinder du recrutement » : stages, alternances, CDD, CDI, intérim et jobs étudiants.
App mobile candidat, SaaS web recruteur, API FastAPI, et la **Job Simulation** (« Vis le job avant de postuler »).

- Cahier des charges : [`docs/specs/cahier-des-charges.pdf`](docs/specs/cahier-des-charges.pdf)
- Architecture : [`docs/architecture.md`](docs/architecture.md) · Glossaire : [`docs/glossaire.md`](docs/glossaire.md)
- Workflow équipe : [`docs/workflow.md`](docs/workflow.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md)

## Démarrer en 5 minutes

### Prérequis

| Outil | Version | Installation |
|---|---|---|
| git | récent | — |
| Docker + Compose | 29+ / v2+ | Docker Desktop ou paquet de ta distribution |
| Node.js | 24 (voir `.nvmrc`) | `fnm install 24` ou `nvm install 24` |
| pnpm | via corepack | `corepack enable` (fait par `make setup`) |
| uv | 0.12+ | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| GitHub CLI | 2.x | `gh auth login`, **puis `gh auth refresh -s project`** (nécessaire pour le board) |
| jq | 1.7+ | paquet de ta distribution (utilisé par les hooks Claude Code) |
| Claude Code | récent | https://code.claude.com |

### Installation

```bash
git clone git@github.com:enzorvg/swape.git
cd swape
make setup        # .env, dépendances, hooks pre-commit, bases PostgreSQL + migrations
make dev          # API http://localhost:8000 (docs : /docs) + web http://localhost:5173
make dev-mobile   # Expo : scanner le QR code avec Expo Go
make test         # toutes les suites
```

`make help` liste toutes les commandes.

## Onboarding d'un nouveau membre

1. Avoir été ajouté comme collaborateur (droit *Write*) sur `enzorvg/swape` et au Project « Swape — Board ».
2. `gh auth login` puis `gh auth refresh -s project`.
3. Cloner le dépôt, puis `make setup` (installe aussi le hook pre-commit).
4. Lancer `claude` à la racine du dépôt et accepter de faire confiance au dossier (active les permissions et hooks partagés).
5. Taper `/next-task` : Claude propose ton prochain ticket, crée la branche et commente son plan.
6. Quand c'est prêt : `/ship`. Pour relire la PR de ton binôme : `/review`. Après une demande de changements : `/fix-review`.
   Perdu ? `/info` dit ce qui t'attend et quoi faire ensuite (`!info` ne marche pas : `!` lance une commande shell).

Rotation de review : Hugo relit Enzo, Enzo relit Louis, Louis relit Hugo.

## Structure

```
apps/api            FastAPI + SQLAlchemy + Alembic          (voir apps/api/CLAUDE.md)
apps/web            Landing + SaaS recruteur + simulation   (voir apps/web/CLAUDE.md)
apps/mobile         App candidat Expo                       (voir apps/mobile/CLAUDE.md)
packages/api-client Client TypeScript généré depuis l'OpenAPI (make api-types)
packages/design-tokens Charte « Modern Soft Tech »
docs/               Architecture, glossaire, workflow, ADR, specs
.claude/            Règles partagées de Claude Code : settings, hooks, skills
```

## Règles essentielles

`main` est protégée : tout passe par une PR liée à une issue, relue selon la rotation, CI verte, merge squash.
Le dépôt est **public** : aucun secret, aucune donnée réelle (scan gitleaks en pre-commit et en CI).
Le détail est dans [`CLAUDE.md`](CLAUDE.md) et [`CONTRIBUTING.md`](CONTRIBUTING.md).

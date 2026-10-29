# Contribuer à Swape

Ce guide décrit le workflow pour les humains. Claude Code suit les mêmes règles via [`CLAUDE.md`](CLAUDE.md)
et les skills de `.claude/skills/` ; le cycle complet est schématisé dans [`docs/workflow.md`](docs/workflow.md).

## 1. Le board

Tout se passe dans GitHub : Issues + Project « Swape — Board ».

- **Statuts** : `Backlog` → `Todo` → `In Progress` → `In Review` → `Done` (+ `Blocked`).
- **Champs** : `Priority` (P0/P1/P2), `Size` (S ≤ ½ j, M ≤ 2 j, L = à découper), `Area`, `Sprint` (itérations de 2 semaines),
  `Relecteur` (« Reviewer » est un nom réservé par GitHub ; `board.sh` accepte les deux), `Files`.
- `scripts/board.sh move|set|list|conflicts` évite de manipuler les IDs du Project (lit `.github/project.json`).

Une issue est **prête** (`Todo`) quand elle a : un seul assigné, des critères « Étant donné / Quand / Alors »,
une zone, une taille S ou M, ses dépendances (« Bloquée par #N ») et son champ `Files`.

## 2. Prendre une tâche

Avec Claude : `/next-task`. À la main :

```bash
scripts/board.sh list --status Todo --assignee @me
scripts/board.sh conflicts <n>          # doit être vide
scripts/board.sh move <n> "In Progress"
git fetch origin && git switch -c feat/<n>-<slug> origin/main
```

Commente l'issue avec ton plan. Reste dans le périmètre `Files` ; tout autre problème devient une nouvelle issue.

## 3. Coder

- Rebase au début de chaque session : `git fetch && git rebase origin/main`. Jamais de merge de `main` dans ta branche.
- Commits Conventional Commits en anglais avec le numéro : `feat(api): add swipe endpoint (#42)`.
- Le hook pre-commit (ruff, eslint, prettier, gitleaks…) doit passer : **jamais `--no-verify`**.
- Modèle modifié → migration Alembic (une par ticket, créée juste avant la PR, après rebase).
- API modifiée → `make api-types` et commit de `packages/api-client`.

## 4. Ouvrir la PR

Avec Claude : `/ship`. Sinon : `make fmt lint test`, rebase, push, `gh pr create` avec le template rempli
(`Closes #N`, critères cochés, DoD), relecteur de la rotation, ticket en `In Review`.

## 5. Relire

| Auteur | Relu par |
|---|---|
| Enzo (`enzorvg`) | Hugo (`hugo-ry02`) |
| Louis (`louisbdt`) | Enzo (`enzorvg`) |
| Hugo (`hugo-ry02`) | Louis (`louisbdt`) |

Avec Claude : `/review`. Le relecteur :
1. travaille dans un worktree séparé (`git worktree add ../swape-review-<pr> <branche>`) ;
2. lit l'issue **avant** le code ;
3. écrit ses propres tests à partir des critères (limites, erreurs, autorisations, intégration) et les commite
   sur la branche de la PR en `test(review): …` ;
4. passe la checklist (périmètre, couches, sécurité/RGPD, migrations, N+1, types, erreurs, doc) ;
5. approuve puis `gh pr merge <n> --squash --auto --delete-branch`, **ou** demande des changements avec des commentaires
   précis. Il ne corrige jamais le code de l'auteur.

## 6. Corriger après review

Avec Claude : `/fix-review`. Corrige chaque point, fais passer les tests du relecteur **sans les modifier**
(si un test semble faux, dis-le en réponse et laisse le relecteur trancher), réponds à chaque commentaire, redemande la review.

## 7. Éviter les conflits

- Deux tickets dont les `Files` se recoupent ne sont jamais en cours en même temps.
- Fichiers chauds (liste dans `CLAUDE.md`) : ajouter une ligne, ne pas réorganiser.
- Conflit de lockfile : `git checkout origin/main -- pnpm-lock.yaml` (ou `apps/api/uv.lock`) puis `pnpm install` / `uv lock`.
- Conflit sur `packages/api-client` : régénérer avec `make api-types`.
- Deux migrations Alembic : supprime la tienne, rebase, recrée-la.

## 8. Définition de Done

Critères couverts et cochés, tests (nominal, erreurs, autorisations), `make lint` + `make test` verts, client API à jour,
migration unique, doc à jour, PR liée (`Closes #N`), board à jour.

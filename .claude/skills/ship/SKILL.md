---
name: ship
description: Livrer la branche courante en pull request Swape — vérifications locales, relecture contre les critères d'acceptation, rebase, PR avec template, review demandée selon la rotation, ticket passé In Review.
disable-model-invocation: true
---

# /ship — livrer en PR

## 0. Contexte
```bash
git branch --show-current          # doit être <type>/<n>-<slug>, jamais main
gh api user --jq .login
gh issue view <n> --comments       # n = numéro dans le nom de branche
```
Si tu es sur `main` ou si l'issue n'est pas assignée à l'humain : **stop**.

## 1. Rebase d'abord
```bash
git fetch origin
git rebase origin/main
```
Conflits :
- lockfile (`pnpm-lock.yaml`, `uv.lock`) : `git checkout origin/main -- <lockfile>` puis `pnpm install` / `(cd apps/api && uv lock)` ;
- `packages/api-client/` : prendre n'importe quel côté puis `make api-types` ;
- autre fichier : résoudre, et si c'est hors de ton périmètre, demande à l'humain.

## 2. Migration (si un modèle a changé)
Une seule migration par ticket, créée **maintenant** (après rebase) :
```bash
make db-revision m="<description>"
make db-migrate
cd apps/api && uv run alembic heads   # une seule tête attendue
```
Relis le fichier généré (enums, contraintes, `downgrade`).

## 3. Vérifications — tout doit être vert
```bash
make fmt
make lint
make test
make api-types        # si une route ou un schéma de l'API a changé
git status --short    # le client généré modifié doit être commité
```
Échec : corrige la cause. Jamais de test désactivé, de seuil baissé, de `noqa` / `type: ignore` / `eslint-disable`, de `--no-verify`.

## 4. Relire son propre diff
```bash
git diff origin/main...HEAD --stat
git diff origin/main...HEAD
```
- Chaque critère d'acceptation de l'issue : couvert par du code **et** un test ? Note lequel.
- Tous les fichiers modifiés sont-ils dans `Files` ? Sinon : retirer ou en parler à l'humain.
- Pas de secret, pas de donnée personnelle dans les logs, pas de couleur en dur, pas de `print` / `console.log`.

## 5. Push
```bash
git push -u origin HEAD
```
Si le push est refusé parce que la branche distante a divergé (le relecteur a poussé des tests) :
`git pull --rebase origin <branche>` puis push. **Jamais de `--force`.**

## 6. Ouvrir la PR
Relecteur selon la rotation (CLAUDE.md §6) : `enzorvg` → `hugo-ry02`, `louisbdt` → `enzorvg`, `hugo-ry02` → `louisbdt`.
```bash
gh pr create --base main --title "<type>(<zone>): <résumé en anglais> (#<n>)" --body-file <fichier> --reviewer <relecteur> --assignee @me
```
Corps : remplir `.github/pull_request_template.md` en français — `Closes #<n>`, contexte, changements, comment tester
(commandes exactes), critères d'acceptation cochés, checklist DoD, captures si UI (sinon « N/A »).

## 7. Mettre le board à jour
```bash
scripts/board.sh move <n> "In Review"
scripts/board.sh set <n> Reviewer <relecteur>
```

## 8. Résumer à l'humain
Lien de la PR, relecteur, critères couverts, points d'attention (choix discutables, dette, migration, dépendance ajoutée),
et rappel : la CI doit passer ; le relecteur lancera `/review`.

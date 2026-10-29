---
name: next-task
description: Prendre la prochaine tâche Swape — choisit une issue Todo assignée à l'humain sans conflit de fichiers, la passe In Progress, crée la branche et commente le plan. À utiliser quand l'humain veut commencer à travailler sur un ticket.
argument-hint: "[numéro d'issue]"
disable-model-invocation: true
---

# /next-task — prendre une tâche

Argument éventuel : `$ARGUMENTS` (numéro d'issue imposé par l'humain).

## 1. Identifier l'humain
```bash
gh api user --jq .login
```
Retiens ce login : tu ne travailles **que** sur des issues assignées à ce login.

## 2. Vérifier l'état local
```bash
git status --short
git branch --show-current
```
S'il y a des modifications non commitées, **stop** : demande à l'humain quoi en faire (commit sur sa branche, stash). Ne jette rien.

## 3. Lister les candidates
```bash
scripts/board.sh list --status Todo --assignee @me
```
Tri : `Priority` (P0 > P1 > P2), puis `Sprint` (le plus ancien d'abord), puis numéro.
Si `$ARGUMENTS` est fourni, ne garde que cette issue et vérifie qu'elle est bien assignée à l'humain et en `Todo`.
Si elle ne l'est pas : **stop**, explique pourquoi.

## 4. Écarter les tickets non démarrables
Pour chaque candidate, dans l'ordre :
1. Dépendances : dans le corps (`gh issue view <n> --json body`), chaque « Bloquée par #N » doit être fermée
   (`gh issue view N --json state --jq .state` = `CLOSED`). Sinon, écarter.
2. Fichiers : `scripts/board.sh conflicts <n>` liste les tickets `In Progress` / `In Review` d'**autres** membres
   dont le champ `Files` recoupe celui-ci. S'il y en a, écarter (et noter lequel bloque).
3. Taille `L` : écarter, et proposer à l'humain de la découper.

## 5. Proposer — POINT D'ARRÊT
Présente à l'humain : le ticket retenu (numéro, titre, priorité, taille, `Files`), et en une ligne chacun les tickets écartés et pourquoi.
**Attends son ok** avant de continuer. S'il en choisit un autre, reprends l'étape 4 pour celui-là.

## 6. Lire le contexte
```bash
gh issue view <n> --comments
```
Lis le corps entier (critères d'acceptation, hors périmètre), les commentaires, puis les fichiers existants listés dans `Files`
et le `CLAUDE.md` de chaque app concernée.

## 7. Démarrer
```bash
scripts/board.sh move <n> "In Progress"
git fetch origin
git switch -c <type>/<n>-<slug> origin/main
```
- `<type>` : `feat`, `fix`, `chore`, `docs`, `test` ou `refactor` (d'après le label `type:*`).
- `<slug>` : 2 à 4 mots en anglais, kebab-case. Ex. `feat/42-swipe-offers`.

## 8. Commenter le plan
```bash
gh issue comment <n> --body "<texte>"
```
En français : « Prise en charge par @<login> », plan en 3 à 6 puces, fichiers prévus (doivent rester dans `Files`),
tests prévus, questions ouvertes éventuelles.
- Taille **M** : **POINT D'ARRÊT**, attends l'ok de l'humain sur le plan avant de coder.
- Si le plan sort de `Files` : stop, demande à l'humain (on modifie le ticket ou on en crée un autre).

## 9. Implémenter
- Petits commits Conventional Commits en anglais, avec le numéro : `feat(api): add offer creation endpoint (#42)`.
- Tests unitaires du cas nominal et des erreurs évidentes au fil de l'eau (+ test d'autorisation pour chaque endpoint).
- Reste dans `Files`. Un autre problème repéré → `gh issue create` (template adapté), pas de correction.
- Début de chaque nouvelle session sur cette branche : `git fetch && git rebase origin/main`.
- Quand c'est prêt : `/ship`.

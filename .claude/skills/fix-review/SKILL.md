---
name: fix-review
description: Corriger une PR Swape après une demande de changements — récupère les commentaires non résolus, corrige, fait passer les tests du relecteur sans les modifier, répond à chaque commentaire et redemande la review.
argument-hint: "[numéro de PR]"
disable-model-invocation: true
---

# /fix-review — corriger après une demande de changements

Argument éventuel : `$ARGUMENTS` (numéro de PR ; sinon la PR de la branche courante : `gh pr view --json number`).

## 1. Se mettre à jour
```bash
git switch <branche de la PR>
git fetch origin
git pull --rebase origin <branche de la PR>   # récupère les commits test(review) du relecteur
git rebase origin/main
```

## 2. Récupérer les retours non résolus
```bash
gh pr view <pr> --comments
gh api repos/{owner}/{repo}/pulls/<pr>/comments --jq '.[] | {id, path, line, body, user: .user.login, in_reply_to_id}'
gh api graphql -f query='query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){reviewThreads(first:100){nodes{id isResolved comments(first:1){nodes{databaseId path body}}}}}}}' -F o='{owner}' -F r='{repo}' -F n=<pr>
```
Fais la liste des fils **non résolus** et des tests `test(review)` en échec (`make test`).

## 3. Corriger — POINT D'ARRÊT si désaccord
- Corrige chaque point dans le périmètre de l'issue, commits `fix(<zone>): <quoi> (#<n>)`.
- Fais passer les tests du relecteur **sans les modifier**.
- Si un test du relecteur te semble faux, ou un commentaire discutable : ne le modifie pas, présente ton argument à l'humain,
  puis réponds sur le fil et laisse le relecteur trancher.

## 4. Vérifier
```bash
make fmt && make lint && make test
make api-types   # si l'API a bougé
```

## 5. Répondre à chaque commentaire
```bash
gh api repos/{owner}/{repo}/pulls/<pr>/comments/<id>/replies -f body="Corrigé dans <sha> : <explication>"
```
Ne résous pas toi-même les fils : c'est au relecteur de le faire.

## 6. Pousser et redemander la review
```bash
git push origin HEAD          # jamais --force ; si refusé : git pull --rebase origin <branche> puis push
gh pr edit <pr> --add-reviewer <relecteur>
scripts/board.sh move <n> "In Review"
```
Résume à l'humain : ce qui a été corrigé, ce qui reste en discussion.

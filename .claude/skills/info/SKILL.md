---
name: info
description: Dire au membre Swape ce qui l'attend et quelle est sa prochaine action — PR à corriger, reviews à faire, tickets en cours, PR en attente, prochain ticket démarrable, blocages. À utiliser quand l'humain tape /info ou demande « qu'est-ce que je dois faire ? », « qu'est-ce qui m'attend ? », « où j'en suis ? ».
---

# /info — que dois-je faire maintenant ?

**Lecture seule** : ne déplace aucun ticket, ne crée aucune branche, ne commite rien.
Tout concerne **uniquement l'humain courant**.

## 1. Collecter
```bash
gh api user --jq .login
git branch --show-current
git status --short
gh pr list --author @me --state open --json number,title,url,isDraft,reviewDecision,statusCheckRollup,updatedAt,headRefName
gh pr list --search "review-requested:@me" --state open --json number,title,url,author,createdAt,updatedAt
scripts/board.sh list --status "In Progress" --assignee @me
scripts/board.sh list --status "In Review" --assignee @me
scripts/board.sh list --status Blocked --assignee @me
scripts/board.sh list --status Todo --assignee @me
```
Pour chaque ticket `In Progress` : sa branche locale (`git branch --list '*/<n>-*'`) et son dernier commit
(`git log -1 --format='%h %s (%cr)' <branche>`).
Pour chaque ticket `Todo` (dans l'ordre Priority puis Sprint) : dépendances « Bloquée par #N » encore ouvertes
(`gh issue view <n> --json body`, puis `gh issue view N --json state`) et `scripts/board.sh conflicts <n>`.
Garde le premier ticket sans dépendance ouverte ni conflit : c'est le **prochain ticket démarrable**.

## 2. Classer
- **À corriger** : mes PR avec `reviewDecision = CHANGES_REQUESTED`, ou avec un check en échec dans `statusCheckRollup`.
- **À relire** : PR où ma review est demandée ; ancienneté depuis `createdAt` (signaler au-delà de 24 h).
- **En cours** : mes tickets `In Progress` ; « prêt à livrer » si la branche existe, a des commits et qu'aucune PR n'est ouverte.
- **En attente des autres** : mes PR `REVIEW_REQUIRED` (relecteur, ancienneté) ou `APPROVED` avec CI en cours
  (l'auto-merge s'en charge).
- **Bloqué** : statut `Blocked`, ou `Todo` dont une dépendance est ouverte, ou ticket en conflit de `Files` (dire lequel).
- **Ensuite** : le prochain ticket démarrable (numéro, titre, priorité, taille).

## 3. Répondre (en français, court)
Un bloc par catégorie **non vide**, une ligne par élément avec son lien ou son numéro. Pas de catégorie vide.
Si des modifications locales non commitées existent, le signaler en premier.

Termine par **une seule action recommandée**, la première applicable dans cet ordre :
1. une PR à corriger → « Lance `/fix-review <pr>` » ;
2. une review demandée → « Lance `/review <pr>` » (la plus ancienne) ;
3. un ticket en cours non livré → « Reprends #<n> sur `<branche>` (`git fetch && git rebase origin/main`) », ou « Lance `/ship` » s'il est prêt ;
4. un ticket démarrable → « Lance `/next-task <n>` » ;
5. rien → « Rien en attente pour toi : regarde `/board` ou propose un ticket. »

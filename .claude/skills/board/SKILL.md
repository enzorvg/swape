---
name: board
description: État des lieux du sprint Swape — par membre, tickets en cours, en review, bloqués, et PR qui attendent une review depuis plus de 24 h. À utiliser quand on demande où en est l'équipe ou le sprint.
---

# /board — état des lieux du sprint

Lecture seule : ne déplace aucun ticket.

## 1. Collecter
```bash
scripts/board.sh list --status "In Progress"
scripts/board.sh list --status "In Review"
scripts/board.sh list --status Blocked
scripts/board.sh list --status Todo
gh pr list --state open --json number,title,author,reviewRequests,createdAt,updatedAt,isDraft,reviewDecision
```
Ne garde que le sprint courant (champ `Sprint` ; le plus récent qui contient des tickets non `Done`).

## 2. Calculer
- PR en attente de review > 24 h : PR ouvertes, non draft, `reviewDecision` vide ou `REVIEW_REQUIRED`, dont la dernière
  activité (`updatedAt`) date de plus de 24 h.
- Tickets bloqués : statut `Blocked` ou « Bloquée par #N » avec #N encore ouvert.
- Recoupements suspects : pour chaque ticket `In Progress`, `scripts/board.sh conflicts <n>`.

## 3. Présenter (en français, concis)
Un tableau par membre (`enzorvg`, `louisbdt`, `hugo-ry02`) : En cours / En review (avec le relecteur) / Bloqué (avec la cause) / Todo restants.
Puis : PR en attente > 24 h (lien, relecteur, ancienneté), conflits de `Files` détectés, et une ligne d'alerte
si un membre n'a rien en cours ou si la rotation de review n'est pas respectée.

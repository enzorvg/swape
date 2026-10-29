---
name: review
description: Relire et tester la PR d'un autre membre Swape — worktree séparé, tests indépendants écrits depuis les critères d'acceptation, checklist, puis approbation + auto-merge ou demande de changements.
argument-hint: "[numéro de PR]"
disable-model-invocation: true
---

# /review — relire et tester une PR

Argument éventuel : `$ARGUMENTS` (numéro de PR). Le relecteur **ne corrige jamais le code de l'auteur** :
il ajoute des tests et des commentaires.

## 1. Choisir la PR
```bash
gh api user --jq .login
gh pr list --search "review-requested:@me" --state open
```
Sans argument : propose la plus ancienne. Vérifie que la rotation est respectée (CLAUDE.md §6) ; sinon signale-le à l'humain.

## 2. Worktree séparé (ne pas toucher la tâche en cours de l'humain)
```bash
gh pr view <pr> --json headRefName,number,title,body,files
git fetch origin <branche>
git worktree add ../swape-review-<pr> <branche>
cd ../swape-review-<pr>
(cd apps/api && uv sync) && pnpm install
```
Toutes les commandes suivantes s'exécutent dans `../swape-review-<pr>`.

## 3. Lire l'issue AVANT le code
L'issue liée est dans `Closes #N` du corps de la PR :
```bash
gh issue view <N> --comments
```
Liste pour toi les critères d'acceptation et le périmètre `Files`.

## 4. Écrire des tests indépendants
À partir des **seuls critères d'acceptation** (n'ouvre pas les tests de l'auteur avant d'avoir écrit les tiens) :
- cas limites et données invalides (422) ;
- erreurs (404, 409) ;
- **autorisations** : qui n'a PAS le droit (sans token → 401, autre candidat / autre entreprise → 403) ;
- au moins un test d'intégration au niveau de l'API (`client`) ou de l'écran (Testing Library).

Place-les dans des fichiers dédiés (`tests/<domaine>/test_<sujet>_review.py`, `<Composant>.review.test.tsx`), puis :
```bash
git add <fichiers de test>
git commit -m "test(review): <ce qui est vérifié> (#<N>)"
```

## 5. Checklist de code
```bash
gh pr diff <pr>
```
- [ ] tous les critères d'acceptation sont implémentés ;
- [ ] périmètre : aucun fichier hors `Files` ;
- [ ] architecture en couches (router → service → repository) / features côté front ;
- [ ] sécurité et RGPD : autorisation vérifiée sur chaque endpoint, pas de donnée perso dans les logs, entrées validées, pas de secret ;
- [ ] migration : une seule, réversible, cohérente avec les modèles ;
- [ ] performance : pas de N+1, pas d'appel bloquant en async ;
- [ ] lisibilité, nommage, types (pas de `any`, pas de suppression de lint) ;
- [ ] gestion d'erreurs (`DomainError`, messages utilisateur en français) ;
- [ ] tokens de la charte (pas de couleur en dur) ; client API régénéré si l'API a changé ;
- [ ] Job Simulation : IA qui observe sans décider, scoring par critère, `LLMProvider` + faux fournisseur en test ;
- [ ] doc mise à jour si le comportement change.

## 6. Lancer toute la suite puis pousser
```bash
make lint && make test
git push origin HEAD
gh pr checks <pr> --watch
```

## 7. Décider — POINT D'ARRÊT
Présente le verdict à l'humain (tests ajoutés et résultats, checklist, problèmes trouvés) et **attends son ok**.

**Tout passe et la checklist est OK** :
```bash
gh pr review <pr> --approve --body "<résumé : tests ajoutés, points vérifiés>"
gh pr merge <pr> --squash --auto --delete-branch
```

**Un test échoue ou problème bloquant** : le test qui échoue reste commité comme preuve.
```bash
gh pr review <pr> --request-changes --body "<synthèse>"
```
Commentaires de ligne précis (fichier, ligne, pourquoi, suggestion) :
```bash
gh api repos/{owner}/{repo}/pulls/<pr>/comments -f body="<pourquoi + suggestion>" -f commit_id="$(git rev-parse HEAD)" -f path="<fichier>" -F line=<ligne> -f side=RIGHT
```
Points mineurs non bloquants : commentaires préfixés « nit: », sans bloquer l'approbation.

## 8. Nettoyer
```bash
cd -
git worktree remove ../swape-review-<pr>
```

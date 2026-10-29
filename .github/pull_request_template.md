Closes #

## Résumé

<!-- En une ou deux phrases : ce que fait cette PR et pourquoi. -->

## Changements

-

## Comment tester

```bash
make test
```

<!-- Étapes manuelles éventuelles (route, écran, compte de démo fictif). -->

## Critères d'acceptation

- [ ] <!-- recopier chaque critère de l'issue et le cocher -->

## Définition de Done

- [ ] Critères d'acceptation couverts par des tests (nominal, erreurs, autorisations)
- [ ] `make lint` et `make test` verts en local
- [ ] `packages/api-client` régénéré (`make api-types`) si l'API a changé
- [ ] Migration Alembic unique et réversible si un modèle a changé
- [ ] Aucun fichier hors du périmètre `Files` de l'issue
- [ ] Aucun secret, aucune donnée réelle, aucune donnée personnelle dans les logs
- [ ] Doc mise à jour si le comportement change
- [ ] Ticket passé `In Review`, relecteur de la rotation demandé

## Captures

<!-- Obligatoires si l'UI change, sinon « N/A ». -->

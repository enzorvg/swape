# apps/mobile — app candidat (Expo)

Expo SDK 58 + Expo Router + TypeScript strict + TanStack Query. iOS et Android uniquement (pas de cible web).
Depuis la racine : `make dev-mobile`. Ici : `pnpm start`, `pnpm test`, `pnpm lint`, `pnpm typecheck`.

## Expo change vite : ne pas se fier à sa mémoire

Avant d'écrire du code qui touche une API Expo / React Native, lire la doc **de la version installée** :
`https://docs.expo.dev/versions/v58.0.0/` (et `https://docs.expo.dev/llms.txt`).
Ajouter une dépendance native **toujours** avec `pnpm exec expo install <paquet>` (versions compatibles SDK), jamais `pnpm add`.
`pnpm exec expo install --check` doit rester propre.

## Structure

```
app/                    # routes Expo Router (fichiers fins : importent un écran de src/features)
  _layout.tsx           # providers + Stack (fichier chaud)
  index.tsx
  (<domaine>)/...       # un groupe de routes par domaine pour éviter les conflits
src/
  features/<domaine>/   # écrans, composants, hooks api.ts, tests (<Ecran>.test.tsx)
  shared/               # composants UI génériques
  theme/                # réexporte @swape/design-tokens : seule source des couleurs, radius, espacements
```

## Ajouter un écran

1. `src/features/<domaine>/<Nom>Screen.tsx` + `<Nom>Screen.test.tsx`.
2. Route fine dans `app/(<domaine>)/<nom>.tsx` : `export { NomScreen as default } from '...'` ou équivalent.
3. Données via un hook TanStack Query dans `features/<domaine>/api.ts`, basé sur `@swape/api-client`.

## Style

- `StyleSheet.create` avec les valeurs de `src/theme` (`colors.primary`, `radius.lg`, `spacing.md`).
  **Jamais de couleur en dur.**
- Usage à une main : actions principales en bas de l'écran, cibles tactiles ≥ 44 px.
- Swipe : gauche = refuser (`colors.danger`), droite = candidater (`colors.primary`).

## Tests

- jest-expo + React Native Testing Library. `await render(...)` puis `screen.getByText` / `getByRole`.
- Réseau mocké (hook ou `fetch`), jamais de vraie API.

## Pièges connus

- Variables d'env : seulement `EXPO_PUBLIC_*`, visibles dans le bundle : jamais de secret.
- Sur un téléphone physique, `localhost` ne pointe pas sur l'API : utiliser l'IP LAN dans `EXPO_PUBLIC_API_URL`.
- Le runtime de la Job Simulation n'est pas dans l'app : on ouvre la route web `/simulation/...` via un lien.
- ESLint est en v9 ici (eslint-config-expo n'est pas compatible v10) : ne pas monter de version.

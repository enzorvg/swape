# apps/web — SaaS recruteur, landing et runtime Job Simulation

React 19 + Vite + TypeScript strict, React Router, TanStack Query, Tailwind CSS v4.
Depuis la racine : `make dev-web`. Ici : `pnpm dev`, `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm test:e2e`.

## Structure

```
src/
  main.tsx              # point d'entrée
  app/                  # App (providers), router.tsx (table des routes, fichier chaud), queryClient
  features/<domaine>/   # tout ce qui est propre à une fonctionnalité
    <Page>.tsx          # pages (composants de route)
    components/         # composants internes à la feature
    api.ts              # hooks TanStack Query (useOffers, useCreateOffer…) basés sur @swape/api-client
    <Page>.test.tsx     # tests à côté du code
  shared/               # composants UI génériques (Button, Card…), utilitaires ; rien de métier
  styles/index.css      # Tailwind + tokens (ne pas y mettre de styles de feature)
e2e/                    # Playwright (un test de fumée pour l'instant)
```

Espaces de routes : `/` landing (public), `/recruiter/*` SaaS recruteur, `/simulation/*` runtime candidat de la Job Simulation.

## Ajouter un écran

1. Créer `src/features/<domaine>/<Nom>Page.tsx` (+ test).
2. Ajouter **une ligne** dans `src/app/router.tsx`. Ne pas réordonner les routes existantes.
3. Données : un hook dans `features/<domaine>/api.ts`, jamais de `fetch` direct dans un composant :

```ts
export function useOffer(offerId: string) {
  return useQuery({
    queryKey: ['offers', offerId],
    queryFn: async () => {
      const { data, error } = await api.GET('/offers/{offer_id}', { params: { path: { offer_id: offerId } } });
      if (error) throw new Error(error.error.message);
      return data;
    },
  });
}
```

Les types viennent de `@swape/api-client` (généré). S'il manque une route, elle doit d'abord exister côté API puis `make api-types`.

## Style

- Uniquement les classes issues des tokens : `bg-primary`, `text-text`, `bg-background`, `rounded-lg`, `shadow-card`,
  `font-display` (titres, Gliker), `font-body` (Poppins). **Jamais de couleur en dur** (`#00BF63`, `bg-[#...]`, `text-green-500`).
- Charte « Modern Soft Tech » : coins très arrondis, ombres légères. Desktop d'abord pour `/recruiter`.
- Accessibilité : vrais `<button>`, `label` sur chaque champ, contraste suffisant.

## Tests

- Vitest + Testing Library : tester le comportement visible (`getByRole`, `getByLabelText`), pas l'implémentation.
- Mocker le réseau au niveau de `fetch` (`vi.stubGlobal`) ou du hook, jamais en appelant la vraie API.
- Envelopper avec un `QueryClientProvider` neuf par test (pas de cache partagé entre tests).

## Pièges connus

- Variables d'env exposées au navigateur : seulement `VITE_*`, lues depuis le `.env` racine. Jamais de secret côté web.
- `import type` obligatoire pour les types (`verbatimModuleSyntax`).
- La Job Simulation est jouée sur le web : aucun appel LLM depuis le front, tout passe par l'API (WebSocket).

# Maquettes de référence

Prototypes HTML/React faits en amont du projet (hors repo jusqu'ici), à utiliser comme référence
visuelle en complément de `docs/mcd.md` et `docs/specs/cahier-des-charges.pdf`. Ce ne sont **pas**
du code applicatif : rien ici n'est importé par `apps/web`, `apps/mobile` ou `apps/api`.

## Comment les ouvrir

Chaque `*-standalone.html` (ou `standalone.html`) est un fichier autonome : double-clic pour
l'ouvrir dans un navigateur, sans serveur ni build (connexion internet nécessaire pour les polices
Google Fonts). Les fichiers `*-dev.html` font la même chose mais chargent les `.jsx` à côté en
JSX in-browser (Babel) — utile pour lire/éditer le source, toujours sans build.

## Contenu

| Dossier | Ce que c'est | Statut vs l'architecture actuelle |
|---|---|---|
| `landing/` | Page d'accueil publique (`/`) : hero, « Comment ça marche », pour qui, fonctionnalités, stats, témoignages, CTA, footer | Référence directe pour l'epic Landing (dont #25) |
| `mobile/` | App candidat (swipe, profil) **+** un prototype exploratoire d'app recruteur mobile (`recruteur-*.jsx`) | Candidat : référence directe. Recruteur mobile : **hors architecture actuelle** (le recruteur n'a qu'un SaaS web desktop, cf. CLAUDE.md §1) — à discuter en équipe avant de s'en servir |
| `recruiter-web/` | SaaS recruteur web : triage des candidatures | Référence directe |
| `splash/` | Écran de démarrage mobile | Référence directe |
| `screenshots/` | Captures PNG de plusieurs écrans, pour un coup d'œil rapide sans ouvrir les HTML | — |
| `charte-graphique.pdf` | Charte graphique source | Référence |

## Écart avec `packages/design-tokens`

Les maquettes embarquent leur propre petit design system (voir `landing/styles.css`), très proche
de nos tokens actuels mais pas identique :

- Couleurs : `--vert-swape` / `--vert-doux` / `--vert-profond` / `--anthracite` correspondent à
  `--color-primary` / `--color-primary-soft` / `--color-primary-deep` / `--color-text`. Les
  maquettes ont en plus des teintes de texte et de fond graduées (`--ink-2/3/4`, `--paper-2/3`) et
  deux teintes de vert clair (`--vert-mist`, `--vert-fog`) qu'on n'a pas encore.
- Police d'affichage : les maquettes chargent `"Outfit", "Gliker"` (Outfit en priorité), nos tokens
  ont `"Gliker", "Poppins"` (Gliker en priorité, pas encore chargée dans `apps/web`).
- Ombres : 3 niveaux (`shadow-sm/md/lg`) contre 2 chez nous (`shadow-soft`/`shadow-card`).
- Rayons : quasi identiques (`sm` 10px vs 8px, le reste pareil).

Pas corrigé ici — à trancher en équipe avant de faire évoluer `packages/design-tokens` (fichier
chaud, utilisé partout).

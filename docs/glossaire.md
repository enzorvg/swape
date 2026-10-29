# Glossaire FR ↔ EN

Le métier se dit en français (cahier des charges, issues, PR) ; le code et la base sont en anglais.
Ce tableau fait foi pour nommer tables, colonnes, routes, dossiers et composants.

> Les tables sont **provisoires** : le MCD est à reconcevoir (ticket du Sprint 0). Le ticket MCD met ce tableau à jour.

## Entités

| Français | Code (classe / domaine) | Table | Notes |
|---|---|---|---|
| Utilisateur | `User` / `auth` | `users` | compte (email, mot de passe), type candidat ou recruteur |
| Candidat | `Candidate` / `candidates` | `candidates` | profil mobile |
| Recruteur | `Recruiter` / `companies` | `recruiters` | rattaché à une entreprise |
| Entreprise | `Company` / `companies` | `companies` | SIRET unique |
| Offre d'emploi | `JobOffer` / `offers` | `job_offers` | |
| Compétence | `Skill` | `skills` | tags |
| Formation | `Education` / `candidates` | `educations` | parcours académique |
| Expérience | `Experience` / `candidates` | `experiences` | |
| Candidature | `Application` / `applications` | `applications` | créée par un swipe à droite |
| Message | `Message` / `messaging` | `messages` | débloqué au match |
| Conversation | `Conversation` / `messaging` | `conversations` | « salon de discussion » |
| Abonnement | `Subscription` / `subscriptions` | `subscriptions` | |
| Favori | `Favorite` | `favorites` | recruteur sauvegarde un candidat |

## Valeurs (enums)

| Français | Code |
|---|---|
| Stage / Alternance / CDD / CDI / Intérim / Job étudiant | `internship` / `apprenticeship` / `fixed_term` / `permanent` / `temporary` / `student_job` |
| Offre Active / Pourvue / Archivée | `active` / `filled` / `archived` |
| Candidature En cours / Validée (Match) / Refusée | `pending` / `matched` / `rejected` |
| Candidat Premium / Entreprise Pro mensuel / annuel | `candidate_premium` / `company_pro_monthly` / `company_pro_yearly` |

## Notions produit

| Français | Code |
|---|---|
| Swipe à droite (candidater) / à gauche (refuser) | `swipe_right` / `swipe_left` |
| Score de compatibilité | `compatibility_score` (0–100) |
| Match | `match` |
| File d'attente (recruteur) | `queue` |
| Profil vérifié | `is_verified` |
| Vidéo de présentation | `intro_video` |
| Lettre de motivation | `cover_letter` |

## Job Simulation

| Français | Code |
|---|---|
| Simulation / session de simulation | `simulation` / `simulation_session` |
| Scénario | `scenario` |
| Personnage (PNJ, collègue virtuel) | `character` (NPC) |
| Événement (déclenché par le temps ou une action) | `event` (`trigger`) |
| Branche | `branch` |
| Critère d'évaluation | `evaluation_criterion` |
| Journal d'actions | `event_log` |
| Rapport | `report` |
| Signal de triche | `integrity_signal` |
| Fournisseur LLM | `LLMProvider` |

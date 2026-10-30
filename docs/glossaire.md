# Glossaire FR ↔ EN

Le métier se dit en français (cahier des charges, issues, PR) ; le code et la base sont en anglais.
Ce tableau fait foi pour nommer tables, colonnes, routes, dossiers et composants.

> Le détail des tables et des colonnes est dans [`mcd.md`](mcd.md).

## Entités

| Français | Code (classe / domaine) | Table | Notes |
|---|---|---|---|
| Utilisateur | `User` / `auth` | `users` | compte (email, mot de passe), type candidat ou recruteur |
| Candidat | `Candidate` / `candidates` | `candidates` | profil mobile |
| Recruteur | `Recruiter` / `companies` | `recruiters` | rattaché à une entreprise |
| Entreprise | `Company` / `companies` | `companies` | SIRET unique |
| Offre d'emploi | `JobOffer` / `offers` | `job_offers` | |
| Compétence | `Skill` / `candidates` | `skills` | tags, référentiel partagé |
| Compétence d'un candidat | `CandidateSkill` / `candidates` | `candidate_skills` | association |
| Compétence requise | `OfferSkill` / `offers` | `offer_skills` | association |
| Formation | `Education` / `candidates` | `educations` | parcours académique |
| Expérience | `Experience` / `candidates` | `experiences` | |
| Langue d'un candidat | `CandidateLanguage` / `candidates` | `candidate_languages` | faits saillants |
| Swipe | `Swipe` / `applications` | `swipes` | une ligne par candidat et par offre |
| Compteur de swipes | `SwipeCounter` / `subscriptions` | `swipe_counters` | une ligne par candidat et par jour |
| Candidature | `Application` / `applications` | `applications` | créée par un swipe à droite |
| Message | `Message` / `messaging` | `messages` | débloqué au match |
| Conversation | `Conversation` / `messaging` | `conversations` | « salon de discussion » |
| Abonnement | `Subscription` / `subscriptions` | `subscriptions` | |
| Favori | `Favorite` / `companies` | `favorites` | recruteur sauvegarde un candidat pour une offre |

## Valeurs (enums)

| Français | Code |
|---|---|
| Stage / Alternance / CDD / CDI / Intérim / Job étudiant | `internship` / `apprenticeship` / `fixed_term` / `permanent` / `temporary` / `student_job` |
| Offre Active / Pourvue / Archivée | `active` / `filled` / `archived` |
| Candidature En cours / Validée (Match) / Refusée | `pending` / `matched` / `rejected` |
| Candidat / Recruteur (rôle du compte) | `candidate` / `recruiter` |
| Salaire horaire / mensuel / annuel | `hour` / `month` / `year` |
| Sans diplôme / Bac / Bac+2 / Bac+3 / Bac+5 / Bac+8 | `no_degree` / `bac` / `bac_2` / `bac_3` / `bac_5` / `bac_8` |
| Langue A1 à C2 / Langue maternelle | `a1` … `c2` / `native` |
| Swipe à gauche / à droite | `left` / `right` |
| Candidat Premium / Entreprise Pro mensuel / annuel | `candidate_premium` / `company_pro_monthly` / `company_pro_yearly` |
| Abonnement Actif / Impayé / Résilié / Expiré | `active` / `past_due` / `canceled` / `expired` |

## Notions produit

| Français | Code |
|---|---|
| Swipe à droite (candidater) / à gauche (refuser) | `direction = right` / `direction = left` |
| Score de compatibilité | `compatibility_score` (0–100) |
| Match | `match` |
| File d'attente (recruteur) | `queue` |
| Profil vérifié | `is_verified` |
| Vidéo de présentation | `intro_video` |
| Lettre de motivation | `cover_letter` |
| Pourquoi cette offre ? | `motivation` |
| À propos | `about` |
| Disponibilité | `available_from` |
| Niveau d'études | `education_level` |
| CV | `cv_key` (clé de stockage) |
| Compétences clés correspondantes / requises | `matched_skills_count` / `required_skills_count` |
| Limite de swipes gratuits | configuration de l'API (epic #12) |

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

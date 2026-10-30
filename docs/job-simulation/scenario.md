# Spécification du Scénario de Job Simulation (Format JSON)

Ce document décrit le contrat JSON versionné d'un scénario de Job Simulation. Ce contrat est partagé entre :
1. **L'éditeur de scénario** (SaaS recruteur `apps/web`) qui génère ce document JSON.
2. **Le runtime candidat** (`apps/web` et `apps/api`) qui instancie et pilote la session de simulation interactive via WebSocket.
3. **Le moteur d'analyse et d'évaluation** qui évalue le déroulement selon les critères définis.

---

## 1. Principes et conformité AI Act

Conformément à la réglementation européenne sur l'IA (AI Act) et aux règles strictes du projet Swape :
- **L'IA observe et résume, elle ne décide jamais** : aucun refus, classement ou élimination automatique n'est produit par le système. Le recruteur reste l'unique décideur.
- **Explicabilité totale critère par critère** : chaque critère d'évaluation (`evaluation_criteria`) est lié à des observations factuelles et à des preuves identifiables dans le journal d'actions (`event_log`).
- **Scénario déterministe et reproductible** : les personnages virtuels (PNJ) ont une personnalité, une mémoire et des objectifs précis, mais l'arborescence des événements et les branches restent explicitement cadrées.

---

## 2. Structure globale du format (`Scenario`)

Le scénario est un objet JSON contenant les champs obligatoires suivants :

| Champ | Type | Description |
|---|---|---|
| `schema_version` | `string` | Version du schéma (format SemVer, ex. `"1.0.0"`). |
| `id` | `string` | Identifiant unique du scénario (slug ou UUID). |
| `title` | `string` | Titre du scénario visible par le candidat et le recruteur. |
| `job_role` | `string` | Métier / poste simulé (ex. `"Customer Support Specialist"`). |
| `description` | `string` | Contexte et consignes initiales présentées au candidat. |
| `duration_minutes` | `integer` | Durée maximale allouée pour la simulation en minutes (ex. `15`). |
| `characters` | `Character[]` | Liste des collègues virtuels (PNJ) intervenant dans la simulation. |
| `initial_branch_id`| `string` | Identifiant de la première branche activée au démarrage. |
| `branches` | `Branch[]` | Arborescence des branches et transitions de la simulation. |
| `events` | `SimulationEvent[]` | Liste des événements planifiés ou déclenchés par les actions candidat. |
| `evaluation_criteria` | `EvaluationCriterion[]` | Critères d'évaluation explicables pour le débriefing et le scoring. |

---

## 3. Détail des composants

### 3.1. Personnages virtuels (`Character`)

Les personnages représentent les collègues, managers ou clients avec lesquels le candidat interagit.

```json
{
  "id": "npc_sarah",
  "name": "Sarah Chen",
  "role": "Lead Customer Success",
  "personality": "Bienveillante, directe, orientée satisfaction client rapide",
  "memory": "Se souvient de l'incident serveur d'hier et sait que le client Acme Corp est sensible",
  "hidden_objectives": "Vérifier si le candidat sait prioriser l'urgence sans paniquer"
}
```

- `id` : identifiant unique du personnage (référencé par les événements et messages).
- `name` : nom affiché dans l'interface multi-fenêtres.
- `role` : fonction du personnage dans l'entreprise fictive.
- `personality` : directives de ton et de style pour le guidage du LLM.
- `memory` : éléments de contexte métier connus de ce personnage.
- `hidden_objectives` : intentions non divulguées au candidat servant au jeu de rôle.

### 3.2. Déclencheurs et Événements (`SimulationEvent`)

Un événement survient soit sur base temporelle relative (`time`), soit en réaction directe à une action du candidat (`candidate_action`).

```json
{
  "id": "event_client_ticket",
  "branch_id": "branch_main",
  "trigger": {
    "type": "time",
    "at_second": 60
  },
  "window": "chat",
  "sender_id": "npc_sarah",
  "recipient_id": "candidate",
  "action": "send_message",
  "payload": {
    "message": "Salut ! Un ticket urgent vient d'arriver pour Acme Corp, peux-tu regarder ?"
  }
}
```

- `trigger.type` : `"time"` (déclenché à `at_second` secondes depuis le début de la branche) ou `"candidate_action"` (déclenché lorsque le candidat effectue une action spécifique telle que `task_completed` ou `reply_sent`).
- `window` : fenêtre de l'interface concernée (`"chat"`, `"email"`, `"task"`, `"file"`).
- `sender_id` : id d'un personnage déclaré ou `"system"`.
- `recipient_id` : id d'un personnage déclaré, `"candidate"`, ou `"all"`.

### 3.3. Branches et conditions (`Branch`)

Les branches permettent d'adapter le fil narratif selon les choix du candidat :

```json
{
  "id": "branch_main",
  "title": "Prise de poste et premier ticket",
  "description": "Le candidat découvre son environnement et traite la première urgence.",
  "fallback_branch_id": null
}
```

### 3.4. Critères d'évaluation explicables (`EvaluationCriterion`)

Chaque critère doit respecter l'exigence d'explicabilité :

```json
{
  "id": "crit_empathy",
  "name": "Empathie et posture client",
  "description": "Capacité à écouter, reformuler et rassurer un client mécontent.",
  "category": "soft_skills",
  "weight": 1.0,
  "required_observations": "Usage d'un ton chaleureux et absence de jargon défensif dans le chat client",
  "evidence_sources": ["window:chat", "action:message_sent"]
}
```

- `required_observations` : description factuelle de ce qui doit être recherché par l'IA d'analyse dans les faits observés.
- `evidence_sources` : filtre des événements du journal qui constituent la preuve objective.

---

## 4. Règles de validation sémantique

1. **Existence des personnages** : tout `sender_id` ou `recipient_id` dans un événement (hors `"system"`, `"candidate"`, `"all"`) doit correspondre à un `id` présent dans la liste `characters`.
2. **Cohérence des branches** :
   - `initial_branch_id` doit correspondre à une branche définie dans `branches`.
   - Tout `branch_id` dans un événement doit être déclaré dans `branches`.
   - Si une branche définit un `fallback_branch_id` ou une transition, la cible doit exister.
3. **Unicité des identifiants** : tous les `id` de personnages, événements, branches et critères doivent être uniques.
4. **Durée positive** : `duration_minutes` doit être un entier strictement positif (typiquement entre 5 et 60 minutes).

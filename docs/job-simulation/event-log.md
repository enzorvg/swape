# Spécification du Journal d'Événements (Event Log) de Job Simulation

Ce document spécifie le contrat JSON du journal d'événements produit lors de l'exécution d'une session de Job Simulation. Ce journal constitue la **source unique de vérité factuelle** utilisée pour l'analyse des compétences et la génération du rapport recruteur/candidat.

---

## 1. Principes et conformité AI Act & RGPD

1. **Traçabilité et auditabilité** : chaque interaction ou fait marquant survenu pendant la simulation est enregistré de manière chronologique avec un horodatage précis.
2. **Objectivité factuelle** : le journal ne contient aucune appréciation subjective ; uniquement des actions concrètes (messages envoyés, tâches complétées, fichiers consultés, signaux d'interface).
3. **Signaux d'intégrité non punitifs** : les signaux d'intégrité (perte de focus, copier-coller important, vitesse anormale) sont de simples **indices d'aide à la décision** remis au recruteur, conformément aux règles du projet. Ils ne déclenchent **jamais de sanction automatique**.
4. **RGPD** : aucune donnée personnelle tierce ne figure dans le journal. Seul le `session_id` et les pseudonymes ou rôles sont consignés.

---

## 2. Structure globale (`EventLog`)

Le journal complet d'une session est un objet JSON contenant :

| Champ | Type | Description |
|---|---|---|
| `schema_version` | `string` | Version du schéma du journal (ex. `"1.0.0"`). |
| `session_id` | `string` | Identifiant unique de la session de simulation. |
| `scenario_id` | `string` | Identifiant du scénario joué. |
| `candidate_id` | `string` | Identifiant anonymisé du candidat. |
| `started_at` | `string` (ISO 8601) | Date et heure de début de session (UTC). |
| `ended_at` | `string` (ISO 8601) | Date et heure de fin de session (UTC). |
| `entries` | `LogEntry[]` | Liste ordonnée de tous les événements survenus. |
| `integrity_signals` | `IntegritySignal[]` | Liste des indices d'intégrité observés durant la session. |

---

## 3. Détail des entrées du journal (`LogEntry`)

Chaque entrée représente une action unitaire au sein du runtime multi-fenêtres :

```json
{
  "id": "log_evt_101",
  "timestamp": "2026-10-30T10:02:15.120Z",
  "elapsed_seconds": 135.12,
  "branch_id": "branch_main",
  "actor_type": "candidate",
  "actor_id": "candidate",
  "window": "chat",
  "action": "send_message",
  "target_id": "npc_sarah",
  "content": {
    "text": "J'ai bien pris en compte le ticket Acme Corp et je viens de leur répondre en leur expliquant la situation."
  },
  "metadata": {
    "word_count": 20,
    "input_mode": "keyboard"
  }
}
```

### Typologie des champs :

- `actor_type` : `"candidate"` (le candidat), `"npc"` (un collègue virtuel), ou `"system"` (le moteur d'événements).
- `actor_id` : `"candidate"`, `"system"`, ou l'identifiant du personnage (`"npc_sarah"`).
- `window` : la fenêtre de travail concernée :
  - `"chat"` : messagerie instantanée d'équipe (type Slack/Teams).
  - `"email"` : client de messagerie électronique (tickets, clients, management).
  - `"task"` : tableau Kanban ou gestionnaire de tickets/tâches.
  - `"file"` : explorateur de fichiers, tableur, documents ou base de connaissances interne.
- `action` : verbe décrivant l'action (ex. `"send_message"`, `"open_file"`, `"update_task_status"`, `"send_email"`, `"search_doc"`).
- `target_id` : destinataire ou identifiant de l'élément cible (ex. ID du fichier ou du PNJ).
- `content` : objet JSON libre détaillant la charge utile (texte saisi, statut choisi, document ouvert).
- `metadata` : données techniques complémentaires (durée de saisie, nombre de mots, etc.).

---

## 4. Signaux d'intégrité (`IntegritySignal`)

Les signaux d'intégrité permettent au recruteur d'évaluer le contexte sans jugement algorithmique automatique :

```json
{
  "id": "sig_01",
  "type": "paste_burst",
  "timestamp": "2026-10-30T10:05:42.500Z",
  "elapsed_seconds": 342.5,
  "window": "email",
  "description": "Collage d'un bloc de texte de plus de 400 caractères en une seule saisie.",
  "metrics": {
    "character_count": 450,
    "source_hint": "external_clipboard"
  }
}
```

### Types de signaux courants :
- `window_blur` / `focus_lost` : le candidat a changé d'onglet ou minimisé la fenêtre du navigateur.
- `paste_burst` : collage massif de texte instantané dans un champ de réponse.
- `unusual_typing_speed` : vitesse de frappe anormale (détection d'automatisation).
- `devtools_opened` : ouverture des outils de développement web du navigateur.

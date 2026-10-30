"""Demo scenario for customer support job simulation.

Meets acceptance criteria:
- Customer support role (Support Client / Customer Support Specialist)
- 15 minutes duration
- 3 NPCs: Sarah (Team Lead), Alex (Product/DevOps), Marc (Client)
- 6 structured simulation events
- Explainable AI Act criteria
"""

from typing import Any

from app.simulation.schemas import Scenario


def get_demo_scenario_data() -> dict[str, Any]:
    """Returns the raw dictionary data of the customer support demo scenario."""
    return {
        "schema_version": "1.0.0",
        "id": "scenario_customer_support_demo",
        "title": "Gestion d'incident critique chez Acme Corp",
        "job_role": "Customer Support Specialist",
        "description": (
            "Vous prenez votre service au sein de l'équipe Support Client. "
            "Un client stratégique (Acme Corp) signale un blocage majeur sur ses exports. "
            "Votre mission : qualifier l'incident, coordonner la résolution avec les devs "
            "et apporter une réponse rassurante et professionnelle au client."
        ),
        "duration_minutes": 15,
        "characters": [
            {
                "id": "npc_sarah",
                "name": "Sarah Chen",
                "role": "Lead Customer Support",
                "personality": (
                    "Pédagogue, réactive, soucieuse du respect des SLA et du ton employé."
                ),
                "memory": (
                    "Sait que le compte Acme Corp est en période de renouvellement contractuel."
                ),
                "hidden_objectives": (
                    "Observer si le candidat remonte les alertes avec calme et clarté."
                ),
            },
            {
                "id": "npc_alex",
                "name": "Alex Rivera",
                "role": "Ingénieur Produit & DevOps",
                "personality": (
                    "Précis, direct, a besoin de données factuelles (logs, IDs) pour investiguer."
                ),
                "memory": (
                    "A déployé une mise à jour d'indexation la nuit passée sur la facturation."
                ),
                "hidden_objectives": (
                    "Tester la rigueur technique du candidat lors de la qualification du bug."
                ),
            },
            {
                "id": "npc_marc",
                "name": "Marc Dupont",
                "role": "Directeur Financier (Acme Corp)",
                "personality": (
                    "Stressé par la clôture mensuelle, exigeant mais sensible à l'écoute."
                ),
                "memory": (
                    "A déjà subi un retard le mois dernier et craint pour sa clôture comptable."
                ),
                "hidden_objectives": (
                    "Évaluer la capacité du candidat à désamorcer l'anxiété du client."
                ),
            },
        ],
        "initial_branch_id": "branch_triage",
        "branches": [
            {
                "id": "branch_triage",
                "title": "Qualification et prise en charge",
                "description": "Prise de contact avec l'équipe et réception de l'alerte client.",
                "fallback_branch_id": None,
            },
            {
                "id": "branch_resolution",
                "title": "Résolution technique et réponse client",
                "description": "Coordination avec l'ingénieur et envoi de la solution au client.",
                "fallback_branch_id": None,
            },
        ],
        "events": [
            {
                "id": "evt_01_welcome",
                "branch_id": "branch_triage",
                "trigger": {
                    "type": "time",
                    "at_second": 0,
                },
                "window": "chat",
                "sender_id": "npc_sarah",
                "recipient_id": "candidate",
                "action": "send_message",
                "payload": {
                    "text": (
                        "Bonjour et bienvenue dans l'équipe ! Installe-toi. "
                        "Je garde un œil sur la file d'attente, dis-moi dès que tu es prêt."
                    )
                },
                "next_branch_id": None,
            },
            {
                "id": "evt_02_client_email",
                "branch_id": "branch_triage",
                "trigger": {
                    "type": "time",
                    "at_second": 20,
                },
                "window": "email",
                "sender_id": "npc_marc",
                "recipient_id": "candidate",
                "action": "receive_email",
                "payload": {
                    "subject": "URGENT - Blocage exports comptables - Risque clôture",
                    "body": (
                        "Bonjour, depuis 9h ce matin aucun export PDF/CSV ne fonctionne. "
                        "Nous sommes en pleine clôture mensuelle avec nos commissaires "
                        "aux comptes. Merci d'intervenir immédiatement !"
                    ),
                    "ticket_id": "TCK-8921",
                },
                "next_branch_id": None,
            },
            {
                "id": "evt_03_task_creation",
                "branch_id": "branch_triage",
                "trigger": {
                    "type": "time",
                    "at_second": 45,
                },
                "window": "task",
                "sender_id": "system",
                "recipient_id": "candidate",
                "action": "create_task",
                "payload": {
                    "task_id": "task_acme_triage",
                    "title": "Qualifier l'erreur d'export TCK-8921",
                    "priority": "P0",
                },
                "next_branch_id": "branch_resolution",
            },
            {
                "id": "evt_04_sarah_coordination",
                "branch_id": "branch_resolution",
                "trigger": {
                    "type": "candidate_action",
                    "action_type": "task_started",
                },
                "window": "chat",
                "sender_id": "npc_sarah",
                "recipient_id": "candidate",
                "action": "send_message",
                "payload": {
                    "text": (
                        "J'ai vu passer l'email de Marc Dupont. Contacte Alex sur #dev-support "
                        "pour vérifier si la release d'hier n'a pas impacté le service d'export."
                    )
                },
                "next_branch_id": None,
            },
            {
                "id": "evt_05_alex_response",
                "branch_id": "branch_resolution",
                "trigger": {
                    "type": "candidate_action",
                    "action_type": "message_to_alex",
                },
                "window": "chat",
                "sender_id": "npc_alex",
                "recipient_id": "candidate",
                "action": "send_message",
                "payload": {
                    "text": (
                        "Bien vu ! C'était un souci de timeout sur le worker PDF. "
                        "Le patch vient d'être déployé et les exports reprennent. "
                        "Tu peux confirmer à Marc qu'il peut relancer son batch."
                    )
                },
                "next_branch_id": None,
            },
            {
                "id": "evt_06_debrief_request",
                "branch_id": "branch_resolution",
                "trigger": {
                    "type": "candidate_action",
                    "action_type": "email_sent_to_client",
                },
                "window": "chat",
                "sender_id": "npc_sarah",
                "recipient_id": "candidate",
                "action": "send_message",
                "payload": {
                    "text": (
                        "Super gestion ! Pense à consigner la résolution dans la base interne "
                        "avant la fin de ta session."
                    )
                },
                "next_branch_id": None,
            },
        ],
        "evaluation_criteria": [
            {
                "id": "crit_empathy_customer",
                "name": "Empathie et posture relationnelle",
                "description": (
                    "Capacité à accueillir l'anxiété du client avec calme et bienveillance."
                ),
                "category": "soft_skills",
                "weight": 1.5,
                "required_observations": (
                    "Le candidat reformule l'impact pour le client sans agressivité ni jargon, "
                    "présente des excuses et rassure sur le suivi."
                ),
                "evidence_sources": ["window:email", "action:send_email"],
            },
            {
                "id": "crit_prioritization_urgency",
                "name": "Gestion des priorités et réactivité",
                "description": (
                    "Capacité à identifier le caractère critique (P0) et à agir rapidement."
                ),
                "category": "problem_solving",
                "weight": 1.2,
                "required_observations": (
                    "Le candidat prend en charge le ticket rapidement et alerte les développeurs."
                ),
                "evidence_sources": [
                    "window:task",
                    "action:update_task",
                    "window:chat",
                    "action:send_message",
                ],
            },
            {
                "id": "crit_internal_communication",
                "name": "Clarté de la communication interne",
                "description": (
                    "Transmission synthétique et factuelle des informations aux collègues."
                ),
                "category": "communication",
                "weight": 1.0,
                "required_observations": (
                    "Le candidat fournit les détails clés (ID ticket, erreur) à l'équipe tech."
                ),
                "evidence_sources": ["window:chat", "recipient:npc_alex"],
            },
        ],
    }


def get_demo_scenario() -> Scenario:
    """Returns the validated demo Scenario instance."""
    return Scenario.model_validate(get_demo_scenario_data())

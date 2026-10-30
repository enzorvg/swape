"""Independent review tests for issue #18 (MCD documentation and glossary).

Validates acceptance criteria:
1. docs/mcd.md contains all 14 required entities with attributes, types, keys and constraints.
2. docs/mcd.md contains a Mermaid erDiagram with relations and cardinalities.
3. Freemium rule: free swipe limit and swipe counting are modeled.
4. GDPR: personal data is identified and cascade deletions are documented.
5. docs/glossaire.md contains FR <-> EN mappings for tables, enums and columns.
6. docs/architecture.md references mcd.md.
"""

from __future__ import annotations

from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[3]
_DOCS_DIR = _REPO_ROOT / "docs"


def _read(name: str) -> str:
    return (_DOCS_DIR / name).read_text(encoding="utf-8")


def test_mcd_contains_all_14_required_entities() -> None:
    content = _read("mcd.md")

    required_entities = [
        "users",
        "candidates",
        "recruiters",
        "companies",
        "job_offers",
        "skills",
        "educations",
        "experiences",
        "applications",
        "conversations",
        "messages",
        "subscriptions",
        "favorites",
        "swipe_counters",
    ]

    for entity in required_entities:
        assert f"`{entity}`" in content, f"Table `{entity}` is missing from docs/mcd.md"


def test_mcd_tables_have_attributes_types_keys_constraints_and_gdpr() -> None:
    content = _read("mcd.md")
    expected_header = "| Attribut | Type | Clé | Contraintes | Données perso |"
    assert content.count(expected_header) >= 14, (
        f"Expected at least 14 entity tables with header '{expected_header}'"
    )


def test_mcd_mermaid_er_diagram_presents_relationships() -> None:
    content = _read("mcd.md")

    assert "```mermaid" in content
    assert "erDiagram" in content

    required_relationships = [
        "users ||--o| candidates",
        "users ||--o| recruiters",
        "companies ||--o{ job_offers",
        "candidates ||--o{ applications",
        "job_offers ||--o{ applications",
        "applications ||--o| conversations",
        "conversations ||--o{ messages",
        "candidates ||--o{ swipes",
        "candidates ||--o{ swipe_counters",
        "candidates ||--o{ subscriptions",
        "companies ||--o{ subscriptions",
        "recruiters ||--o{ favorites",
    ]

    for rel in required_relationships:
        assert rel in content, f"Relationship '{rel}' missing from Mermaid erDiagram"


def test_freemium_rule_documented() -> None:
    content = _read("mcd.md")

    assert "## Règle freemium" in content
    assert "swipe_counters" in content
    assert "candidate_premium" in content
    # Check 10-swipe ad rule
    assert "10" in content
    assert "publicité" in content.lower()


def test_rgpd_data_and_cascades_documented() -> None:
    content = _read("mcd.md")

    assert "## RGPD" in content
    assert "Données perso" in content
    assert "Suppression en cascade" in content
    assert "ON DELETE CASCADE" in content
    assert "ON DELETE SET NULL" in content
    assert "ON DELETE RESTRICT" in content

    # Check that candidate, recruiter and company account deletion rules are described
    assert "Compte candidat" in content
    assert "Compte recruteur" in content
    assert "Entreprise" in content


def test_glossary_has_fr_en_mapping_for_entities_and_enums() -> None:
    content = _read("glossaire.md")

    assert "## Entités" in content
    assert "## Valeurs (enums)" in content
    assert "## Notions produit" in content

    expected_tables = [
        "users",
        "candidates",
        "recruiters",
        "companies",
        "job_offers",
        "skills",
        "educations",
        "experiences",
        "applications",
        "conversations",
        "messages",
        "subscriptions",
        "favorites",
        "swipe_counters",
    ]

    for table in expected_tables:
        assert f"`{table}`" in content, f"Table `{table}` missing from docs/glossaire.md"

    expected_enums = [
        "candidate_premium",
        "company_pro_monthly",
        "internship",
        "apprenticeship",
        "pending",
        "matched",
        "rejected",
    ]

    for enum_val in expected_enums:
        assert enum_val in content, f"Enum value `{enum_val}` missing from docs/glossaire.md"


def test_architecture_doc_links_to_mcd() -> None:
    content = _read("architecture.md")
    assert "mcd.md" in content

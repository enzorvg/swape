"""Independent review tests for issue #38 (reference mockups in docs/mockups)."""

from pathlib import Path

import pytest

_MOCKUPS = Path(__file__).resolve().parents[3] / "docs" / "mockups"
_STANDALONES = [
    "landing/landing-standalone.html",
    "mobile/candidate-standalone.html",
    "recruiter-web/standalone.html",
]
_SOURCE_DIRS = ["landing", "mobile", "recruiter-web"]


@pytest.mark.parametrize("relative_path", _STANDALONES)
def test_standalone_opens_without_a_build(relative_path: str) -> None:
    content = (_MOCKUPS / relative_path).read_text(encoding="utf-8")

    assert content.lstrip().lower().startswith("<!doctype html")


@pytest.mark.parametrize("directory", _SOURCE_DIRS)
def test_source_is_next_to_each_standalone(directory: str) -> None:
    folder = _MOCKUPS / directory

    assert list(folder.glob("*.jsx"))
    assert list(folder.glob("*.css"))


def test_readme_explains_how_to_open_and_lists_every_folder() -> None:
    readme = (_MOCKUPS / "README.md").read_text(encoding="utf-8")

    assert "Comment les ouvrir" in readme
    for directory in _SOURCE_DIRS:
        assert f"`{directory}/`" in readme


def test_readme_points_to_the_design_token_gap() -> None:
    readme = (_MOCKUPS / "README.md").read_text(encoding="utf-8")

    assert "packages/design-tokens" in readme


def test_mockups_are_not_imported_by_the_apps() -> None:
    root = _MOCKUPS.parents[1]
    sources = [
        path
        for app in ("apps/web/src", "apps/mobile/app", "apps/mobile/src")
        for path in (root / app).rglob("*.ts*")
    ]

    assert sources
    assert not [path for path in sources if "docs/mockups" in path.read_text(encoding="utf-8")]

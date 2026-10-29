"""Automatic discovery of domain routers and models.

Each domain is a package `app/<domain>/`. If it contains a `router.py` exposing
`router: APIRouter`, the router is mounted at startup. If it contains a `models.py`,
it is imported so its tables register on `Base.metadata` (used by Alembic).
Adding a domain therefore never requires editing `main.py`.
"""

import importlib
import pkgutil
from types import ModuleType

from fastapi import APIRouter

import app

_NON_DOMAIN_PACKAGES = {"core", "db"}


def _domain_names() -> list[str]:
    return sorted(
        info.name
        for info in pkgutil.iter_modules(app.__path__)
        if info.ispkg and info.name not in _NON_DOMAIN_PACKAGES
    )


def _import_optional(module_name: str) -> ModuleType | None:
    try:
        return importlib.import_module(module_name)
    except ModuleNotFoundError as exc:
        if exc.name == module_name:
            return None
        raise


def discover_routers() -> list[APIRouter]:
    routers: list[APIRouter] = []
    for domain in _domain_names():
        module = _import_optional(f"app.{domain}.router")
        if module is None:
            continue
        router = getattr(module, "router", None)
        if not isinstance(router, APIRouter):
            raise TypeError(f"app/{domain}/router.py must expose `router: APIRouter`")
        routers.append(router)
    return routers


def import_models() -> None:
    for domain in _domain_names():
        _import_optional(f"app.{domain}.models")

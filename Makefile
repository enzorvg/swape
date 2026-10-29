# Swape — uniform commands. Run `make help` for the list.
SHELL := /bin/bash
API := apps/api
UV := uv run --directory $(API)

.DEFAULT_GOAL := help
.PHONY: help setup dev dev-api dev-web dev-mobile test test-api test-js lint lint-api lint-js \
        fmt fmt-api fmt-js db-up db-down db-migrate db-revision db-reset api-types api-types-check

help: ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

setup: ## Install everything (uv, pnpm, pre-commit hooks, .env, databases)
	@test -f .env || (cp .env.example .env && echo "Created .env from .env.example")
	cd $(API) && uv sync
	corepack enable && pnpm install
	uv tool install pre-commit >/dev/null 2>&1 || true
	pre-commit install
	$(MAKE) db-up db-migrate

dev: db-up ## Run API (:8000) and web (:5173) together; mobile runs separately (make dev-mobile)
	@trap 'kill 0' EXIT; $(MAKE) dev-api & $(MAKE) dev-web & wait

dev-api: ## Run the API with auto-reload on :8000
	$(UV) uvicorn app.main:app --reload --port 8000

dev-web: ## Run the recruiter web app + landing on :5173
	pnpm --filter @swape/web dev

dev-mobile: ## Run the Expo dev server (scan the QR code with Expo Go)
	pnpm --filter @swape/mobile start

test: test-api test-js ## Run every test suite

test-api: db-up ## API tests (pytest + coverage, real PostgreSQL test database)
	$(UV) pytest --cov

test-js: ## Web, mobile and packages tests
	pnpm -r run test

lint: lint-api lint-js ## Lint + typecheck everything (no changes)

lint-api: ## ruff + mypy strict
	$(UV) ruff check .
	$(UV) ruff format --check .
	$(UV) mypy

lint-js: ## ESLint + tsc + prettier check
	pnpm -r --parallel run lint
	pnpm -r --parallel run typecheck
	pnpm fmt:check

fmt: fmt-api fmt-js ## Format and autofix everything

fmt-api:
	$(UV) ruff check --fix .
	$(UV) ruff format .

fmt-js:
	pnpm fmt

db-up: ## Start PostgreSQL (dev :5434, test :5435)
	docker compose up -d --wait db db-test

db-down: ## Stop the databases (dev data is kept in a volume)
	docker compose down

db-migrate: db-up ## Apply Alembic migrations to the dev database
	$(UV) alembic upgrade head

db-revision: ## Create a migration: make db-revision m="add offers table"
	@test -n "$(m)" || (echo 'Usage: make db-revision m="message"' && exit 1)
	$(UV) alembic revision --autogenerate -m "$(m)"

db-reset: ## Drop and recreate the dev database, then migrate
	docker compose down -v db
	$(MAKE) db-migrate

api-types: ## Regenerate packages/api-client from the API's OpenAPI schema
	$(UV) python -m scripts.export_openapi > packages/api-client/openapi.json
	pnpm --filter @swape/api-client generate

api-types-check: api-types ## Fail if the generated API client is not up to date (used by CI)
	@git diff --exit-code -- packages/api-client || \
	  (echo "packages/api-client is out of date: run 'make api-types' and commit the result." && exit 1)

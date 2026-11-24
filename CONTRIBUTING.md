# Contributing

Thanks for helping improve Discord Price Tracker. Please keep contributions focused, preserve existing bot and dashboard behavior, and raise a discussion before undertaking a large or breaking change.

## Project structure

- `app/api/` contains the FastAPI application and HTTP routers.
- `app/bot/` contains the Discord client, commands, permissions, and events.
- `app/services/` contains application and business logic.
- `app/repositories/` contains database access; keep business rules in services.
- `app/models/` and `app/db/` contain SQLAlchemy models, sessions, and Alembic migrations.
- `app/scraper/` contains extraction, validation, and retailer adapters.
- `app/workers/` contains Celery setup, scheduling, and task entry points.
- `app/config/`, `app/observability/`, and `app/utils/` hold shared configuration and infrastructure helpers.
- `dashboard/app/`, `dashboard/components/`, and `dashboard/lib/` contain the Next.js routes, UI components, and client utilities.
- `tests/unit/` and `tests/integration/` contain isolated and database-backed Python tests.
- `docker/`, the Compose files, and `.github/workflows/` contain deployment and CI configuration.

Place new code beside the closest existing responsibility. Prefer a small, cohesive module over a large file with unrelated responsibilities, but do not split code into wrappers or abstractions that make its behavior harder to follow.

## Branches and commits

The shared development branch is `dev`; `main` is reserved for stable releases. Start new work from an up-to-date `dev` branch and open a pull request back to `dev`. Release changes are promoted from `dev` to `main`.

Use descriptive, lowercase kebab-case branch names with a type prefix:

- `feature/retailer-adapter`
- `fix/duplicate-alert`
- `docs/local-setup`
- `refactor/scrape-validation`

Write commits using Conventional Commit-style messages in the imperative, for example `fix(alerts): avoid duplicate notifications`. Common types include `feat`, `fix`, `docs`, `refactor`, `test`, and `chore`. Keep each commit focused and avoid bundling generated files or unrelated formatting changes.

## Code and dependencies

- Preserve existing command, API, scraping, notification, and dashboard behavior unless the change explicitly requires otherwise.
- Keep modules cohesive, names descriptive, and control flow easy to follow. Extract shared logic when it removes real duplication; avoid speculative abstractions.
- Add comments only for non-obvious decisions or behavior, and keep them brief.
- Avoid new runtime dependencies when the existing stack can solve the problem. Explain and justify any dependency added to a pull request.
- Update relevant tests and documentation alongside behavior changes. Do not edit generated files by hand.

## Setup and validation

Python development and test dependencies are declared in `pyproject.toml`:

```powershell
pip install -e ".[dev,api,bot,workers]"
ruff check .
ruff format --check .
mypy app
pytest
```

Unit tests do not require a database. Integration tests require `DATABASE_URL` to point to a clean PostgreSQL database; the CI workflow provisions one.

For dashboard changes:

```powershell
cd dashboard
npm ci
npm run lint
npm run typecheck
npm run build
```

Run the relevant checks before requesting review. A pull request should pass the repository CI checks; if a check cannot be run locally, note why and include the available validation results.

## Issues and pull requests

Use GitHub Issues to report reproducible bugs or propose features. Include the affected command, route, or workflow; steps to reproduce; expected and actual behavior; and relevant logs with secrets and personal data removed. For feature proposals, describe the user need and intended behavior before implementation.

Open pull requests against `dev` with a clear summary, motivation, and testing notes. Link related issues, call out migrations or configuration changes, and include screenshots for visible dashboard changes. Keep the diff focused, respond constructively to review feedback, and resolve outstanding review comments before merging. Reviewers should prioritize correctness, regressions, security, and maintainability, and explain requested changes with actionable context.

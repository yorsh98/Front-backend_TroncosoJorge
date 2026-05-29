# AGENTS.md

## Repository Shape
- Work from `proviemplea-evaluacion/`; it is the evaluation monorepo root.
- `backend-api/` is the Laravel API only; it runs in Docker behind Nginx on `http://localhost:8088`.
- `frontend-web/` is a separate Laravel React Starter Kit app; it runs locally, not in Docker, on `http://127.0.0.1:8000`.
- `docker/` and `docker-compose.yml` are backend infrastructure only; do not try to dockerize the frontend.
- `docs/17-qa-final-entrega.md` is the latest verified QA/packaging record.

## Non-Negotiable Project Constraints
- Do not add Redis; queues/cache use database/file-backed defaults.
- Backend auth is Sanctum Bearer Token API auth under `/api/v1`; frontend auth screens intentionally call the backend API, not the starter kit's local auth POSTs.
- CV files must remain private; do not expose storage files publicly or commit/upload real CVs.
- Companies must only see blind CV data, never direct personal contact data.
- Default AI mode is `regex`; Ollama/OpenAI are optional and must not be required for professor review.
- `OPENAI_API_KEY` belongs only in `.env`, never in DB, docs, seeders, or committed files.

## Backend Commands
- Initial backend setup from monorepo root: `bash scripts/setup-backend.sh`.
- Start backend services: `bash scripts/start-backend.sh`.
- Migrate, seed, regenerate Swagger, and start workers: `bash scripts/backend-migrate-seed.sh`.
- Run backend tests: `docker compose exec app php artisan test`.
- Regenerate OpenAPI manually: `docker compose exec app php artisan l5-swagger:generate`.
- Clear login/register throttling during repeated demos: `docker compose exec app php artisan cache:clear`.

## Frontend Commands
- Work in `frontend-web/` for frontend commands.
- Install/build checks: `composer install`, `npm install`, `npm run build`, `npm run format:check`, `php artisan route:list`.
- Dev servers are separate commands: `php artisan serve` and `npm run dev`.
- Do not run `npm audit fix` casually; starter-kit transitive advisories may cause broad dependency churn.

## Verification Shortcuts
- Backend health: `curl http://localhost:8088/api/health`, `/api/health/db`, `/api/health/storage`, `/api/health/queue`, `/api/health/ai`.
- API docs: Swagger UI `http://localhost:8088/api/documentation`; OpenAPI JSON `http://localhost:8088/docs`.
- Frontend routes to smoke manually: `/`, `/login`, `/register`, `/persona`, `/empresa`, `/admin`.
- Demo users: `admin@proviemplea.local` / `password`; `persona.demo@proviemplea.local` / `password123`; `contacto.empresa.demo@proviemplea.local` / `password123`.

## Entrypoints And Boundaries
- Backend route wiring is in `backend-api/routes/api.php`; core API controllers are under `backend-api/app/Http/Controllers/Api/`.
- Main backend domain schema is `backend-api/database/migrations/2026_05_28_160348_create_proviemplea_domain_tables.php`.
- CV/AI logic lives in `backend-api/app/Services/Cv/`, `backend-api/app/Services/Ai/`, and `backend-api/app/Jobs/AnalyzeCvJob.php`.
- Frontend API calls are centralized in `frontend-web/resources/js/services/`; prefer extending these services over direct fetch calls in pages.
- Frontend role pages are `resources/js/pages/persona/dashboard.tsx`, `empresa/dashboard.tsx`, and `admin/dashboard.tsx`.
- Shared frontend layouts are `resources/js/layouts/public-layout.tsx` and `role-layout.tsx`; accessibility widget is `resources/js/components/accessibility-widget.tsx`.

## Packaging
- Final ZIP command from monorepo root: `bash scripts/build-zip.sh`.
- The ZIP should include `.env.example` files but exclude `.env`, `.git`, `vendor/`, `node_modules/`, logs, private storage, caches, and local SQLite files.
- Expected artifact name: `ProviEmplea_2026_Evaluacion.zip`.

## Gotchas
- `frontend-web/.env` is local-only; keep committed config changes in `.env.example` and docs.
- Frontend stores Bearer Token in `localStorage` only for academic demo; do not present it as production-hardening.
- Backend export CSV endpoints require Bearer auth; the current frontend has visual/documentary access, not a production download proxy.
- `public/build/` may exist from validation builds; do not treat generated assets as source of truth.

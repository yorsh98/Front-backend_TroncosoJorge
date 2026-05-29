# QA Final Y Entrega

## Estado General

Sprint final de validacion ejecutado correctamente para backend, frontend y ZIP de evaluacion.

## Backend Validado

Comandos/endpoints ejecutados:

```bash
curl http://localhost:8088/api/health
curl http://localhost:8088/api/health/db
curl http://localhost:8088/api/health/storage
curl http://localhost:8088/api/health/queue
curl http://localhost:8088/api/health/ai
curl http://localhost:8088/docs
docker compose exec app php artisan test
```

Resultado:

- Health general: HTTP `200`.
- Health DB: HTTP `200`.
- Health storage: HTTP `200`.
- Health queue: HTTP `200`.
- Health IA: HTTP `200`.
- OpenAPI JSON: HTTP `200`.
- Tests backend: `2 passed`.

Smoke API con superadmin:

- `POST /api/v1/auth/login`: OK.
- `GET /api/v1/auth/me`: HTTP `200`.
- `GET /api/v1/admin/dashboard`: HTTP `200`.

## Frontend Validado

Comandos ejecutados:

```bash
cd frontend-web
npm run build
php artisan route:list
npm run format:check
```

Resultado:

- Build Vite: correcto.
- Rutas frontend: disponibles.
- Formato Prettier: correcto.

Rutas principales:

- `/`: landing publica.
- `/login`: login API.
- `/register`: registro persona/empresa.
- `/persona`: panel persona.
- `/empresa`: panel empresa.
- `/admin`: panel administracion.

## ZIP Final

Comando ejecutado:

```bash
bash scripts/build-zip.sh
```

Archivo generado:

- `ProviEmplea_2026_Evaluacion.zip`.
- Tamano observado: `629K`.

Validacion ZIP:

- No incluye `.git`.
- No incluye `.env`.
- Si incluye `backend-api/.env.example`.
- Si incluye `frontend-web/.env.example`.
- Excluye `vendor/`, `node_modules/`, logs, caches, storage privado y SQLite local.

## Credenciales Demo

- Superadmin: `admin@proviemplea.local` / `password`.
- Persona: `persona.demo@proviemplea.local` / `password123`.
- Empresa: `contacto.empresa.demo@proviemplea.local` / `password123`.

## Checklist Para Profesor

- Levantar backend con `bash scripts/start-backend.sh`.
- Ejecutar migraciones/seeders con `bash scripts/backend-migrate-seed.sh` si corresponde.
- Revisar Swagger en `http://localhost:8088/api/documentation`.
- Revisar health en `http://localhost:8088/api/health`.
- Levantar frontend desde `frontend-web` con `php artisan serve` y `npm run dev`.
- Probar login por los tres roles.
- Revisar widget de accesibilidad.
- Revisar CV ciego: empresa no debe ver datos personales directos.
- Revisar modo IA por defecto: `regex`.

## Observaciones Conocidas

- El frontend guarda Bearer Token en `localStorage` solo para demo academica. En produccion se debe evaluar una estrategia mas robusta.
- Export CSV en backend requiere Bearer Token. En la UI queda acceso visual/documental; para descarga directa real conviene proxy frontend o signed URL.
- El frontend conserva rutas/controladores auth locales del starter kit, pero las pantallas principales consumen el backend API.

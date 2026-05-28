# ProviEmplea 2026 API

Backend Laravel API para ProviEmplea 2026.

## Stack

- Laravel API.
- MySQL.
- Laravel Sanctum en sprints posteriores.
- Queue con driver `database`.
- Docker para backend.
- LibreOffice instalado en contenedor app para conversion/extraccion DOC/DOCX.
- Regex como modo de analisis CV por defecto.

## Docker

Desde la raiz del monorepo:

```bash
bash scripts/setup-backend.sh
bash scripts/start-backend.sh
bash scripts/backend-migrate-seed.sh
```

## Health Checks

- `GET http://localhost:8088/api/health`
- `GET http://localhost:8088/api/health/db`
- `GET http://localhost:8088/api/health/storage`
- `GET http://localhost:8088/api/health/queue`
- `GET http://localhost:8088/api/health/ai`

## Variables Clave

- `DB_CONNECTION=mysql`
- `DB_HOST=mysql`
- `QUEUE_CONNECTION=database`
- `FILESYSTEM_DISK=private`
- `CV_ANALYSIS_MODE=regex`
- `AI_PROVIDER=none`

El proyecto no define servicio de cache externo. La cola usa base de datos.

# Swagger Y Health Checks

## Swagger

La API se documentara con Swagger/OpenAPI en:

- `http://localhost:8088/api/documentation`

Debe incluir autenticacion Bearer Token, ejemplos de request/response y rutas de auth, health, persona, empresa, admin, IA, CV y reportes.

## Health Checks

Rutas requeridas:

- `GET /api/health`
- `GET /api/health/db`
- `GET /api/health/storage`
- `GET /api/health/queue`
- `GET /api/health/ai`

`GET /api/health` debe responder:

```json
{
  "status": "ok",
  "app": "ProviEmplea 2026 API",
  "timestamp": "...",
  "version": "1.0.0"
}
```

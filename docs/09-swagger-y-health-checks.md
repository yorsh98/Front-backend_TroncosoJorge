# Swagger Y Health Checks

## Swagger

La API se documenta con L5-Swagger/OpenAPI en:

- `http://localhost:8088/api/documentation`

JSON OpenAPI generado:

- `http://localhost:8088/docs`

Debe incluir autenticacion Bearer Token, ejemplos de request/response y rutas de auth, health, persona, empresa, admin, IA, CV y reportes.

## Generar Documentacion

```bash
cd proviemplea-evaluacion
docker compose exec app php artisan l5-swagger:generate
```

Los scripts `setup-backend.sh` y `backend-migrate-seed.sh` ejecutan la generacion para que Swagger quede disponible durante la revision.

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

`GET /api/health/ai` lee la configuracion persistida en `system_settings` y expone:

- `mode`
- `provider`
- `failover_to_regex`
- `openai_api_key_configured`
- `external_connection_required`

Por defecto debe responder `mode=regex` y `provider=none`.

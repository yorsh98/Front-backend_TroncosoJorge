# ProviEmplea 2026 API

Backend Laravel API para ProviEmplea 2026.

## Stack

- Laravel API.
- MySQL.
- Laravel Sanctum para Bearer Tokens.
- Spatie Laravel Permission para roles y permisos.
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

## Swagger/OpenAPI

- Swagger UI: `http://localhost:8088/api/documentation`
- OpenAPI JSON: `http://localhost:8088/docs`

Regenerar documentacion:

```bash
php artisan l5-swagger:generate
```

La especificacion fuente esta en `app/OpenApi/ProviEmpleaOpenApi.php`.

## Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/register/persona`
- `POST /api/v1/auth/register/empresa`

Credencial superadmin:

- Email: `admin@proviemplea.local`
- Password: `password`

Ejemplo:

```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@proviemplea.local","password":"password"}'
```

## Modelo De Datos Sprint 3

El backend incluye migraciones y modelos para:

- Perfiles persona y datos de contacto privados.
- Educacion, experiencia, certificaciones, skills, idiomas y condiciones deseadas.
- Perfiles empresa y usuarios asociados.
- CV subidos, analisis de CV y CV ciego.
- Solicitudes de contacto, historial y procesos de seleccion.
- Configuracion del sistema y auditoria.

Los seeders crean datos ficticios de demo y dejan el analisis IA por defecto en `regex`.

## Configuracion IA

Endpoints superadmin:

- `GET /api/v1/admin/settings/ai`
- `PUT /api/v1/admin/settings/ai`
- `POST /api/v1/admin/settings/ai/test-connection`

Reglas:

- `regex` usa proveedor `none`.
- `local` usa proveedor `ollama`.
- `cloud` usa proveedor `openai`.
- `hybrid` usa `ollama` u `openai` con fallback regex activo.

El modo por defecto para evaluacion es `regex`.

## Analisis De CV

Endpoints persona:

- `POST /api/v1/persona/cv/upload`
- `GET /api/v1/persona/cv/uploads`
- `GET /api/v1/persona/cv/analysis/{id}`
- `POST /api/v1/persona/cv/analysis/{id}/apply-to-profile`

Requisitos:

- Bearer Token de usuario con rol `persona`.
- Campo `consent_accepted=1`.
- Archivo en campo `cv` con extension `pdf`, `docx` o `doc`.

El analisis corre en `AnalyzeCvJob` con database queue. Por defecto usa regex.

## Perfil Persona

Endpoints:

- `GET /api/v1/persona/profile`
- `PUT /api/v1/persona/profile`
- `GET /api/v1/persona/profile/completion`
- `GET /api/v1/persona/educations`
- `POST /api/v1/persona/educations`
- `PUT /api/v1/persona/educations/{id}`
- `DELETE /api/v1/persona/educations/{id}`
- `GET /api/v1/persona/experiences`
- `POST /api/v1/persona/experiences`
- `PUT /api/v1/persona/experiences/{id}`
- `DELETE /api/v1/persona/experiences/{id}`
- `GET /api/v1/persona/skills`
- `POST /api/v1/persona/skills`
- `DELETE /api/v1/persona/skills/{id}`
- `GET /api/v1/persona/blind-cv/preview`
- `POST /api/v1/persona/request-validation`

Todos requieren Bearer Token de rol `persona`.

## Empresa Y Vitrina De Talentos

Endpoints:

- `GET /api/v1/empresa/profile`
- `PUT /api/v1/empresa/profile`
- `GET /api/v1/empresa/talentos`
- `GET /api/v1/empresa/talentos/{blindCvCode}`
- `POST /api/v1/empresa/talentos/{blindCvCode}/request-contact`
- `GET /api/v1/empresa/contact-requests`

Todos requieren Bearer Token de rol `empresa`.

La vitrina consume solo CV ciego y nunca expone datos personales de la persona ni el archivo CV real.

## Administracion

Endpoints admin:

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/personas`
- `GET /api/v1/admin/personas/{id}`
- `PUT /api/v1/admin/personas/{id}/status`
- `GET /api/v1/admin/empresas`
- `GET /api/v1/admin/empresas/{id}`
- `PUT /api/v1/admin/empresas/{id}/status`
- `GET /api/v1/admin/contact-requests`
- `GET /api/v1/admin/contact-requests/{id}`
- `PUT /api/v1/admin/contact-requests/{id}/status`
- `POST /api/v1/admin/contact-requests/{id}/notes`
- `GET /api/v1/admin/reports/summary`
- `GET /api/v1/admin/reports/export`

Requieren Bearer Token de `superadmin` o `admin_empleo` y permisos correspondientes.

## Variables Clave

- `DB_CONNECTION=mysql`
- `DB_HOST=mysql`
- `QUEUE_CONNECTION=database`
- `FILESYSTEM_DISK=private`
- `CV_ANALYSIS_MODE=regex`
- `AI_PROVIDER=none`

El proyecto no define servicio de cache externo. La cola usa base de datos.

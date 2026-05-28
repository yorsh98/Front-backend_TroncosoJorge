# Contrato API

La API sera REST, versionada y autenticada con Bearer Token para rutas protegidas.

Base local esperada:

- `http://localhost:8088/api`
- Version: `/v1`

## Rutas Publicas

- `GET /api/health`
- `GET /api/health/db`
- `GET /api/health/storage`
- `GET /api/health/queue`
- `GET /api/health/ai`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register/persona`
- `POST /api/v1/auth/register/empresa`

## Rutas Protegidas

Todas usan:

```http
Authorization: Bearer {token}
```

Grupos principales:

- Auth: logout y usuario autenticado.
- Persona: perfil, educacion, experiencia, skills, CV, CV ciego y solicitud de validacion.
- Empresa: perfil, vitrina de talentos, detalle CV ciego y solicitudes de contacto.
- Admin: dashboard, personas, empresas, solicitudes, reportes y auditoria.
- Superadmin: configuracion de IA.

La documentacion interactiva se publicara en Swagger en `/api/documentation`.

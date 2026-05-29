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

### Login

Request:

```json
{
  "email": "admin@proviemplea.local",
  "password": "password"
}
```

Response:

```json
{
  "token_type": "Bearer",
  "access_token": "...",
  "user": {
    "id": 1,
    "name": "Super Administrador",
    "email": "admin@proviemplea.local",
    "roles": ["superadmin"],
    "permissions": []
  }
}
```

### Registro Persona/Empresa

Request:

```json
{
  "name": "Persona Demo",
  "email": "persona.demo@proviemplea.local",
  "password": "password123",
  "password_confirmation": "password123"
}
```

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

## Auth Protegido

- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

Sin token valido, la API responde `401 Unauthenticated`.

## Persona Sprint 6

Rutas protegidas con Bearer Token y rol `persona`:

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

## Empresa Sprint 7

Rutas protegidas con Bearer Token y rol `empresa`:

- `GET /api/v1/empresa/profile`
- `PUT /api/v1/empresa/profile`
- `GET /api/v1/empresa/talentos`
- `GET /api/v1/empresa/talentos/{blindCvCode}`
- `POST /api/v1/empresa/talentos/{blindCvCode}/request-contact`
- `GET /api/v1/empresa/contact-requests`

Filtros soportados en `GET /api/v1/empresa/talentos`:

- `education`
- `career`
- `skill`
- `language`
- `modality`
- `schedule`
- `availability`
- `disability=true`

La respuesta de talentos solo incluye datos de CV ciego. No incluye nombre, RUT, correo, telefono, direccion exacta, edad, genero ni CV real.

## Admin Sprint 8

Rutas protegidas con Bearer Token y rol `superadmin` o `admin_empleo`:

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
- `GET /api/v1/admin/reports/export?type=talentos|empresas|solicitudes`

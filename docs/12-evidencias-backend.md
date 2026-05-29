# Evidencias Backend

Este documento mapeara evidencias tecnicas para evaluacion backend:

- Auth con Bearer Token.
- Roles y permisos.
- API REST versionada.
- Swagger/OpenAPI.
- Health checks.
- MySQL.
- Docker backend.
- Queue por database.
- Parser CV regex.
- IA opcional con Ollama/OpenAI.
- Storage privado.
- Seguridad y policies.
- Auditoria.
- Reportes y exportacion.

Durante los sprints se agregaran comandos, capturas sugeridas y endpoints especificos.

## Sprint 2

Evidencias implementadas:

- Laravel Sanctum instalado.
- Spatie Laravel Permission instalado.
- `User` usa `HasApiTokens` y `HasRoles`.
- Seeder `RolesAndPermissionsSeeder` crea roles y permisos base.
- Seeder `SuperAdminSeeder` crea `admin@proviemplea.local` con password `password`.
- `POST /api/v1/auth/login` devuelve Bearer Token.
- `GET /api/v1/auth/me` requiere token.
- `POST /api/v1/auth/logout` revoca el token actual.
- `POST /api/v1/auth/register/persona` crea usuario con rol `persona`.
- `POST /api/v1/auth/register/empresa` crea usuario con rol `empresa`.
- Login y registro tienen rate limiting basico.

Comando de prueba principal:

```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@proviemplea.local","password":"password"}'
```

## Sprint 3

Evidencias implementadas:

- Migracion consolidada del dominio principal.
- Modelos Eloquent y relaciones para persona, empresa, CV, CV ciego, solicitudes, procesos, settings y auditoria.
- Separacion entre datos personales privados y CV ciego visible para empresas.
- Estados base para perfiles, empresas y solicitudes.
- Seeders demo ficticios sin datos reales.
- Configuracion inicial `cv_analysis_mode=regex` en `system_settings`.

Conteos verificados en demo:

- `person_profiles`: 2
- `company_profiles`: 2
- `blind_cv_profiles`: 2
- `contact_requests`: 1
- `system_settings`: 6

## Sprint 4

Evidencias implementadas:

- Servicio `App\Services\Settings\SystemSettingsService`.
- Controlador `Api\V1\Admin\AiSettingsController`.
- `GET /api/v1/admin/settings/ai` protegido por Bearer Token, rol `superadmin` y permiso `manage-ai-settings`.
- `PUT /api/v1/admin/settings/ai` valida combinaciones permitidas de modo/proveedor.
- `POST /api/v1/admin/settings/ai/test-connection` prueba regex, Ollama u OpenAI segun configuracion.
- `GET /api/health/ai` lee desde `system_settings`.
- `OPENAI_API_KEY` no se guarda en base de datos.
- Configuracion final verificada en modo `regex`.

## Sprint 5

Evidencias implementadas:

- Endpoints persona de CV:
- `POST /api/v1/persona/cv/upload`
- `GET /api/v1/persona/cv/uploads`
- `GET /api/v1/persona/cv/analysis/{id}`
- `POST /api/v1/persona/cv/analysis/{id}/apply-to-profile`
- `AnalyzeCvJob` usando database queue y cola `cv-analysis`.
- Storage privado para CV.
- Validacion de extensiones `pdf`, `docx`, `doc` y maximo 15 MB.
- Extraccion PDF con `pdftotext`.
- Extraccion DOCX por XML interno con fallback LibreOffice.
- Conversion DOC con LibreOffice.
- Regex parser por defecto.
- Proveedores opcionales Ollama/OpenAI con fallback regex.
- Aplicacion al perfil solo por confirmacion del usuario.
- Reconstruccion de CV ciego tras aplicar datos.

Prueba realizada con DOCX demo ficticio:

- Upload respondio `201`.
- Worker proceso `AnalyzeCvJob` correctamente.
- Upload quedo `status=analyzed`.
- Resultado `source=regex`.
- `apply-to-profile` actualizo `applied_at`.

## Sprint 6

Evidencias implementadas:

- API persona para ver/editar perfil laboral.
- Calculo de porcentaje de completitud.
- CRUD de educacion.
- CRUD de experiencia laboral.
- CRUD basico de competencias.
- Preview de CV ciego con `BlindCvBuilder`.
- Solicitud de validacion cambia estado a `pending_validation`.
- Validacion de propiedad: cada endpoint opera sobre el perfil del usuario autenticado.
- `php artisan test` ejecutado correctamente.

Endpoints principales verificados:

- `GET /api/v1/persona/profile`
- `PUT /api/v1/persona/profile`
- `POST /api/v1/persona/educations`
- `POST /api/v1/persona/experiences`
- `GET /api/v1/persona/profile/completion`
- `GET /api/v1/persona/blind-cv/preview`
- `POST /api/v1/persona/request-validation`

## Sprint 7

Evidencias implementadas:

- API empresa para ver/editar perfil.
- Vitrina de talentos basada exclusivamente en `blind_cv_profiles`.
- Filtros por educacion, carrera, competencia, idioma, modalidad, jornada, disponibilidad y discapacidad con consentimiento.
- Detalle por `blind_cv_code`.
- Solicitud de contacto intermediada por Departamento de Empleo.
- Historial de solicitudes por empresa.
- Restriccion: empresa solo ve talentos publicados, validados y visibles.
- Restriccion: la respuesta nunca incluye datos personales ni CV real.

Endpoints verificados:

- `GET /api/v1/empresa/profile`
- `GET /api/v1/empresa/talentos?skill=excel`
- `GET /api/v1/empresa/talentos/BCV-TAL-2026-0001`
- `POST /api/v1/empresa/talentos/BCV-TAL-2026-0001/request-contact`
- `GET /api/v1/empresa/contact-requests`

## Sprint 8

Evidencias implementadas:

- Dashboard administrativo con metricas principales.
- Gestion de personas y cambio de estado.
- Gestion de empresas y cambio de estado.
- Gestion de solicitudes de contacto y cambio de estado.
- Historial de estados de solicitudes.
- Notas internas asociadas a proceso de seleccion.
- Auditoria basica en `audit_logs` para cambios de estado.
- Reporte resumen administrativo.
- Export CSV basico para talentos, empresas y solicitudes.

Endpoints verificados:

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/personas`
- `PUT /api/v1/admin/personas/3/status`
- `PUT /api/v1/admin/contact-requests/1/status`
- `POST /api/v1/admin/contact-requests/1/notes`
- `GET /api/v1/admin/reports/summary`
- `GET /api/v1/admin/reports/export?type=talentos`

## Sprint 9

Evidencias implementadas:

- Instalado `darkaonline/l5-swagger`.
- Configurado titulo `ProviEmplea 2026 API`.
- Creada especificacion OpenAPI centralizada en `app/OpenApi/ProviEmpleaOpenApi.php`.
- Swagger UI disponible en `http://localhost:8088/api/documentation`.
- JSON OpenAPI disponible en `http://localhost:8088/docs`.
- Bearer Token documentado como `bearerAuth`.
- Rutas documentadas por grupos: Health, Auth, Persona, Empresa, Admin e IA.
- Scripts backend generan Swagger automaticamente.

Verificacion realizada:

- `php artisan l5-swagger:generate`: correcto.
- `GET /api/documentation`: HTTP 200.
- `GET /docs`: HTTP 200.
- `php artisan test`: correcto.

# Guia Profesor Backend

## Objetivo De Revision

Validar que el backend Laravel API funcione con Docker, MySQL, Sanctum, Swagger, health checks, colas por base de datos, analisis de CV por regex y reglas de privacidad.

## Comandos Esperados

```bash
cd proviemplea-evaluacion
bash scripts/setup-backend.sh
bash scripts/start-backend.sh
bash scripts/backend-migrate-seed.sh
```

## URLs

- Health: `http://localhost:8088/api/health`
- Swagger: `http://localhost:8088/api/documentation`
- OpenAPI JSON: `http://localhost:8088/docs`
- Mailpit: puerto definido en `docker-compose.yml`.

## Swagger/OpenAPI

La documentacion se genera con L5-Swagger:

```bash
docker compose exec app php artisan l5-swagger:generate
```

La interfaz permite ingresar el token desde el boton `Authorize` usando el esquema Bearer configurado.

## Credencial Superadmin

- Email: `admin@proviemplea.local`
- Password: `password`

## Autenticacion Bearer Token

Login:

```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@proviemplea.local","password":"password"}'
```

Usuario autenticado:

```bash
curl http://localhost:8088/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN_AQUI"
```

Logout:

```bash
curl -X POST http://localhost:8088/api/v1/auth/logout \
  -H "Authorization: Bearer TOKEN_AQUI"
```

Registro persona:

```bash
curl -X POST http://localhost:8088/api/v1/auth/register/persona \
  -H "Content-Type: application/json" \
  -d '{"name":"Persona Demo","email":"persona.demo@proviemplea.local","password":"password123","password_confirmation":"password123"}'
```

Registro empresa:

```bash
curl -X POST http://localhost:8088/api/v1/auth/register/empresa \
  -H "Content-Type: application/json" \
  -d '{"name":"Empresa Demo","email":"empresa.demo@proviemplea.local","password":"password123","password_confirmation":"password123"}'
```

## Roles Y Permisos

Roles creados por seeder:

- `superadmin`
- `admin_empleo`
- `persona`
- `empresa`

Permisos iniciales:

- `manage-system-settings`
- `manage-users`
- `manage-person-profiles`
- `manage-company-profiles`
- `validate-talents`
- `validate-companies`
- `view-blind-cvs`
- `request-contact`
- `manage-contact-requests`
- `view-reports`
- `export-reports`
- `manage-ai-settings`

## Configuracion IA Superadmin

Obtener configuracion actual:

```bash
curl http://localhost:8088/api/v1/admin/settings/ai \
  -H "Authorization: Bearer TOKEN_AQUI"
```

Dejar modo regex por defecto:

```bash
curl -X PUT http://localhost:8088/api/v1/admin/settings/ai \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"cv_analysis_mode":"regex","ai_provider":"none","ai_failover_to_regex":true,"ollama_base_url":"http://host.docker.internal:11434","ollama_model":"gemma4:e4b","openai_model":"gpt-4.1-mini"}'
```

Probar conexion:

```bash
curl -X POST http://localhost:8088/api/v1/admin/settings/ai/test-connection \
  -H "Authorization: Bearer TOKEN_AQUI"
```

El entorno del profesor no requiere Ollama ni OpenAI. La configuracion debe permanecer en `regex` salvo que se quiera probar integracion opcional.

## Probar Analisis CV Regex

Login persona demo:

```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"persona.demo@proviemplea.local","password":"password123"}'
```

Subir CV con consentimiento:

```bash
curl -X POST http://localhost:8088/api/v1/persona/cv/upload \
  -H "Authorization: Bearer TOKEN_PERSONA" \
  -F "consent_accepted=1" \
  -F "cv=@/ruta/local/cv-demo.docx"
```

Ver uploads:

```bash
curl http://localhost:8088/api/v1/persona/cv/uploads \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

Ver analisis:

```bash
curl http://localhost:8088/api/v1/persona/cv/analysis/ID_ANALISIS \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

Aplicar al perfil:

```bash
curl -X POST http://localhost:8088/api/v1/persona/cv/analysis/ID_ANALISIS/apply-to-profile \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

## Probar Perfil Persona Y CV Ciego

Ver perfil:

```bash
curl http://localhost:8088/api/v1/persona/profile \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

Ver completitud:

```bash
curl http://localhost:8088/api/v1/persona/profile/completion \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

Preview CV ciego:

```bash
curl http://localhost:8088/api/v1/persona/blind-cv/preview \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

Solicitar validacion:

```bash
curl -X POST http://localhost:8088/api/v1/persona/request-validation \
  -H "Authorization: Bearer TOKEN_PERSONA"
```

## Probar Empresa Y Vitrina De Talentos

Login empresa demo:

```bash
curl -X POST http://localhost:8088/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"contacto.empresa.demo@proviemplea.local","password":"password123"}'
```

Ver perfil empresa:

```bash
curl http://localhost:8088/api/v1/empresa/profile \
  -H "Authorization: Bearer TOKEN_EMPRESA"
```

Listar talentos por competencia:

```bash
curl "http://localhost:8088/api/v1/empresa/talentos?skill=excel" \
  -H "Authorization: Bearer TOKEN_EMPRESA"
```

Detalle CV ciego:

```bash
curl http://localhost:8088/api/v1/empresa/talentos/BCV-TAL-2026-0001 \
  -H "Authorization: Bearer TOKEN_EMPRESA"
```

Solicitar contacto intermediado:

```bash
curl -X POST http://localhost:8088/api/v1/empresa/talentos/BCV-TAL-2026-0001/request-contact \
  -H "Authorization: Bearer TOKEN_EMPRESA" \
  -H "Content-Type: application/json" \
  -d '{"position_offered":"Asistente Administrativo","message":"Solicitud de contacto intermediado."}'
```

Historial de solicitudes:

```bash
curl http://localhost:8088/api/v1/empresa/contact-requests \
  -H "Authorization: Bearer TOKEN_EMPRESA"
```

## Probar Administracion Departamento De Empleo

Usar token superadmin o admin empleo.

Dashboard:

```bash
curl http://localhost:8088/api/v1/admin/dashboard \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

Listar personas:

```bash
curl http://localhost:8088/api/v1/admin/personas \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

Validar talento:

```bash
curl -X PUT http://localhost:8088/api/v1/admin/personas/ID/status \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"status":"visible","note":"Validado para vitrina"}'
```

Cambiar estado solicitud:

```bash
curl -X PUT http://localhost:8088/api/v1/admin/contact-requests/ID/status \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"status":"under_review","note":"En revision"}'
```

Reporte resumen:

```bash
curl http://localhost:8088/api/v1/admin/reports/summary \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

Export CSV basico:

```bash
curl -OJ "http://localhost:8088/api/v1/admin/reports/export?type=talentos" \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

## Aspectos A Revisar

- No existe Redis en configuracion del proyecto.
- `QUEUE_CONNECTION=database`.
- MySQL usa base `proviemplea`.
- Seeder crea roles, permisos y superusuario.
- Endpoints protegidos usan Bearer Token.
- CV se almacena en storage privado.
- Empresas solo ven CV ciego.
- Modo IA por defecto: regex.
- Ollama/OpenAI son opcionales.

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
- Mailpit: puerto definido en `docker-compose.yml`.

## Credencial Superadmin

- Email: `admin@proviemplea.local`
- Password: `password`

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

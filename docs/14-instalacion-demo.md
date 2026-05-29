# Instalacion Demo

## Backend

```bash
cd proviemplea-evaluacion
bash scripts/setup-backend.sh
bash scripts/start-backend.sh
bash scripts/backend-migrate-seed.sh
```

## Frontend

```bash
cd proviemplea-evaluacion/frontend-web
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run dev
php artisan serve
```

## URLs

- Backend API: `http://localhost:8088/api/health`
- Swagger: `http://localhost:8088/api/documentation`
- Frontend: `http://127.0.0.1:8000`

## Credencial Demo

- Email: `admin@proviemplea.local`
- Password: `password`

## Credenciales Por Rol

- Superadmin: `admin@proviemplea.local` / `password`.
- Persona: `persona.demo@proviemplea.local` / `password123`.
- Empresa: `contacto.empresa.demo@proviemplea.local` / `password123`.

## Validacion Rapida

Backend:

```bash
curl http://localhost:8088/api/health
curl http://localhost:8088/docs
docker compose exec app php artisan test
```

Frontend:

```bash
cd proviemplea-evaluacion/frontend-web
npm run build
npm run format:check
php artisan route:list
```

ZIP:

```bash
cd proviemplea-evaluacion
bash scripts/build-zip.sh
```

Debe generar `ProviEmplea_2026_Evaluacion.zip` sin `.env`, sin `.git`, sin `vendor/`, sin `node_modules/` y sin storage privado.

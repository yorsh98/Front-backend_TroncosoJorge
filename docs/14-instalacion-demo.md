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

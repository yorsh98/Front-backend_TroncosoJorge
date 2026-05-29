# ProviEmplea 2026

Plataforma web academica/profesional para el Departamento de Empleo de la Municipalidad de Providencia. Su objetivo es modernizar la intermediacion laboral tradicional hacia un modelo de busqueda inversa: empresas validadas buscan talentos locales disponibles mediante CV ciegos y solicitan contacto a traves del Departamento de Empleo.

## Problema Que Resuelve

Los procesos tradicionales de empleo municipal suelen depender de inscripciones manuales, revision operativa de antecedentes, derivaciones poco trazables y contacto directo con datos personales. ProviEmplea 2026 digitaliza y ordena estos procesos:

- Inscripcion de personas y empresas.
- Perfilamiento laboral.
- Orientacion y derivacion laboral.
- Generacion de CV ciego.
- Solicitudes de contacto intermediadas.
- Seguimiento administrativo.
- Reportes y exportacion.

## Arquitectura General

El proyecto se organiza como monorepo de evaluacion:

```text
proviemplea-evaluacion/
├── backend-api/
├── frontend-web/
├── docker/
├── scripts/
├── docs/
└── README_GENERAL.md
```

La arquitectura separa responsabilidades:

- `backend-api`: API REST Laravel versionada bajo `/api/v1`, autenticacion Bearer Token con Sanctum, MySQL, colas por base de datos, Swagger/OpenAPI, health checks, analisis de CV y reglas de privacidad.
- `frontend-web`: Laravel React Starter Kit con React, TypeScript, Inertia, Tailwind CSS y Vite. Se ejecuta localmente con `php artisan serve` y `npm run dev`.
- `frontend-web/resources/js/services`: servicios TypeScript para consumir la API backend con Bearer Token.
- `docker`: infraestructura del backend con PHP-FPM, Nginx, MySQL, Mailpit, worker, scheduler y LibreOffice.
- `scripts`: automatizacion de setup, arranque, migraciones, seeders y ZIP final.
- `docs`: documentacion tecnica, funcional y de evaluacion para profesores.

## Tecnologias

- Backend: Laravel API ultima version estable, Laravel Sanctum, MySQL, database queue, Swagger/OpenAPI.
- Frontend: Laravel React Starter Kit, React, TypeScript, Inertia, Tailwind CSS, Vite.
- Infraestructura: Docker solo para backend, Nginx, PHP-FPM, MySQL, Mailpit, LibreOffice.
- IA: regex por defecto, Ollama local opcional en `http://host.docker.internal:11434`, OpenAI opcional.
- Seguridad: storage privado, CV ciego, consentimiento, policies, form requests, auditoria, rate limiting.

## Ejecucion Esperada

Backend:

```bash
cd proviemplea-evaluacion
bash scripts/setup-backend.sh
bash scripts/start-backend.sh
bash scripts/backend-migrate-seed.sh
```

Frontend:

```bash
cd frontend-web
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run dev
php artisan serve
```

URLs esperadas:

- Backend API: `http://localhost:8088/api/health`
- Swagger: `http://localhost:8088/api/documentation`
- Frontend: `http://127.0.0.1:8000`
- Frontend rutas Sprint 11: `/`, `/login`, `/register`, `/persona`, `/empresa`, `/admin`
- Panel persona Sprint 12: `/persona` con perfil, completitud, carga CV, analisis, CV ciego y solicitud de validacion.
- Panel empresa Sprint 13: `/empresa` con perfil empresa, vitrina de talentos, detalle CV ciego y solicitud de contacto intermediada.
- Panel admin Sprint 14: `/admin` con metricas, talentos, empresas, solicitudes, notas, reportes e IA.
- Sprint 15: navegacion transversal, widget de accesibilidad, manejo comun de errores API y guia demo frontend.

Credencial inicial:

- Email: `admin@proviemplea.local`
- Password: `password`

Modo IA por defecto: `regex`.

Variables frontend principales:

- `BACKEND_API_URL=http://localhost:8088/api`
- `BACKEND_API_VERSION=v1`
- `VITE_BACKEND_API_URL=${BACKEND_API_URL}`
- `VITE_BACKEND_API_VERSION=${BACKEND_API_VERSION}`

## Revision Profesor Backend

El profesor de backend debe revisar:

- Docker backend sin Redis.
- MySQL y migraciones.
- Seeders, incluido superusuario.
- API versionada y autenticada con Bearer Token.
- Swagger/OpenAPI.
- Health checks.
- Analisis de CV por regex por defecto.
- Configuracion opcional de Ollama/OpenAI.
- Storage privado y CV ciego.
- Auditoria, policies, rate limiting y validaciones.

Guia detallada: `docs/03-guia-profesor-backend.md`.

## Revision Profesor Frontend

El profesor de frontend debe revisar:

- Laravel React Starter Kit.
- React, TypeScript, Inertia, Tailwind CSS y Vite.
- Landing publica, login y registros.
- Login y registro consumiendo backend API con Bearer Token.
- Panel persona con modal de consentimiento y CV ciego.
- Panel empresa con vitrina de talentos.
- Panel admin/superadmin con configuracion IA.
- Accesibilidad universal y widget propio.
- Consumo de API con Bearer Token.

Guia detallada: `docs/04-guia-profesor-frontend.md`.

QA final y entrega: `docs/17-qa-final-entrega.md`.

## Separacion En Repositorios Propios

El monorepo de evaluacion puede separarse asi:

- Repositorio `proviemplea-backend`: copiar `backend-api/`, `docker/`, scripts backend necesarios y documentacion backend.
- Repositorio `proviemplea-frontend`: copiar `frontend-web/` y documentacion frontend.
- Repositorio `proviemplea-evaluacion`: mantener la estructura completa para entrega academica.

Al separar repositorios, mantener `.env.example`, README propio, instrucciones de instalacion y no versionar `.env`, `vendor/`, `node_modules/`, CV reales ni archivos sensibles.

## ZIP Final De Evaluacion

El ZIP se genera con:

```bash
bash scripts/build-zip.sh
```

Debe crear `ProviEmplea_2026_Evaluacion.zip` excluyendo dependencias, logs, `.env`, archivos temporales, CV reales y datos personales sensibles.

El script `scripts/build-zip.sh` fue validado y conserva `.env.example` para instalacion demo.

## Checklist Final

- Backend Docker levanta.
- MySQL responde.
- Migraciones corren.
- Seeder crea superadmin.
- Swagger visible.
- Health visible.
- Frontend levanta con artisan.
- Login funciona.
- Modo regex activo por defecto.
- Modal proteccion de datos aparece.
- CV PDF/DOCX/DOC aceptado.
- CV ciego visible.
- Empresa no ve datos personales.
- Superadmin puede cambiar IA.
- Documentacion lista.


## Credenciales

- Admin: admin@proviemplea.local / password
- Persona: persona.demo@proviemplea.local / password123
- Empresa: contacto.empresa.demo@proviemplea.local / password123

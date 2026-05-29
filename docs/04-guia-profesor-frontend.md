# Guia Profesor Frontend

## Objetivo De Revision

Validar el frontend Laravel React Starter Kit con React, TypeScript, Inertia, Tailwind CSS, Vite, consumo API, accesibilidad, landing publica y paneles por rol.

## Estado Sprint 10

El proyecto frontend fue creado en `frontend-web/` usando Laravel React Starter Kit. En esta etapa se dejo configurada la base tecnica para consumir el backend API sin Docker y sin Redis.

Componentes tecnicos disponibles:

- `.env.example` orientado a ProviEmplea 2026.
- `BACKEND_API_URL=http://localhost:8088/api`.
- `BACKEND_API_VERSION=v1`.
- Variables Vite para consumo desde React.
- Servicios TypeScript para API, auth, persona, empresa, admin, CV y settings IA.
- Layout publico base.
- Layout base por rol para persona, empresa, admin y superadmin.
- Build Vite verificado con `npm run build`.

Nota de seguridad: el token Bearer se guarda temporalmente en `localStorage` solo para demo academica. En produccion debe evaluarse una estrategia mas robusta segun el modelo final de despliegue.

## Estado Sprint 11

Se implemento la primera capa visual publica e institucional del frontend y se conectaron login/registro al backend API.

Componentes visibles disponibles:

- Landing publica ProviEmplea 2026 en `/`.
- Hero institucional con foco en talento local, privacidad y CV ciego.
- Secciones de beneficios, flujo de uso y preparacion para evaluacion.
- Login visual en `/login` conectado a `POST /api/v1/auth/login`.
- Registro visual en `/register` con selector `persona` / `empresa`.
- Redireccion post-login/post-registro a panel placeholder segun rol.
- Rutas placeholder iniciales `/persona`, `/empresa` y `/admin`.

El auth local del starter kit sigue existiendo a nivel servidor, pero las pantallas principales de login y registro ahora consumen la API backend con los servicios TypeScript creados en Sprint 10.

## Estado Sprint 12

Se implemento el primer panel funcional para personas en `/persona`, consumiendo endpoints protegidos del backend con Bearer Token.

Componentes disponibles:

- Dashboard persona en `resources/js/pages/persona/dashboard.tsx`.
- Carga inicial de perfil, completitud, uploads CV y preview CV ciego.
- Formulario de perfil laboral con resumen, cargo actual, anos de experiencia, comuna, telefono privado y condiciones deseadas.
- Agregado rapido de competencias/habilidades.
- Carga de CV con consentimiento obligatorio.
- Listado de CV cargados y acceso al analisis disponible.
- Accion para aplicar analisis CV al perfil.
- Preview JSON de CV ciego.
- Solicitud de validacion del perfil.
- Logout API desde panel persona.

Endpoints frontend usados:

- `GET /api/v1/persona/profile`.
- `PUT /api/v1/persona/profile`.
- `GET /api/v1/persona/profile/completion`.
- `POST /api/v1/persona/skills`.
- `POST /api/v1/persona/cv/upload`.
- `GET /api/v1/persona/cv/uploads`.
- `GET /api/v1/persona/cv/analysis/{id}`.
- `POST /api/v1/persona/cv/analysis/{id}/apply-to-profile`.
- `GET /api/v1/persona/blind-cv/preview`.
- `POST /api/v1/persona/request-validation`.

## Estado Sprint 13

Se implemento el primer panel funcional para empresas en `/empresa`, consumiendo endpoints protegidos del backend con Bearer Token.

Componentes disponibles:

- Dashboard empresa en `resources/js/pages/empresa/dashboard.tsx`.
- Carga inicial de perfil empresa y solicitudes enviadas.
- Formulario editable de empresa con razon social, RUT, rubro, tamano, comuna, direccion, email y telefono de contacto.
- Vitrina de talentos publicados con CV ciego.
- Filtros por habilidad, modalidad, jornada, disponibilidad y Ley 21.015.
- Detalle de CV ciego sin datos personales directos.
- Solicitud de contacto intermediada al Departamento de Empleo.
- Historial simple de solicitudes enviadas por la empresa.
- Logout API desde panel empresa.

Endpoints frontend usados:

- `GET /api/v1/empresa/profile`.
- `PUT /api/v1/empresa/profile`.
- `GET /api/v1/empresa/talentos`.
- `GET /api/v1/empresa/talentos/{blindCvCode}`.
- `POST /api/v1/empresa/talentos/{blindCvCode}/request-contact`.
- `GET /api/v1/empresa/contact-requests`.

## Estado Sprint 14

Se implemento el primer panel funcional para administracion en `/admin`, consumiendo endpoints protegidos del backend con Bearer Token y rol `superadmin` / `admin_empleo`.

Componentes disponibles:

- Dashboard admin en `resources/js/pages/admin/dashboard.tsx`.
- Metricas operativas desde `/admin/dashboard`.
- Listado paginado inicial de talentos/personas.
- Cambio de estado de talentos con nota de auditoria.
- Listado paginado inicial de empresas.
- Cambio de estado de empresas con nota de auditoria.
- Listado de solicitudes de contacto.
- Cambio de estado de solicitudes.
- Agregado de nota interna a solicitud.
- Resumen de reportes.
- Accesos visuales a exportaciones CSV.
- Configuracion IA superadmin/admin con modo, proveedor, fallback y modelos.
- Prueba de conexion IA.
- Logout API desde panel admin.

Endpoints frontend usados:

- `GET /api/v1/admin/dashboard`.
- `GET /api/v1/admin/personas`.
- `PUT /api/v1/admin/personas/{id}/status`.
- `GET /api/v1/admin/empresas`.
- `PUT /api/v1/admin/empresas/{id}/status`.
- `GET /api/v1/admin/contact-requests`.
- `PUT /api/v1/admin/contact-requests/{id}/status`.
- `POST /api/v1/admin/contact-requests/{id}/notes`.
- `GET /api/v1/admin/reports/summary`.
- `GET /api/v1/admin/settings/ai`.
- `PUT /api/v1/admin/settings/ai`.
- `POST /api/v1/admin/settings/ai/test-connection`.

## Estado Sprint 15

Se realizo pulido transversal de experiencia frontend para facilitar la revision docente y mejorar accesibilidad.

Componentes disponibles:

- Widget propio de accesibilidad en `resources/js/components/accessibility-widget.tsx`.
- Aumentar texto.
- Disminuir texto.
- Alto contraste.
- Reset visual.
- Preferencias guardadas en `localStorage`.
- Link "Saltar al contenido" en layout publico y layouts por rol.
- Navegacion transversal entre `/`, `/persona`, `/empresa` y `/admin`.
- Manejo comun de errores API en `apiErrorMessage`.
- Limpieza automatica de token local ante respuesta `401`.
- Mensajes amigables para `401`, `403`, `422` y backend no disponible.

Flujo demo recomendado para profesor:

- Iniciar backend y frontend.
- Entrar a `/login` como `persona.demo@proviemplea.local` / `password123`.
- Revisar `/persona`: perfil, skills, CV, analisis, CV ciego y solicitud de validacion.
- Entrar como `admin@proviemplea.local` / `password`.
- Revisar `/admin`: metricas, validar talento, activar empresa, gestionar solicitud e IA.
- Entrar como `contacto.empresa.demo@proviemplea.local` / `password123`.
- Revisar `/empresa`: perfil empresa, vitrina, CV ciego y solicitud de contacto.
- Volver a `/admin` y gestionar la solicitud.

## Comandos Esperados

```bash
cd proviemplea-evaluacion/frontend-web
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run dev
php artisan serve
```

Para validar build de produccion:

```bash
npm run build
```

## URLs

- Frontend: `http://127.0.0.1:8000`
- Backend consumido: `http://localhost:8088/api`

## Archivos Relevantes Sprint 10

- `resources/js/services/apiClient.ts`: cliente HTTP con Bearer Token, errores API y FormData.
- `resources/js/services/authService.ts`: login, logout, usuario actual y registros.
- `resources/js/services/personService.ts`: perfil persona, educacion, experiencia, skills, preview CV ciego y solicitud de validacion.
- `resources/js/services/companyService.ts`: perfil empresa, vitrina de talentos y solicitudes de contacto.
- `resources/js/services/adminService.ts`: dashboard, personas, empresas, solicitudes y reportes.
- `resources/js/services/cvService.ts`: carga CV con consentimiento, analisis y aplicacion al perfil.
- `resources/js/services/settingsService.ts`: configuracion IA superadmin.
- `resources/js/layouts/public-layout.tsx`: layout publico inicial.
- `resources/js/layouts/role-layout.tsx`: layout base para paneles por rol.
- `resources/js/pages/welcome.tsx`: landing publica institucional Sprint 11.
- `resources/js/pages/auth/login.tsx`: login conectado al backend API.
- `resources/js/pages/auth/register.tsx`: registro persona/empresa conectado al backend API.
- `resources/js/pages/role-placeholder.tsx`: pantalla temporal de acceso por rol para continuar con paneles.
- `resources/js/pages/persona/dashboard.tsx`: panel persona funcional Sprint 12.
- `resources/js/pages/empresa/dashboard.tsx`: panel empresa funcional Sprint 13.
- `resources/js/pages/admin/dashboard.tsx`: panel admin funcional Sprint 14.
- `resources/js/components/accessibility-widget.tsx`: widget propio de accesibilidad Sprint 15.
- `resources/js/services/apiClient.ts`: manejo comun de errores API y limpieza de token 401.
- `routes/web.php`: rutas publicas `/persona`, `/empresa` y `/admin` para placeholders de panel.

## Flujos A Revisar

- Landing publica institucional.
- Registro persona.
- Registro empresa.
- Login con API backend.
- Panel persona y carga de CV con consentimiento.
- Resultado de analisis y aplicacion manual al perfil.
- Preview de CV ciego.
- Vitrina de talentos para empresa.
- Solicitud de contacto intermediada.
- Panel admin y configuracion IA superadmin.
- Widget de accesibilidad.

## Restricciones Verificadas

- El frontend no usa Docker.
- No se configuro Redis.
- El consumo del backend queda apuntando a `/api/v1` mediante variables de entorno.
- El build de assets finaliza correctamente con Vite.
- Login backend probado contra `admin@proviemplea.local` con respuesta HTTP `200`.
- Endpoints persona principales probados con `persona.demo@proviemplea.local` y respuesta HTTP `200`.
- Endpoints empresa principales probados con `contacto.empresa.demo@proviemplea.local` y respuesta HTTP `200`.
- Endpoints admin principales, reportes e IA probados con `admin@proviemplea.local` y respuesta HTTP `200`.

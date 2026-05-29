# Evidencias Frontend

Este documento mapeara evidencias tecnicas para evaluacion frontend:

- React.
- TypeScript.
- Inertia.
- Tailwind CSS.
- Componentes reutilizables.
- Formularios.
- Dashboards por rol.
- Accesibilidad.
- Modal de consentimiento.
- Vitrina de talentos.
- CV ciego.
- Consumo API con Bearer Token.

Durante los sprints se agregaran rutas, pantallas y pruebas sugeridas.

## Sprint 10 - Base Frontend

Evidencias implementadas:

- Proyecto creado con Laravel React Starter Kit en `frontend-web/`.
- React, TypeScript, Inertia, Tailwind CSS y Vite disponibles desde el starter kit.
- `.env.example` configurado para ProviEmplea 2026.
- `.env` local alineado con la configuracion de demo y sin Redis.
- Variables API disponibles para Vite:
  - `VITE_BACKEND_API_URL`.
  - `VITE_BACKEND_API_VERSION`.
- Cliente API centralizado en `resources/js/services/apiClient.ts`.
- Servicios por dominio:
  - `authService.ts`.
  - `personService.ts`.
  - `companyService.ts`.
  - `adminService.ts`.
  - `cvService.ts`.
  - `settingsService.ts`.
- Layout publico inicial en `resources/js/layouts/public-layout.tsx`.
- Layout por rol inicial en `resources/js/layouts/role-layout.tsx`.

Validacion ejecutada:

```bash
cd proviemplea-evaluacion/frontend-web
npm install
npm run build
php artisan route:list
```

Resultado:

- `npm install`: dependencias instaladas correctamente.
- `npm run build`: build Vite completado correctamente.
- `php artisan route:list`: rutas base del starter kit disponibles, incluyendo home, login, register, dashboard y settings.

Observacion:

- `npm install` reporto vulnerabilidades en dependencias transitivas del starter kit. No se ejecuto `npm audit fix` para evitar cambios mayores fuera del alcance del sprint.

## Sprint 11 - Landing Y Auth API

Evidencias implementadas:

- Landing publica reemplazada en `resources/js/pages/welcome.tsx`.
- Layout publico reutilizado desde `resources/js/layouts/public-layout.tsx`.
- Login en `resources/js/pages/auth/login.tsx` conectado al backend con `authService.login`.
- Registro en `resources/js/pages/auth/register.tsx` conectado a:
  - `authService.registerPersona`.
  - `authService.registerEmpresa`.
- Registro permite seleccionar tipo de cuenta `persona` o `empresa`.
- `authService` ahora guarda token y usuario tambien tras registro exitoso.
- Rutas placeholder por rol agregadas en `routes/web.php`:
  - `/persona`.
  - `/empresa`.
  - `/admin`.
- Pantalla temporal `resources/js/pages/role-placeholder.tsx` muestra usuario autenticado desde `localStorage`.
- Se limpio duplicado menor de `CACHE_STORE` en `.env`.

Validacion ejecutada:

```bash
cd proviemplea-evaluacion/frontend-web
npm run build
php artisan route:list
curl -s -o /tmp/opencode/proviemplea_login_response.json -w "%{http_code}" -X POST "http://localhost:8088/api/v1/auth/login" -H "Accept: application/json" -H "Content-Type: application/json" -d '{"email":"admin@proviemplea.local","password":"password"}'
```

Resultado:

- `npm run build`: build Vite completado correctamente.
- `php artisan route:list`: rutas `/persona`, `/empresa` y `/admin` disponibles.
- Login API backend con superadmin demo: HTTP `200`.

Observacion:

- `npm run format:check` aun reporta formato pendiente en `resources/js/components/app-header.tsx`, archivo del starter kit no modificado en Sprint 11. Los archivos modificados por este sprint fueron formateados con Prettier.

## Sprint 12 - Panel Persona

Evidencias implementadas:

- Ruta `/persona` ahora renderiza `resources/js/pages/persona/dashboard.tsx`.
- Panel persona usa `RoleLayout` y token Bearer guardado en Sprint 11.
- Si no existe token local, redirige a `/login`.
- Carga datos iniciales desde API:
  - Perfil persona.
  - Completitud.
  - Uploads CV.
  - Preview CV ciego.
- Formulario de perfil laboral conectado a `personService.updateProfile`.
- Agregado de competencias conectado a `personService.createSkill`.
- Carga de CV conectada a `cvService.upload` con checkbox de consentimiento obligatorio.
- Listado de uploads conectado a `cvService.uploads`.
- Visualizacion de analisis conectada a `cvService.analysis`.
- Boton aplicar analisis conectado a `cvService.applyToProfile`.
- Boton solicitar validacion conectado a `personService.requestValidation`.
- Logout conectado a `authService.logout`.

Validacion ejecutada:

```bash
cd proviemplea-evaluacion/frontend-web
npm run build
php artisan route:list
```

Validacion API backend con persona demo:

```bash
POST http://localhost:8088/api/v1/auth/login
GET http://localhost:8088/api/v1/persona/profile
GET http://localhost:8088/api/v1/persona/profile/completion
GET http://localhost:8088/api/v1/persona/cv/uploads
GET http://localhost:8088/api/v1/persona/blind-cv/preview
```

Resultado:

- `npm run build`: build Vite completado correctamente.
- `php artisan route:list`: ruta `/persona` disponible.
- Endpoints persona principales: HTTP `200` con `persona.demo@proviemplea.local`.
- CORS preflight desde `http://127.0.0.1:8000` hacia backend: HTTP `204` con `Access-Control-Allow-Origin: *`.

Observacion:

- `npm run format:check` sigue reportando solo `resources/js/components/app-header.tsx`, archivo del starter kit no modificado. Los archivos modificados por Sprint 12 fueron formateados con Prettier.

## Sprint 13 - Panel Empresa

Evidencias implementadas:

- Ruta `/empresa` ahora renderiza `resources/js/pages/empresa/dashboard.tsx`.
- Panel empresa usa `RoleLayout` y token Bearer guardado en Sprint 11.
- Si no existe token local, redirige a `/login`.
- Carga datos iniciales desde API:
  - Perfil empresa.
  - Solicitudes de contacto enviadas.
  - Vitrina de talentos publicados.
- Formulario de empresa conectado a `companyService.updateProfile`.
- Buscador de talentos conectado a `companyService.talents`.
- Filtros visuales para habilidad, modalidad, jornada, disponibilidad y Ley 21.015.
- Detalle de CV ciego conectado a `companyService.talent`.
- Solicitud de contacto intermediada conectada a `companyService.requestContact`.
- Historial simple de solicitudes conectado a `companyService.contactRequests`.
- Logout conectado a `authService.logout`.

Validacion ejecutada:

```bash
cd proviemplea-evaluacion/frontend-web
npm run build
php artisan route:list
```

Validacion API backend con empresa demo:

```bash
POST http://localhost:8088/api/v1/auth/login
GET http://localhost:8088/api/v1/empresa/profile
GET http://localhost:8088/api/v1/empresa/talentos
GET http://localhost:8088/api/v1/empresa/talentos/{blindCvCode}
GET http://localhost:8088/api/v1/empresa/contact-requests
```

Resultado:

- `npm run build`: build Vite completado correctamente.
- `php artisan route:list`: ruta `/empresa` disponible.
- Endpoints empresa principales: HTTP `200` con `contacto.empresa.demo@proviemplea.local`.
- Vitrina retorna talentos publicados con CV ciego y sin datos personales directos.

Observacion:

- `npm run format:check` sigue reportando solo `resources/js/components/app-header.tsx`, archivo del starter kit no modificado. Los archivos modificados por Sprint 13 fueron formateados con Prettier.

## Sprint 14 - Panel Admin/Superadmin

Evidencias implementadas:

- Ruta `/admin` ahora renderiza `resources/js/pages/admin/dashboard.tsx`.
- Panel admin usa `RoleLayout` y token Bearer guardado en Sprint 11.
- Si no existe token local, redirige a `/login`.
- Carga datos iniciales desde API:
  - Dashboard administrativo.
  - Personas/talentos.
  - Empresas.
  - Solicitudes de contacto.
  - Resumen de reportes.
  - Configuracion IA.
- Cambio de estado de talentos conectado a `adminService.updatePersonaStatus`.
- Cambio de estado de empresas conectado a `adminService.updateEmpresaStatus`.
- Cambio de estado de solicitudes conectado a `adminService.updateContactRequestStatus`.
- Nota interna conectada a `adminService.addContactRequestNote`.
- Resumen de reportes conectado a `adminService.reportsSummary`.
- Configuracion IA conectada a `settingsService.updateAi`.
- Prueba de conexion IA conectada a `settingsService.testAiConnection`.
- Logout conectado a `authService.logout`.

Validacion ejecutada:

```bash
cd proviemplea-evaluacion/frontend-web
npm run build
php artisan route:list
```

Validacion API backend con superadmin demo:

```bash
POST http://localhost:8088/api/v1/auth/login
GET http://localhost:8088/api/v1/admin/dashboard
GET http://localhost:8088/api/v1/admin/personas
GET http://localhost:8088/api/v1/admin/empresas
GET http://localhost:8088/api/v1/admin/contact-requests
GET http://localhost:8088/api/v1/admin/reports/summary
GET http://localhost:8088/api/v1/admin/settings/ai
POST http://localhost:8088/api/v1/admin/settings/ai/test-connection
```

Resultado:

- `npm run build`: build Vite completado correctamente.
- `php artisan route:list`: ruta `/admin` disponible.
- Endpoints admin principales: HTTP `200` con `admin@proviemplea.local`.
- Endpoint IA en modo `regex`: HTTP `200`.

Observacion:

- Export CSV por API usa autenticacion Bearer; en la UI se deja acceso visual/documental. Para descarga directa desde navegador en produccion conviene proxy frontend o signed URL.
- `npm run format:check` sigue reportando solo `resources/js/components/app-header.tsx`, archivo del starter kit no modificado. Los archivos modificados por Sprint 14 fueron formateados con Prettier.

## Sprint 15 - Pulido Transversal Y Accesibilidad

Evidencias implementadas:

- Widget propio de accesibilidad creado en `resources/js/components/accessibility-widget.tsx`.
- Widget integrado en `PublicLayout` y `RoleLayout`.
- Funciones del widget:
  - Aumentar texto.
  - Disminuir texto.
  - Alto contraste.
  - Reset.
  - Persistencia en `localStorage`.
- CSS transversal agregado en `resources/css/app.css` para texto ampliado y contraste alto.
- Link "Saltar al contenido" agregado a layouts.
- Navegacion transversal agregada a layout publico y layout por rol.
- `apiClient.ts` ahora limpia token ante `401`.
- `apiClient.ts` agrega `apiErrorMessage` para mensajes consistentes en login, registro y paneles por rol.
- Login, registro, persona, empresa y admin usan errores amigables para:
  - Sesion expirada.
  - Falta de permisos.
  - Validaciones `422`.
  - Backend no disponible.

Validacion ejecutada:

```bash
cd proviemplea-evaluacion/frontend-web
npm run build
php artisan route:list
npm run format:check
```

Resultado:

- `npm run build`: build Vite completado correctamente.
- `php artisan route:list`: rutas principales disponibles.
- Widget incluido en assets generados.
- `npm run format:check`: persiste aviso solo en `resources/js/components/app-header.tsx`, archivo del starter kit no modificado.

Guia de demo frontend:

- `/`: landing publica y navegacion transversal.
- `/login`: login API por rol.
- `/register`: registro persona/empresa.
- `/persona`: perfil, CV, consentimiento, analisis y CV ciego.
- `/empresa`: perfil empresa, vitrina y solicitud de contacto.
- `/admin`: metricas, estados, notas, reportes e IA.

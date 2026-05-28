# Arquitectura General

La solucion se divide en backend API, frontend web, infraestructura Docker, scripts y documentacion.

## Componentes

- `backend-api`: Laravel API con Sanctum, MySQL, Swagger, health checks, colas por base de datos, servicios de CV e IA configurable.
- `frontend-web`: Laravel React Starter Kit con React, TypeScript, Inertia, Tailwind CSS y Vite.
- `docker`: contenedores del backend. El frontend no se dockeriza.
- `scripts`: comandos repetibles para instalacion, arranque, migracion, seeders y empaquetado.
- `docs`: guias para profesores, arquitectura, seguridad, accesibilidad y sprints.

## Principios

- Separacion estricta entre datos personales privados y CV ciego visible para empresas.
- API versionada bajo `/api/v1`.
- Autenticacion Bearer Token con Sanctum.
- MySQL como base de datos.
- Sin Redis; las colas usan `database`.
- Regex como modo de analisis por defecto.
- Ollama y OpenAI son opcionales.
- Storage privado para CV reales.

## Procesos Digitalizados

- Inscripcion de personas.
- Inscripcion de empresas.
- Perfilamiento laboral.
- Orientacion y validacion del Departamento de Empleo.
- Derivacion laboral por solicitud de contacto.
- Seguimiento de solicitudes y procesos.
- Reportes administrativos.

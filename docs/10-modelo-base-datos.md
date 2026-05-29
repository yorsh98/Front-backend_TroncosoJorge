# Modelo Base De Datos

Tablas principales previstas:

- `users`
- `person_profiles`
- `person_contact_data`
- `person_educations`
- `person_work_experiences`
- `person_certifications`
- `person_skills`
- `person_languages`
- `person_desired_conditions`
- `person_disability_profiles`
- `company_profiles`
- `company_users`
- `cv_uploads`
- `cv_analysis_results`
- `blind_cv_profiles`
- `contact_requests`
- `contact_request_status_histories`
- `selection_processes`
- `selection_process_notes`
- `system_settings`
- `audit_logs`

## Implementacion Sprint 3

La migracion `2026_05_28_160348_create_proviemplea_domain_tables.php` crea el modelo principal del dominio. Las tablas separan datos personales privados, datos laborales, CV real, analisis de CV, CV ciego, empresas, solicitudes e historial.

## Separacion Privacidad / Visibilidad

- Datos privados: `person_contact_data`, `cv_uploads` y datos identificatorios del usuario.
- Datos laborales internos: `person_profiles`, educacion, experiencia, certificaciones, competencias, idiomas y condiciones deseadas.
- Datos visibles para empresas: `blind_cv_profiles`.
- Solicitudes intermediadas: `contact_requests` y `contact_request_status_histories`.

El CV ciego usa `blind_cv_code` y no contiene nombre, RUT, correo, telefono, direccion exacta, edad, genero, fotografia, estado civil ni nacionalidad.

## Estados Persona

- `draft`
- `pending_validation`
- `validated`
- `rejected`
- `visible`
- `hidden`

## Estados Empresa

- `pending_validation`
- `active`
- `rejected`
- `suspended`

## Estados Solicitud Contacto

- `requested`
- `under_review`
- `approved`
- `rejected`
- `contacted`
- `interview`
- `selected`
- `not_selected`
- `closed`

## Seeders Demo

Seeders creados:

- `SystemSettingsSeeder`: configuracion inicial de IA en modo regex.
- `DemoPersonasSeeder`: talentos ficticios validados y visibles.
- `DemoEmpresasSeeder`: empresas ficticias activas.
- `DemoTalentosSeeder`: CV ciegos generados desde perfiles demo.
- `DemoContactRequestsSeeder`: solicitud de contacto ficticia con historial.

Los datos demo usan correos `@proviemplea.local` y no corresponden a personas reales.

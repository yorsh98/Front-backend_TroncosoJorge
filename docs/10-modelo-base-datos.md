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

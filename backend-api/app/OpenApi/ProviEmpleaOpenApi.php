<?php

namespace App\OpenApi;

use OpenApi\Annotations as OA;
use OpenApi\Attributes as OAT;

/**
 * @OA\Info(
 *     title="ProviEmplea 2026 API",
 *     version="1.0.0",
 *     description="API REST para plataforma de intermediacion laboral inversa con CV ciego, Sanctum Bearer Tokens, MySQL, health checks, analisis CV regex/IA y administracion municipal."
 * )
 * @OA\Server(url="http://localhost:8088", description="Backend local Docker")
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="SANCTUM"
 * )
 * @OA\Tag(name="Health", description="Verificacion de estado del sistema")
 * @OA\Tag(name="Auth", description="Autenticacion Bearer Token")
 * @OA\Tag(name="Persona", description="Perfil laboral, CV, CV ciego y validacion")
 * @OA\Tag(name="Empresa", description="Perfil empresa, vitrina de talentos y solicitudes")
 * @OA\Tag(name="Admin", description="Administracion Departamento de Empleo")
 * @OA\Tag(name="IA", description="Configuracion de analisis de CV")
 * @OA\Schema(
 *     schema="HealthResponse",
 *     type="object",
 *     @OA\Property(property="status", type="string", example="ok"),
 *     @OA\Property(property="app", type="string", example="ProviEmplea 2026 API"),
 *     @OA\Property(property="timestamp", type="string", example="2026-05-28T18:00:00Z"),
 *     @OA\Property(property="version", type="string", example="1.0.0")
 * )
 * @OA\Schema(
 *     schema="LoginRequest",
 *     type="object",
 *     required={"email","password"},
 *     @OA\Property(property="email", type="string", example="admin@proviemplea.local"),
 *     @OA\Property(property="password", type="string", example="password")
 * )
 * @OA\Schema(
 *     schema="RegisterRequest",
 *     type="object",
 *     required={"name","email","password","password_confirmation"},
 *     @OA\Property(property="name", type="string", example="Persona Demo"),
 *     @OA\Property(property="email", type="string", example="persona.demo@proviemplea.local"),
 *     @OA\Property(property="password", type="string", example="password123"),
 *     @OA\Property(property="password_confirmation", type="string", example="password123")
 * )
 * @OA\Schema(
 *     schema="AuthResponse",
 *     type="object",
 *     @OA\Property(property="token_type", type="string", example="Bearer"),
 *     @OA\Property(property="access_token", type="string", example="1|token"),
 *     @OA\Property(property="user", type="object")
 * )
 * @OA\Schema(
 *     schema="AiSettings",
 *     type="object",
 *     @OA\Property(property="cv_analysis_mode", type="string", enum={"regex","local","cloud","hybrid"}, example="regex"),
 *     @OA\Property(property="ai_provider", type="string", enum={"none","ollama","openai"}, example="none"),
 *     @OA\Property(property="ai_failover_to_regex", type="boolean", example=true),
 *     @OA\Property(property="ollama_base_url", type="string", example="http://host.docker.internal:11434"),
 *     @OA\Property(property="ollama_model", type="string", example="gemma4:e4b"),
 *     @OA\Property(property="openai_model", type="string", example="gpt-4.1-mini")
 * )
 * @OA\Get(path="/api/health", tags={"Health"}, summary="Health general", @OA\Response(response=200, description="OK", @OA\JsonContent(ref="#/components/schemas/HealthResponse")))
 * @OA\Get(path="/api/health/db", tags={"Health"}, summary="Health DB", @OA\Response(response=200, description="DB OK"))
 * @OA\Get(path="/api/health/storage", tags={"Health"}, summary="Health storage privado", @OA\Response(response=200, description="Storage OK"))
 * @OA\Get(path="/api/health/queue", tags={"Health"}, summary="Health database queue", @OA\Response(response=200, description="Queue OK"))
 * @OA\Get(path="/api/health/ai", tags={"Health","IA"}, summary="Health IA segun system_settings", @OA\Response(response=200, description="IA OK"))
 * @OA\Post(path="/api/v1/auth/login", tags={"Auth"}, summary="Login con Bearer Token", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/LoginRequest")), @OA\Response(response=200, description="Token", @OA\JsonContent(ref="#/components/schemas/AuthResponse")), @OA\Response(response=422, description="Credenciales invalidas"))
 * @OA\Post(path="/api/v1/auth/register/persona", tags={"Auth"}, summary="Registro persona", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/RegisterRequest")), @OA\Response(response=201, description="Persona creada"))
 * @OA\Post(path="/api/v1/auth/register/empresa", tags={"Auth"}, summary="Registro empresa", @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/RegisterRequest")), @OA\Response(response=201, description="Empresa creada"))
 * @OA\Get(path="/api/v1/auth/me", tags={"Auth"}, summary="Usuario autenticado", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Usuario"), @OA\Response(response=401, description="No autenticado"))
 * @OA\Post(path="/api/v1/auth/logout", tags={"Auth"}, summary="Revoca token actual", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Logout OK"))
 * @OA\Get(path="/api/v1/persona/profile", tags={"Persona"}, summary="Ver perfil persona", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Perfil"))
 * @OA\Put(path="/api/v1/persona/profile", tags={"Persona"}, summary="Actualizar perfil persona", security={{"bearerAuth":{}}}, @OA\RequestBody(@OA\JsonContent(type="object", @OA\Property(property="summary", type="string"), @OA\Property(property="current_position", type="string"), @OA\Property(property="years_experience", type="integer"))), @OA\Response(response=200, description="Perfil actualizado"))
 * @OA\Get(path="/api/v1/persona/profile/completion", tags={"Persona"}, summary="Porcentaje de completitud", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Completitud"))
 * @OA\Post(path="/api/v1/persona/cv/upload", tags={"Persona"}, summary="Subir CV PDF/DOCX/DOC con consentimiento", security={{"bearerAuth":{}}}, @OA\RequestBody(required=true, @OA\MediaType(mediaType="multipart/form-data", @OA\Schema(required={"cv","consent_accepted"}, @OA\Property(property="cv", type="string", format="binary"), @OA\Property(property="consent_accepted", type="boolean", example=true)))), @OA\Response(response=201, description="CV encolado"))
 * @OA\Get(path="/api/v1/persona/cv/uploads", tags={"Persona"}, summary="Listar CV subidos", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Uploads"))
 * @OA\Get(path="/api/v1/persona/cv/analysis/{id}", tags={"Persona"}, summary="Ver resultado de analisis CV", security={{"bearerAuth":{}}}, @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=200, description="Analisis"))
 * @OA\Post(path="/api/v1/persona/cv/analysis/{id}/apply-to-profile", tags={"Persona"}, summary="Aplicar analisis al perfil", security={{"bearerAuth":{}}}, @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=200, description="Aplicado"))
 * @OA\Get(path="/api/v1/persona/educations", tags={"Persona"}, summary="Listar educacion", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Educaciones"))
 * @OA\Post(path="/api/v1/persona/educations", tags={"Persona"}, summary="Crear educacion", security={{"bearerAuth":{}}}, @OA\Response(response=201, description="Creada"))
 * @OA\Get(path="/api/v1/persona/experiences", tags={"Persona"}, summary="Listar experiencia", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Experiencias"))
 * @OA\Post(path="/api/v1/persona/experiences", tags={"Persona"}, summary="Crear experiencia", security={{"bearerAuth":{}}}, @OA\Response(response=201, description="Creada"))
 * @OA\Get(path="/api/v1/persona/skills", tags={"Persona"}, summary="Listar competencias", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Skills"))
 * @OA\Post(path="/api/v1/persona/skills", tags={"Persona"}, summary="Crear competencia", security={{"bearerAuth":{}}}, @OA\Response(response=201, description="Creada"))
 * @OA\Get(path="/api/v1/persona/blind-cv/preview", tags={"Persona"}, summary="Preview CV ciego", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="CV ciego"))
 * @OA\Post(path="/api/v1/persona/request-validation", tags={"Persona"}, summary="Solicitar validacion perfil", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Solicitud enviada"))
 * @OA\Get(path="/api/v1/empresa/profile", tags={"Empresa"}, summary="Ver perfil empresa", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Perfil empresa"))
 * @OA\Put(path="/api/v1/empresa/profile", tags={"Empresa"}, summary="Actualizar perfil empresa", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Perfil actualizado"))
 * @OA\Get(path="/api/v1/empresa/talentos", tags={"Empresa"}, summary="Vitrina de talentos con CV ciego", security={{"bearerAuth":{}}}, @OA\Parameter(name="skill", in="query", @OA\Schema(type="string")), @OA\Parameter(name="language", in="query", @OA\Schema(type="string")), @OA\Parameter(name="modality", in="query", @OA\Schema(type="string")), @OA\Response(response=200, description="Talentos"))
 * @OA\Get(path="/api/v1/empresa/talentos/{blindCvCode}", tags={"Empresa"}, summary="Detalle CV ciego", security={{"bearerAuth":{}}}, @OA\Parameter(name="blindCvCode", in="path", required=true, @OA\Schema(type="string")), @OA\Response(response=200, description="CV ciego"))
 * @OA\Post(path="/api/v1/empresa/talentos/{blindCvCode}/request-contact", tags={"Empresa"}, summary="Solicitar contacto intermediado", security={{"bearerAuth":{}}}, @OA\Parameter(name="blindCvCode", in="path", required=true, @OA\Schema(type="string")), @OA\Response(response=201, description="Solicitud creada"))
 * @OA\Get(path="/api/v1/empresa/contact-requests", tags={"Empresa"}, summary="Historial solicitudes empresa", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Solicitudes"))
 * @OA\Get(path="/api/v1/admin/dashboard", tags={"Admin"}, summary="Dashboard administrativo", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Metricas"))
 * @OA\Get(path="/api/v1/admin/personas", tags={"Admin"}, summary="Listar personas", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Personas"))
 * @OA\Put(path="/api/v1/admin/personas/{id}/status", tags={"Admin"}, summary="Cambiar estado talento", security={{"bearerAuth":{}}}, @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=200, description="Estado actualizado"))
 * @OA\Get(path="/api/v1/admin/empresas", tags={"Admin"}, summary="Listar empresas", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Empresas"))
 * @OA\Put(path="/api/v1/admin/empresas/{id}/status", tags={"Admin"}, summary="Cambiar estado empresa", security={{"bearerAuth":{}}}, @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=200, description="Estado actualizado"))
 * @OA\Get(path="/api/v1/admin/contact-requests", tags={"Admin"}, summary="Listar solicitudes contacto", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Solicitudes"))
 * @OA\Put(path="/api/v1/admin/contact-requests/{id}/status", tags={"Admin"}, summary="Cambiar estado solicitud", security={{"bearerAuth":{}}}, @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=200, description="Estado actualizado"))
 * @OA\Post(path="/api/v1/admin/contact-requests/{id}/notes", tags={"Admin"}, summary="Agregar nota interna", security={{"bearerAuth":{}}}, @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), @OA\Response(response=201, description="Nota agregada"))
 * @OA\Get(path="/api/v1/admin/reports/summary", tags={"Admin"}, summary="Reporte resumen", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Resumen"))
 * @OA\Get(path="/api/v1/admin/reports/export", tags={"Admin"}, summary="Export CSV", security={{"bearerAuth":{}}}, @OA\Parameter(name="type", in="query", @OA\Schema(type="string", enum={"talentos","empresas","solicitudes"})), @OA\Response(response=200, description="CSV"))
 * @OA\Get(path="/api/v1/admin/settings/ai", tags={"IA"}, summary="Ver configuracion IA", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Configuracion", @OA\JsonContent(ref="#/components/schemas/AiSettings")))
 * @OA\Put(path="/api/v1/admin/settings/ai", tags={"IA"}, summary="Actualizar configuracion IA", security={{"bearerAuth":{}}}, @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/AiSettings")), @OA\Response(response=200, description="Actualizada"))
 * @OA\Post(path="/api/v1/admin/settings/ai/test-connection", tags={"IA"}, summary="Probar conexion IA", security={{"bearerAuth":{}}}, @OA\Response(response=200, description="Resultado prueba"))
 */
#[OAT\Info(
    version: '1.0.0',
    title: 'ProviEmplea 2026 API',
    description: 'API REST para plataforma de intermediacion laboral inversa con CV ciego, Sanctum Bearer Tokens, MySQL, health checks, analisis CV regex/IA y administracion municipal.'
)]
#[OAT\Server(url: 'http://localhost:8088', description: 'Backend local Docker')]
#[OAT\SecurityScheme(securityScheme: 'bearerAuth', type: 'http', scheme: 'bearer', bearerFormat: 'SANCTUM')]
#[OAT\Get(path: '/api/health', tags: ['Health'], summary: 'Health general', responses: [new OAT\Response(response: 200, description: 'OK')])]
#[OAT\Get(path: '/api/health/db', tags: ['Health'], summary: 'Health MySQL', responses: [new OAT\Response(response: 200, description: 'DB OK')])]
#[OAT\Get(path: '/api/health/storage', tags: ['Health'], summary: 'Health storage privado', responses: [new OAT\Response(response: 200, description: 'Storage OK')])]
#[OAT\Get(path: '/api/health/queue', tags: ['Health'], summary: 'Health database queue', responses: [new OAT\Response(response: 200, description: 'Queue OK')])]
#[OAT\Get(path: '/api/health/ai', tags: ['Health', 'IA'], summary: 'Health IA', responses: [new OAT\Response(response: 200, description: 'IA OK')])]
#[OAT\Post(path: '/api/v1/auth/login', tags: ['Auth'], summary: 'Login Bearer Token', requestBody: new OAT\RequestBody(required: true, content: new OAT\JsonContent(properties: [new OAT\Property(property: 'email', type: 'string', example: 'admin@proviemplea.local'), new OAT\Property(property: 'password', type: 'string', example: 'password')])), responses: [new OAT\Response(response: 200, description: 'Token'), new OAT\Response(response: 422, description: 'Credenciales invalidas')])]
#[OAT\Post(path: '/api/v1/auth/register/persona', tags: ['Auth'], summary: 'Registro persona', responses: [new OAT\Response(response: 201, description: 'Persona creada')])]
#[OAT\Post(path: '/api/v1/auth/register/empresa', tags: ['Auth'], summary: 'Registro empresa', responses: [new OAT\Response(response: 201, description: 'Empresa creada')])]
#[OAT\Get(path: '/api/v1/auth/me', tags: ['Auth'], summary: 'Usuario autenticado', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Usuario'), new OAT\Response(response: 401, description: 'No autenticado')])]
#[OAT\Post(path: '/api/v1/auth/logout', tags: ['Auth'], summary: 'Logout', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Logout OK')])]
#[OAT\Get(path: '/api/v1/persona/profile', tags: ['Persona'], summary: 'Ver perfil persona', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Perfil')])]
#[OAT\Put(path: '/api/v1/persona/profile', tags: ['Persona'], summary: 'Actualizar perfil persona', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Perfil actualizado')])]
#[OAT\Get(path: '/api/v1/persona/profile/completion', tags: ['Persona'], summary: 'Completitud perfil', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Completitud')])]
#[OAT\Post(path: '/api/v1/persona/cv/upload', tags: ['Persona'], summary: 'Subir CV PDF/DOCX/DOC', security: [['bearerAuth' => []]], requestBody: new OAT\RequestBody(required: true, content: new OAT\MediaType(mediaType: 'multipart/form-data', schema: new OAT\Schema(required: ['cv', 'consent_accepted'], properties: [new OAT\Property(property: 'cv', type: 'string', format: 'binary'), new OAT\Property(property: 'consent_accepted', type: 'boolean', example: true)]))), responses: [new OAT\Response(response: 201, description: 'CV encolado')])]
#[OAT\Get(path: '/api/v1/persona/cv/uploads', tags: ['Persona'], summary: 'Listar CV subidos', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Uploads')])]
#[OAT\Get(path: '/api/v1/persona/cv/analysis/{id}', tags: ['Persona'], summary: 'Resultado analisis CV', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'id', in: 'path', required: true, schema: new OAT\Schema(type: 'integer'))], responses: [new OAT\Response(response: 200, description: 'Analisis')])]
#[OAT\Post(path: '/api/v1/persona/cv/analysis/{id}/apply-to-profile', tags: ['Persona'], summary: 'Aplicar analisis al perfil', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'id', in: 'path', required: true, schema: new OAT\Schema(type: 'integer'))], responses: [new OAT\Response(response: 200, description: 'Aplicado')])]
#[OAT\Get(path: '/api/v1/persona/educations', tags: ['Persona'], summary: 'Listar educacion', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Educaciones')])]
#[OAT\Post(path: '/api/v1/persona/educations', tags: ['Persona'], summary: 'Crear educacion', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 201, description: 'Creada')])]
#[OAT\Get(path: '/api/v1/persona/experiences', tags: ['Persona'], summary: 'Listar experiencias', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Experiencias')])]
#[OAT\Post(path: '/api/v1/persona/experiences', tags: ['Persona'], summary: 'Crear experiencia', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 201, description: 'Creada')])]
#[OAT\Get(path: '/api/v1/persona/skills', tags: ['Persona'], summary: 'Listar competencias', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Skills')])]
#[OAT\Post(path: '/api/v1/persona/skills', tags: ['Persona'], summary: 'Crear competencia', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 201, description: 'Creada')])]
#[OAT\Get(path: '/api/v1/persona/blind-cv/preview', tags: ['Persona'], summary: 'Preview CV ciego', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'CV ciego')])]
#[OAT\Post(path: '/api/v1/persona/request-validation', tags: ['Persona'], summary: 'Solicitar validacion', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Solicitud enviada')])]
#[OAT\Get(path: '/api/v1/empresa/profile', tags: ['Empresa'], summary: 'Ver perfil empresa', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Perfil empresa')])]
#[OAT\Put(path: '/api/v1/empresa/profile', tags: ['Empresa'], summary: 'Actualizar perfil empresa', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Perfil actualizado')])]
#[OAT\Get(path: '/api/v1/empresa/talentos', tags: ['Empresa'], summary: 'Vitrina de talentos CV ciego', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'skill', in: 'query', schema: new OAT\Schema(type: 'string')), new OAT\Parameter(name: 'language', in: 'query', schema: new OAT\Schema(type: 'string')), new OAT\Parameter(name: 'modality', in: 'query', schema: new OAT\Schema(type: 'string'))], responses: [new OAT\Response(response: 200, description: 'Talentos')])]
#[OAT\Get(path: '/api/v1/empresa/talentos/{blindCvCode}', tags: ['Empresa'], summary: 'Detalle CV ciego', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'blindCvCode', in: 'path', required: true, schema: new OAT\Schema(type: 'string'))], responses: [new OAT\Response(response: 200, description: 'CV ciego')])]
#[OAT\Post(path: '/api/v1/empresa/talentos/{blindCvCode}/request-contact', tags: ['Empresa'], summary: 'Solicitar contacto intermediado', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'blindCvCode', in: 'path', required: true, schema: new OAT\Schema(type: 'string'))], responses: [new OAT\Response(response: 201, description: 'Solicitud creada')])]
#[OAT\Get(path: '/api/v1/empresa/contact-requests', tags: ['Empresa'], summary: 'Historial solicitudes empresa', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Solicitudes')])]
#[OAT\Get(path: '/api/v1/admin/dashboard', tags: ['Admin'], summary: 'Dashboard admin', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Metricas')])]
#[OAT\Get(path: '/api/v1/admin/personas', tags: ['Admin'], summary: 'Listar personas', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Personas')])]
#[OAT\Put(path: '/api/v1/admin/personas/{id}/status', tags: ['Admin'], summary: 'Cambiar estado talento', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'id', in: 'path', required: true, schema: new OAT\Schema(type: 'integer'))], responses: [new OAT\Response(response: 200, description: 'Actualizado')])]
#[OAT\Get(path: '/api/v1/admin/empresas', tags: ['Admin'], summary: 'Listar empresas', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Empresas')])]
#[OAT\Put(path: '/api/v1/admin/empresas/{id}/status', tags: ['Admin'], summary: 'Cambiar estado empresa', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'id', in: 'path', required: true, schema: new OAT\Schema(type: 'integer'))], responses: [new OAT\Response(response: 200, description: 'Actualizado')])]
#[OAT\Get(path: '/api/v1/admin/contact-requests', tags: ['Admin'], summary: 'Listar solicitudes contacto', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Solicitudes')])]
#[OAT\Put(path: '/api/v1/admin/contact-requests/{id}/status', tags: ['Admin'], summary: 'Cambiar estado solicitud', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'id', in: 'path', required: true, schema: new OAT\Schema(type: 'integer'))], responses: [new OAT\Response(response: 200, description: 'Actualizado')])]
#[OAT\Post(path: '/api/v1/admin/contact-requests/{id}/notes', tags: ['Admin'], summary: 'Agregar nota interna', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'id', in: 'path', required: true, schema: new OAT\Schema(type: 'integer'))], responses: [new OAT\Response(response: 201, description: 'Nota agregada')])]
#[OAT\Get(path: '/api/v1/admin/reports/summary', tags: ['Admin'], summary: 'Reporte resumen', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Resumen')])]
#[OAT\Get(path: '/api/v1/admin/reports/export', tags: ['Admin'], summary: 'Export CSV', security: [['bearerAuth' => []]], parameters: [new OAT\Parameter(name: 'type', in: 'query', schema: new OAT\Schema(type: 'string', enum: ['talentos', 'empresas', 'solicitudes']))], responses: [new OAT\Response(response: 200, description: 'CSV')])]
#[OAT\Get(path: '/api/v1/admin/settings/ai', tags: ['IA'], summary: 'Ver configuracion IA', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Configuracion')])]
#[OAT\Put(path: '/api/v1/admin/settings/ai', tags: ['IA'], summary: 'Actualizar configuracion IA', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Actualizada')])]
#[OAT\Post(path: '/api/v1/admin/settings/ai/test-connection', tags: ['IA'], summary: 'Probar conexion IA', security: [['bearerAuth' => []]], responses: [new OAT\Response(response: 200, description: 'Resultado')])]
class ProviEmpleaOpenApi
{
}

# IA Y Analisis De CV

El sistema soporta cuatro modos configurables desde superadmin:

- Regex: modo por defecto, no requiere servicios externos.
- IA local con Ollama: usa `http://host.docker.internal:11434` y modelo `gemma4:e4b`.
- IA cloud con OpenAI: usa `OPENAI_API_KEY` desde `.env`.
- Hibrido: usa IA configurada y fallback a regex si falla.

La clave de OpenAI no se guarda en base de datos. Solo se lee desde variables de entorno.

El profesor puede revisar el sistema sin instalar Ollama ni configurar OpenAI porque regex queda activo por defecto.

## Endpoints Sprint 4

Rutas protegidas por Bearer Token, rol `superadmin` y permiso `manage-ai-settings`:

- `GET /api/v1/admin/settings/ai`
- `PUT /api/v1/admin/settings/ai`
- `POST /api/v1/admin/settings/ai/test-connection`

## Validaciones

- Si modo es `regex`, proveedor debe ser `none`.
- Si modo es `local`, proveedor debe ser `ollama`.
- Si modo es `cloud`, proveedor debe ser `openai`.
- Si modo es `hybrid`, proveedor puede ser `ollama` u `openai` y `ai_failover_to_regex` debe ser `true`.

## Ejemplo Configuracion Regex

```json
{
  "cv_analysis_mode": "regex",
  "ai_provider": "none",
  "ai_failover_to_regex": true,
  "ollama_base_url": "http://host.docker.internal:11434",
  "ollama_model": "gemma4:e4b",
  "openai_model": "gpt-4.1-mini"
}
```

## Prueba De Conexion

- Regex responde que no requiere conexion externa.
- Ollama prueba `GET /api/tags` contra `OLLAMA_BASE_URL`.
- OpenAI valida que `OPENAI_API_KEY` exista en `.env`; no guarda la key en base de datos.

## Sprint 5 Implementado

Servicios creados:

- `App\Services\Cv\CvUploadService`
- `App\Services\Cv\CvTextExtractionService`
- `App\Services\Cv\CvLibreOfficeConverter`
- `App\Services\Cv\CvRegexParser`
- `App\Services\Cv\CvProfileMapper`
- `App\Services\Cv\BlindCvBuilder`
- `App\Services\Ai\AiProviderManager`
- `App\Services\Ai\Providers\OllamaCvAnalyzer`
- `App\Services\Ai\Providers\OpenAiCvAnalyzer`
- `App\Services\Ai\Providers\MockCvAnalyzer`

Flujo implementado:

- El usuario persona sube CV con consentimiento aceptado.
- El archivo se guarda en storage privado.
- Se despacha `AnalyzeCvJob` usando database queue en cola `cv-analysis`.
- PDF se extrae con `pdftotext`.
- DOCX se extrae desde `word/document.xml` y puede usar fallback LibreOffice.
- DOC se convierte con LibreOffice headless.
- El analisis usa modo configurado: regex, Ollama, OpenAI o hibrido con fallback.
- El resultado queda en `cv_analysis_results`.
- El perfil no se actualiza automaticamente; requiere confirmacion por endpoint `apply-to-profile`.

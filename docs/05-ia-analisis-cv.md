# IA Y Analisis De CV

El sistema soporta cuatro modos configurables desde superadmin:

- Regex: modo por defecto, no requiere servicios externos.
- IA local con Ollama: usa `http://host.docker.internal:11434` y modelo `gemma4:e4b`.
- IA cloud con OpenAI: usa `OPENAI_API_KEY` desde `.env`.
- Hibrido: usa IA configurada y fallback a regex si falla.

La clave de OpenAI no se guarda en base de datos. Solo se lee desde variables de entorno.

El profesor puede revisar el sistema sin instalar Ollama ni configurar OpenAI porque regex queda activo por defecto.

# Regex Fallback

El parser por regex es el mecanismo base para analizar CV sin dependencia externa. Debe intentar detectar:

- Correo.
- Telefono.
- Resumen.
- Experiencia laboral.
- Educacion.
- Certificaciones.
- Habilidades tecnicas.
- Idiomas.
- Cursos.
- Cargos.
- Periodos o anios.

El resultado se guarda en formato estructurado y el usuario decide si aplica los datos al perfil.

El fallback evita que la demo falle cuando Ollama no esta instalado o cuando OpenAI no tiene API key.

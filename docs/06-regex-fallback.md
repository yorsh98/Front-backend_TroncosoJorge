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

## Implementacion Backend

El parser `CvRegexParser` detecta patrones basicos de:

- Correo y telefono para generar alertas de privacidad.
- Resumen laboral.
- Educacion.
- Experiencia laboral.
- Certificaciones y cursos.
- Competencias tecnicas conocidas.
- Idiomas.
- Condiciones deseadas como modalidad, jornada y disponibilidad.

El resultado normalizado usa la estructura:

```json
{
  "resumen_laboral": "",
  "educacion": [],
  "experiencia_laboral": [],
  "certificaciones": [],
  "competencias_tecnicas": [],
  "idiomas": [],
  "condiciones_laborales_deseadas": {},
  "alertas": [],
  "confidence_score": 0.0,
  "source": "regex"
}
```

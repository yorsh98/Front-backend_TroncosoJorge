# Seguridad Y Datos Personales

ProviEmplea 2026 debe tratar los CV como documentos privados y sensibles.

## Reglas

- Los CV reales se guardan en storage privado.
- No se exponen CV reales por URL publica.
- No se versionan CV reales, `.env`, logs ni datos sensibles.
- Empresas solo ven CV ciego.
- El CV ciego no muestra nombre, RUT, correo, telefono, direccion exacta, edad, genero, fotografia, estado civil ni datos personales no necesarios.
- Antes de subir un CV, el frontend muestra consentimiento obligatorio.
- Las acciones relevantes quedan auditadas sin volcar datos personales completos en logs.

## Auditoria Prevista

- Login.
- Subida de CV.
- Analisis de CV.
- Cambio de configuracion IA.
- Validacion de talento.
- Validacion de empresa.
- Solicitud de contacto.
- Cambio de estado de solicitud.

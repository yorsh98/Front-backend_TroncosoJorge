# Flujos De Usuario

## Persona

La persona se registra, completa datos laborales, acepta consentimiento antes de subir CV, revisa el analisis, aplica datos al perfil, visualiza CV ciego y solicita validacion.

## Empresa

La empresa se registra, completa perfil, espera validacion, busca talentos mediante CV ciego, revisa detalle y solicita contacto intermediado.

## Admin Empleo

El admin valida personas, valida empresas, gestiona solicitudes, registra notas, revisa metricas y exporta reportes.

## Superadmin

El superadmin administra configuracion del sistema, incluida la seleccion del modo de analisis de CV: regex, Ollama, OpenAI o hibrido.

## Flujo Demo Recomendado

1. Ingresar como persona demo: `persona.demo@proviemplea.local` / `password123`.
2. Revisar perfil, completitud, skills, carga CV con consentimiento, analisis y CV ciego en `/persona`.
3. Ingresar como superadmin: `admin@proviemplea.local` / `password`.
4. Revisar metricas y cambiar estado de talento/empresa desde `/admin`.
5. Ingresar como empresa demo: `contacto.empresa.demo@proviemplea.local` / `password123`.
6. Revisar vitrina de talentos, detalle CV ciego y solicitud de contacto en `/empresa`.
7. Volver a `/admin` y actualizar estado de la solicitud, agregando nota interna.
8. Probar widget de accesibilidad desde cualquier pantalla.

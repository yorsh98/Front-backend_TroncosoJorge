# Accesibilidad Universal

El frontend debe implementar accesibilidad real y un widget propio, sin depender de servicios externos como UserWay.

## Widget

Funciones implementadas en Sprint 15:

- Aumentar texto.
- Disminuir texto.
- Alto contraste.
- Reset.

Las preferencias se guardan en `localStorage`.

Archivo principal: `frontend-web/resources/js/components/accessibility-widget.tsx`.

Integracion:

- `frontend-web/resources/js/layouts/public-layout.tsx`.
- `frontend-web/resources/js/layouts/role-layout.tsx`.
- `frontend-web/resources/css/app.css`.

Funciones previstas no implementadas todavia:

- Escala de grises.
- Subrayar enlaces.
- Pausar animaciones.
- Fuente alternativa legible.

## Criterios

- HTML semantico.
- Labels visibles o accesibles.
- `aria-label` cuando corresponda.
- Estados `focus-visible`.
- Navegacion por teclado.
- Modales accesibles.
- Tablas accesibles.
- Mensajes de error asociados a campos.
- Contraste adecuado.
- No depender solo del color.

## Revision Rapida

- Abrir `/`.
- Usar el widget inferior derecho.
- Aumentar texto y verificar que la lectura se mantiene usable.
- Activar contraste y verificar que botones, secciones y bordes siguen visibles.
- Usar Tab para llegar al link "Saltar al contenido".

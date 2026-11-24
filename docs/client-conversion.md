# Consultas con contexto y evidencia de proyectos

La web conserva el árbol, la identidad verde y oscura y los precios y condiciones vigentes. Las consultas no equivalen a una compra ni a una aceptación del alcance.

## Recorrido del visitante

1. Inicio presenta webs para restaurantes, tiendas virtuales y software a medida y automatización.
2. Servicios conserva sus páginas y alcances existentes; cada llamada a consultar identifica el servicio y, en sus tarjetas, el plan de ese servicio.
3. Planes mantiene los valores desde $500.000, $900.000, $1.490.000 y $3.490.000 COP, sus exclusiones y costos recurrentes. “Consultar este plan” abre el formulario con la selección.
4. Contacto muestra la selección sin reemplazar el mensaje ni aceptar el consentimiento por el visitante. El contexto acompaña el mensaje de Formspree o el enlace de WhatsApp.

## Configuración única

- `src/data/content.ts` → `CONTACT_INFO`: correo, teléfono, WhatsApp y ubicación; `SITE_URL`: dirección pública vigente.
- Correo actual indicado por el responsable: **treessetcorp@gmail.com**, centralizado en `CONTACT_INFO.email`. Queda **pendiente confirmar** la recepción; este cambio no comprueba la entrega de correo ni redirige el buzón de Formspree, que se configura en el proveedor.
- `NEXT_PUBLIC_FORMSPREE_FORM_ID`: se conserva el mecanismo actual. Sin un ID válido, el formulario informa que no está conectado y ofrece canales alternativos; no simula envíos.
- No se modificaron dominio, DNS ni servicios externos. No se publicaron cambios.

## Parámetros de consulta

`src/lib/enquiry.ts` acepta únicamente identificadores presentes en los catálogos: `servicio`, `plan`, `proyecto`, `demo`. `opcion` identifica un plan existente dentro del servicio seleccionado. Valores desconocidos se ignoran; no se permite inicializar el consentimiento desde la URL. Ejemplo: `/contacto?plan=vende-online`.

Las demos interactivas de restaurante, radio y logística se retiraron del inicio (admin-concepts-visible-collage S10); `demo=restaurante|radio|logistica` se sigue aceptando para no romper enlaces existentes.

## Evidencia y datos pendientes

- Solo un campo `client` explícito identifica un proyecto para cliente. Bendita Gracia ya lo contiene; su participación individual está pendiente de confirmar.
- Los proyectos de portafolios no prueban contratos de TreesSet Developers: se identifican como proyectos personales del equipo. Las experiencias de empleo se distinguen como trabajo para otra empresa.
- Los casos muestran contexto, funcionalidades y autoría existentes. No se añadieron testimonios, cifras de ventas ni resultados comerciales. Las cifras de tráfico/cobertura sin evidencia en los casos se sustituyeron por funciones verificables en su contenido.
- Confirmar con los integrantes cuáles proyectos de sus portafolios fueron contratos de clientes, la entidad contratante, responsabilidades específicas y permiso de publicación antes de reclasificarlos.
- Las imágenes conceptuales conservan su aviso; no se presentan como capturas reales. Floraltech conserva la aclaración de pagos simulados.
- Lanzamiento, capacitación y acompañamiento dependen del alcance contratado; no se prometen tiempos de respuesta ni mantenimiento permanente.

## Verificación sin consultas reales

`node --test tests/client-conversion-*.test.mjs` incluye simulación del transporte: nunca envía mensajes reales. Las pruebas generales requieren un servidor mediante `TEST_BASE_URL`. Las pruebas de navegador deben interceptar o bloquear peticiones de envío y no abrir enlaces externos de WhatsApp.

## Comprobaciones realizadas

- Compilación de producción, TypeScript y suite completa: 264/264 pruebas aprobadas.
- Navegador real: once rutas en 390, 768 y 1440 px; planes, contexto, validación sin envíos, demos, foco/Escape y enlaces del carrusel aprobados.
- Movimiento reducido: secciones visibles sin perspectiva ni animación de entrada. Las capturas completas cargan explícitamente imágenes diferidas solo en el verificador, no en producción.
- Revisión independiente del contexto/consentimiento: una corrección de codificación detectada y revalidada; sin cambios de precios ni transporte.
- `npm run lint` no pudo ejecutarse como comprobación: ESLint carece de configuración y abre un asistente interactivo. No se añadieron dependencias ni configuración sin alcance específico.

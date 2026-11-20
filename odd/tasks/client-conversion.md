# TreesSide client conversion
Improve service clarity, trustworthy evidence and contextual enquiries on the existing site. Branch: feat/client-conversion; baseline: 8c2a102; delivery: ask-on-risk, local commits only, no publishing.
Checks: node --test tests/*.test.mjs with TEST_BASE_URL; tsc --noEmit; npm run build; existing Chromium/CDP scripts. Forecast ~1400 authored lines, slices by behavior; preserve pre-existing edits/assets.

## Specs
S1. "Primero revisa el proyecto existente, su estructura, tecnologías, componentes y contenido. Implementa las mejoras sobre esa base, manteniendo la identidad visual verde, los fondos oscuros y el árbol tecnológico. Conserva las funcionalidades existentes y adapta todos los cambios a escritorio, tablet y móvil."
S2. "Título: “Tu negocio puede vender más y trabajar mejor con el software adecuado”." "Descripción: “Creamos páginas web, tiendas y plataformas a medida para negocios que necesitan recibir clientes, organizar su operación y automatizar tareas”." "Botones principales: “Cotizar mi proyecto” y “Ver proyectos reales”." "Presenta tres soluciones principales:\n- Web para restaurantes.\n- Tiendas virtuales.\n- Software a medida y automatización." "Cada solución debe explicar para quién sirve, qué problema resuelve y qué funcionalidades ofrece. Mantén los demás servicios disponibles dentro de Servicios."
S3. "Destaca los proyectos reales más relevantes con:\n- Contexto o necesidad.\n- Solución desarrollada.\n- Participación del equipo.\n- Capturas disponibles.\n- Funcionalidades entregadas.\n- Enlace público, cuando exista." "Diferencia claramente proyectos para clientes, proyectos personales y demos conceptuales. Utiliza únicamente información y recursos existentes o confirmados. No inventes testimonios, clientes, cifras ni resultados comerciales." "Mantén las demos interactivas y conéctalas con el servicio correspondiente y una llamada a solicitar una propuesta."
S4. "Conserva el concepto visual del árbol e incorpora:\n- Una presentación clara de a quién ayudamos.\n- Integrantes y responsabilidades con los datos y fotografías disponibles.\n- Experiencia respaldada por proyectos.\n- Forma de trabajo y acompañamiento." "Revisa el contexto de los indicadores actuales. No presentes proyectos personales del equipo como contratos realizados por la empresa. Da prioridad a la experiencia demostrable sobre la cantidad de tecnologías." "Explica el proceso mediante entregables concretos:\n- Descubrimiento: necesidades, propuesta y alcance.\n- Diseño: estructura y diseño para aprobación.\n- Desarrollo: avances revisables.\n- Lanzamiento: publicación, entrega y capacitación según el alcance contratado." "Evita ofrecer compromisos que no estén confirmados."
S5. "Conserva los precios y condiciones vigentes del proyecto. Mejora la presentación de cada plan para explicar:\n- Para qué negocio sirve.\n- Qué incluye.\n- Qué podrá hacer el cliente.\n- Qué necesita aportar para comenzar.\n- Costos adicionales o recurrentes, según las condiciones existentes." "Añade “Consultar este plan” a cada tarjeta. El botón debe llevar el plan seleccionado al formulario o incluirlo en el mensaje de WhatsApp."
S6. "Utiliza opciones comprensibles para personas sin conocimientos técnicos:\n- Necesito una página web.\n- Quiero vender por internet.\n- Quiero organizar mi negocio.\n- Quiero automatizar tareas.\n- Necesito orientación." "Conserva la validación, el consentimiento de datos y el mecanismo de envío existente. Explica qué sucede después de contactar, sin prometer tiempos de respuesta no confirmados." "Los enlaces desde servicios, demos y planes deben conservar el contexto de la consulta. Reutiliza el número de WhatsApp configurado."
S7. "Unifica el nombre TreesSide Developers en textos y metadatos. Identifica las referencias al correo de otra marca y centraliza su configuración. No inventes un correo nuevo ni reemplaces el actual por uno que no funcione; deja documentado el dato pendiente."
S8. "Mantén la personalidad visual y mejora la jerarquía de títulos, textos y botones." "Prioriza la legibilidad y el acceso a los proyectos." "Evita animaciones que dificulten navegar o ralenticen la página." "Respeta la preferencia de movimiento reducido." "Revisa contraste, navegación por teclado, etiquetas y estados de foco." "Optimiza imágenes y carga de recursos." "Revisa títulos, descripciones, encabezados y enlaces internos." "Aprovecha las páginas de servicios existentes y mejora su contenido según la intención del cliente, evitando páginas duplicadas sin valor."
S9. "Implementa los cambios, no te limites a proponerlos. Comprueba navegación, enlaces, selección de planes, demos, validación del formulario y diseño responsive. No envíes consultas reales durante las pruebas." "Ejecuta las verificaciones disponibles del proyecto y corrige los errores derivados de los cambios. Entrega un resumen de lo implementado, las comprobaciones realizadas y los datos que requieren confirmación." "No publiques ni cambies dominio, correo o servicios externos sin una instrucción específica."

## Tasks
- T1 [S1,S2,S3,S8] Home value proposition, three solutions and demo/service links — worker A — done (6/6 focused RED/GREEN, 9/9 existing deterministic, tsc); commit 31a0149.
- T2 [S5,S6] Contextual contact contract, plain-language form and plan selection — worker B partial, parent completed — done (6/6 focused tests, TypeScript pass); commit 4fd2ce1.
- T3 [S3,S4,S7,S8] Evidence presentation, team/process, brand/email and contextual service/project producers — worker C partial, parent completed inline — done (9/9 evidence, aggregate21/21 focused and TypeScript pass); commit 7b2e144.
- T4 [S1-S9] Build, full suite, independent risk verification, browser responsive/form/demo checks, docs and local slices — parent + verifier — done; commit f487af0 (264/264, build/tsc/browser pass; lint unavailable: no ESLint configuration).

## Log
L1. User request (verbatim):
Vamos a mejorar la web de TreesSide Developers para comunicar mejor nuestros servicios, generar confianza y convertir visitas en consultas de clientes.

Web actual: https://treesside-developers.malejawork12.workers.dev/

Primero revisa el proyecto existente, su estructura, tecnologías, componentes y contenido. Implementa las mejoras sobre esa base, manteniendo la identidad visual verde, los fondos oscuros y el árbol tecnológico. Conserva las funcionalidades existentes y adapta todos los cambios a escritorio, tablet y móvil.

OBJETIVO
Que un visitante entienda rápidamente qué ofrecemos, cómo podemos ayudar a su negocio, qué experiencia tenemos y cómo solicitar una propuesta.

1. INICIO
Reemplaza los mensajes generales por una propuesta de valor clara:

Título: “Tu negocio puede vender más y trabajar mejor con el software adecuado”.

Descripción: “Creamos páginas web, tiendas y plataformas a medida para negocios que necesitan recibir clientes, organizar su operación y automatizar tareas”.

Botones principales: “Cotizar mi proyecto” y “Ver proyectos reales”.

Presenta tres soluciones principales:
- Web para restaurantes.
- Tiendas virtuales.
- Software a medida y automatización.

Cada solución debe explicar para quién sirve, qué problema resuelve y qué funcionalidades ofrece. Mantén los demás servicios disponibles dentro de Servicios.

2. PROYECTOS Y CASOS
Destaca los proyectos reales más relevantes con:
- Contexto o necesidad.
- Solución desarrollada.
- Participación del equipo.
- Capturas disponibles.
- Funcionalidades entregadas.
- Enlace público, cuando exista.

Diferencia claramente proyectos para clientes, proyectos personales y demos conceptuales. Utiliza únicamente información y recursos existentes o confirmados. No inventes testimonios, clientes, cifras ni resultados comerciales.

Mantén las demos interactivas y conéctalas con el servicio correspondiente y una llamada a solicitar una propuesta.

3. NOSOTROS
Conserva el concepto visual del árbol e incorpora:
- Una presentación clara de a quién ayudamos.
- Integrantes y responsabilidades con los datos y fotografías disponibles.
- Experiencia respaldada por proyectos.
- Forma de trabajo y acompañamiento.

Revisa el contexto de los indicadores actuales. No presentes proyectos personales del equipo como contratos realizados por la empresa. Da prioridad a la experiencia demostrable sobre la cantidad de tecnologías.

Explica el proceso mediante entregables concretos:
- Descubrimiento: necesidades, propuesta y alcance.
- Diseño: estructura y diseño para aprobación.
- Desarrollo: avances revisables.
- Lanzamiento: publicación, entrega y capacitación según el alcance contratado.

Evita ofrecer compromisos que no estén confirmados.

4. PLANES
Conserva los precios y condiciones vigentes del proyecto. Mejora la presentación de cada plan para explicar:
- Para qué negocio sirve.
- Qué incluye.
- Qué podrá hacer el cliente.
- Qué necesita aportar para comenzar.
- Costos adicionales o recurrentes, según las condiciones existentes.

Añade “Consultar este plan” a cada tarjeta. El botón debe llevar el plan seleccionado al formulario o incluirlo en el mensaje de WhatsApp.

5. CONTACTO
Utiliza opciones comprensibles para personas sin conocimientos técnicos:
- Necesito una página web.
- Quiero vender por internet.
- Quiero organizar mi negocio.
- Quiero automatizar tareas.
- Necesito orientación.

Conserva la validación, el consentimiento de datos y el mecanismo de envío existente. Explica qué sucede después de contactar, sin prometer tiempos de respuesta no confirmados.

Los enlaces desde servicios, demos y planes deben conservar el contexto de la consulta. Reutiliza el número de WhatsApp configurado.

6. COHERENCIA DE MARCA
Unifica el nombre TreesSide Developers en textos y metadatos. Identifica las referencias al correo de otra marca y centraliza su configuración. No inventes un correo nuevo ni reemplaces el actual por uno que no funcione; deja documentado el dato pendiente.

7. DISEÑO, ACCESIBILIDAD Y SEO
- Mantén la personalidad visual y mejora la jerarquía de títulos, textos y botones.
- Prioriza la legibilidad y el acceso a los proyectos.
- Evita animaciones que dificulten navegar o ralenticen la página.
- Respeta la preferencia de movimiento reducido.
- Revisa contraste, navegación por teclado, etiquetas y estados de foco.
- Optimiza imágenes y carga de recursos.
- Revisa títulos, descripciones, encabezados y enlaces internos.
- Aprovecha las páginas de servicios existentes y mejora su contenido según la intención del cliente, evitando páginas duplicadas sin valor.

VERIFICACIÓN Y ENTREGA
Implementa los cambios, no te limites a proponerlos. Comprueba navegación, enlaces, selección de planes, demos, validación del formulario y diseño responsive. No envíes consultas reales durante las pruebas.

Ejecuta las verificaciones disponibles del proyecto y corrige los errores derivados de los cambios. Entrega un resumen de lo implementado, las comprobaciones realizadas y los datos que requieren confirmación.

No publiques ni cambies dominio, correo o servicios externos sin una instrucción específica.

L2. Resume: user said "continua". Explorer map completed (mwpj6d3e-1-yo0d); actual independent Git root nested in session cwd. Preserve initial content.ts Bendita Gracia entry, modified legacy tests, untracked mockups/assets and deleted JPGs. Baseline HEAD 8c2a102. Next 15/React 19/TS; no test npm script; tests require running site. Current Formspree transport and contact consent must remain unchanged. No confirmed replacement email; use existing value.

L3. Implementation T1-T3: exact business hero and solutions; three original demos preserved with contextual links; contact reads catalog-backed servicio/plan/demo/proyecto/opcion selections, retains draft and consent, appends context only at send boundary, WhatsApp fallback retains it. Commercial catalog unchanged except full-brand greeting. About roster uses existing photographs/roles/contributions; personal/employment/client distinctions, concrete process and existing case evidence. docs/client-conversion.md records pending legacy email and ownership confirmations. Focused21/21 and TypeScript pass; independent verifier mwpl5ske found only two corrupted characters; fixed and regression added; targeted mwplg9gm recheck1/1 passes, 51 category-plan roundtrips and48 transport baseline comparisons previously passed.
L4. Functional checks: build exit0; initial full suite242/263, most failures were deliberately superseded copy/query expectations; adapted with assertions of requested new behavior, not removals. Browser390/768 passed route layouts but desktop exposed pre-existing Reveal transforms under reduced-motion; RED/GREEN regression added and CSS now visible/flat with reduced preference. Own npm preview survived job-stop as PID13080 causing EADDRINUSE and stale static manifests on next build; confirmed exact root/port/command, stopped only own process, started direct-node preview job10. Re-run suite/browser on fresh build; prior stale-manifest failures are not product proof. No real sends/publication/external edits.

L5. Final functional evidence: fresh production build succeeds (Next15.5.28; pre-existing autoprefixer flex-start suggestion remains). TypeScript noEmit/incrementalfalse succeeds; git diff--check succeeds; full suite264/264 exit0. Initial242/263 → stale assertions updated → stale-preview incident resolved →263/264 → React Suspense boundary-aware wrapper assertion →264/264. Browser job12 exit0:11 routes each at390/768/1440, one h1, no viewport overflow/broken loaded images, metadata; contextual plans, invalid-email/consent validation without submits, all three demo tabs, dialog focus/Escape; existing plan disclosure and carousel mouse/Enter/direct-hash scripts pass. Job13 exit0 refreshes nine screenshots after explicitly decoding lazy images for full-page evidence. Captures visually inspected desktop/mobile/tablet. No enquiries sent. npm run lint exits1 because ESLint is not configured and Next launches a setup prompt; no configuration/dependencies changed. Build/typecheck/suite/browser pass independently; lint remains unavailable, not represented as passing.
L6. Local preservation/slices: initial Bendita Gracia pending asset/tests preserved in71047c9 and catalog entry inaa6c640 (first cached-patch attempt used Windows CRLF conversion and failed before mutation; corrected byte-input patch in second commit; no amend/reset). Home31a0149 (365 authored changed lines), contact4fd2ce1 (383), evidence7b2e144 (632 coherent evidence/service producers with regression tests; tests and modal simplification account for size). Legacy image deletions, supplied mockups and unreferenced restaurant crops remain untouched/uncommitted. Delivery strategy ask-on-risk; no push/PR/deploy. Hook counts since origin/main include116+ historical commits from another remote: those are NOT this feature or a delivery target. Native individual assessments: baseline+home medium411lines under_budget/notdue; contact medium383lines under_budget/notdue, security escalation2 requires independent verifier already completed; evidence medium632lines under_budget/notdue. No native review consent, verdict or approval claimed. Final docs/accessibility/checks slice follows; aggregate pending boundary is8c2a102. Final accessibility/checks unit f487af0 assessment: medium301lines, reviewDue=false, under_budget; no native START is due for these individual work units. Native authority is not approved or consumed. Functional delivery is local only; any future push/PR needs its own committed delivery-range assessment and human authorization.

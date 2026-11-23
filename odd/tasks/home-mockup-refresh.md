# Home mockup refresh
Home-only commercial redesign from Images/TreesSide_ tecnologia actualizada home.png. Branch: feat/client-conversion; baseline: b4b520f; local-only delivery, ask-on-risk.
Checks: focused node tests, TypeScript, production build, full suite and real browser 390/768/1440; no real enquiries. Forecast ~700 authored lines; separate home implementation and verification/documentation slices.

## Specs
S1. "Rediseña únicamente el Home de TreesSide Developers tomando como referencia el último mockup adjunto y las siguientes indicaciones." "El menú lateral actual: ubicación, diseño, interacciones y comportamiento responsive. No lo reemplaces por un menú tradicional." "La identidad verde oscuro y menta, el árbol tecnológico y la personalidad creativa." "Las demás páginas, rutas, datos de contacto y funcionalidades existentes."
S2. "Título: “Tu negocio puede vender más y trabajar mejor”." "Descripción: “Creamos páginas web, tiendas y software a medida para ayudarte a atraer clientes, organizar tu operación y automatizar tareas”." "“Cotizar mi proyecto”." "“Ver nuestro trabajo”." "Capturas reales de La Lupe." "Imágenes ilustrativas de una propuesta para peluquerías." "Imágenes ilustrativas de comercio electrónico." "Identifica las propuestas ilustrativas con una etiqueta visible: “Diseño conceptual”. No las presentes como plataformas desarrolladas ni clientes reales." "Mantén el árbol tecnológico como acompañamiento, sin quitar protagonismo al contenido."
S3. "Título: “¿Qué necesita tu negocio?”" "Web para restaurantes." "Tiendas virtuales." "Software y automatización." "Explica brevemente el beneficio de cada servicio y enlaza con su página existente. Las ilustraciones representan posibilidades del servicio, no funcionalidades ya entregadas a un cliente."
S4. "Título: “Conoce nuestro trabajo”." "Proyecto: La Lupe." "La Lupe es un restaurante mexicano." "Describe únicamente lo desarrollado: presentación del restaurante, menú, platos destacados y contacto por WhatsApp, según el contenido confirmado." "“Ver proyecto”." "“Quiero una web para mi negocio”." "No atribuyas pedidos, reservas, pagos o paneles administrativos si no están implementados."
S5. "Título: “Así podría verse tu negocio”." "Texto: “Explora propuestas visuales que podemos adaptar a la identidad y las necesidades de tu negocio”." "Peluquerías y salones de belleza" "Etiqueta visible: “Diseño conceptual”." "Presenta una propuesta de cómo podrían mostrarse servicios, instalaciones y profesionales." "Botón: “Quiero algo similar”." "Comercio electrónico" "Presenta una propuesta visual de tienda y catálogo de productos." "Botón: “Quiero una tienda virtual”." "Estas propuestas no tienen una página web desarrollada. No las incluyas como casos de éxito, proyectos entregados ni clientes. No añadas botones “Ver sitio” ni enlaces a webs inexistentes." "Si aparece UptownHair en los recursos, no lo presentes como un proyecto desarrollado. Utiliza un nombre genérico para la propuesta de peluquerías."
S6. "Conserva las demos existentes y su funcionamiento." "Identifica esta sección como “Demo interactiva · Datos de ejemplo”. Debe quedar claro que es una simulación y que no representa funcionalidades implementadas en la web real de La Lupe." "Añade el botón “Quiero una solución similar”, conectado con el contacto existente."
S7. "Título: “Así construimos contigo”." "Descubrimos: necesidades, propuesta y alcance." "Diseñamos: estructura y diseño para aprobación." "Desarrollamos: construcción y avances revisables." "Lanzamos: publicación y entrega según el alcance." "Título: “El próximo paso de tu negocio empieza aquí”." "Botón: “Cuéntanos tu proyecto”."
S8. "Sigue la composición general del mockup, adaptada al menú lateral actual." "Alterna fondos claros y oscuros para diferenciar secciones." "Prioriza legibilidad, capturas grandes, espacios equilibrados y botones claros." "Revisa los recursos existentes antes de implementar." "Usa capturas reales para La Lupe e imágenes ilustrativas para peluquerías y comercio electrónico." "No inventes testimonios, métricas, clientes ni resultados." "Conserva el footer y evita cambios compartidos que alteren otras páginas."
S9. "Implementa el rediseño. Comprueba escritorio, tablet y móvil, navegación, botones, demos y ausencia de desbordamientos. Ejecuta las verificaciones disponibles y entrega un resumen de los cambios. el mockup esta en la carpeta raiz en images y se llama asi TreesSide_ tecnologia actualizada home"

## Tasks
- T1 [S1-S8] Home-only sections, isolated styles, real/concept imagery, preserved demos/footer default — bounded writer (context backstop) — implemented, functional checks passed; native review blocked; commits 1bfb6bf, 5e0e5c8.
- T2 [S1-S9] Reconcile outdated home assertions, independent shared-footer preservation check, production/browser/full suite, docs and local slices — parent + verifier (Risk item 3: shared HomeClosing default) — functional checks/docs complete; native review blocked; commit a77a5df.

## Log
L1. User request (verbatim):
Rediseña únicamente el Home de TreesSide Developers tomando como referencia el último mockup adjunto y las siguientes indicaciones.

CONSERVAR
- El menú lateral actual: ubicación, diseño, interacciones y comportamiento responsive. No lo reemplaces por un menú tradicional.
- La identidad verde oscuro y menta, el árbol tecnológico y la personalidad creativa.
- Las demás páginas, rutas, datos de contacto y funcionalidades existentes.

OBJETIVO
Mejorar la presentación comercial para que el visitante entienda nuestros servicios, explore nuestro trabajo y solicite una propuesta.

1. PRIMERA SECCIÓN
Título: “Tu negocio puede vender más y trabajar mejor”.

Descripción: “Creamos páginas web, tiendas y software a medida para ayudarte a atraer clientes, organizar tu operación y automatizar tareas”.

Botones:
- “Cotizar mi proyecto”.
- “Ver nuestro trabajo”.

A la derecha, presenta una composición con:
- Capturas reales de La Lupe.
- Imágenes ilustrativas de una propuesta para peluquerías.
- Imágenes ilustrativas de comercio electrónico.

Identifica las propuestas ilustrativas con una etiqueta visible: “Diseño conceptual”. No las presentes como plataformas desarrolladas ni clientes reales.

Mantén el árbol tecnológico como acompañamiento, sin quitar protagonismo al contenido.

2. SERVICIOS
Título: “¿Qué necesita tu negocio?”

Presenta tres tarjetas:
- Web para restaurantes.
- Tiendas virtuales.
- Software y automatización.

Explica brevemente el beneficio de cada servicio y enlaza con su página existente. Las ilustraciones representan posibilidades del servicio, no funcionalidades ya entregadas a un cliente.

3. PROYECTO REAL DESTACADO
Título: “Conoce nuestro trabajo”.
Proyecto: La Lupe.

Utiliza las capturas, identidad y datos reales disponibles en el proyecto. La Lupe es un restaurante mexicano.

Describe únicamente lo desarrollado: presentación del restaurante, menú, platos destacados y contacto por WhatsApp, según el contenido confirmado.

Botones:
- “Ver proyecto”.
- “Quiero una web para mi negocio”.

No atribuyas pedidos, reservas, pagos o paneles administrativos si no están implementados.

4. PROPUESTAS CONCEPTUALES
Título: “Así podría verse tu negocio”.

Texto: “Explora propuestas visuales que podemos adaptar a la identidad y las necesidades de tu negocio”.

Incluye dos tarjetas:

A. Peluquerías y salones de belleza
- Usa imágenes ilustrativas disponibles.
- Etiqueta visible: “Diseño conceptual”.
- Presenta una propuesta de cómo podrían mostrarse servicios, instalaciones y profesionales.
- Botón: “Quiero algo similar”.

B. Comercio electrónico
- Usa imágenes ilustrativas disponibles.
- Etiqueta visible: “Diseño conceptual”.
- Presenta una propuesta visual de tienda y catálogo de productos.
- Botón: “Quiero una tienda virtual”.

Estas propuestas no tienen una página web desarrollada. No las incluyas como casos de éxito, proyectos entregados ni clientes. No añadas botones “Ver sitio” ni enlaces a webs inexistentes.

Si aparece UptownHair en los recursos, no lo presentes como un proyecto desarrollado. Utiliza un nombre genérico para la propuesta de peluquerías.

5. DEMO INTERACTIVA
Conserva las demos existentes y su funcionamiento.

Identifica esta sección como “Demo interactiva · Datos de ejemplo”. Debe quedar claro que es una simulación y que no representa funcionalidades implementadas en la web real de La Lupe.

Añade el botón “Quiero una solución similar”, conectado con el contacto existente.

6. PROCESO
Título: “Así construimos contigo”.

Cuatro etapas:
- Descubrimos: necesidades, propuesta y alcance.
- Diseñamos: estructura y diseño para aprobación.
- Desarrollamos: construcción y avances revisables.
- Lanzamos: publicación y entrega según el alcance.

7. CIERRE
Título: “El próximo paso de tu negocio empieza aquí”.
Botón: “Cuéntanos tu proyecto”.

DISEÑO Y RECURSOS
- Sigue la composición general del mockup, adaptada al menú lateral actual.
- Alterna fondos claros y oscuros para diferenciar secciones.
- Prioriza legibilidad, capturas grandes, espacios equilibrados y botones claros.
- Revisa los recursos existentes antes de implementar.
- Usa capturas reales para La Lupe e imágenes ilustrativas para peluquerías y comercio electrónico.
- No inventes testimonios, métricas, clientes ni resultados.
- Conserva el footer y evita cambios compartidos que alteren otras páginas.

Implementa el rediseño. Comprueba escritorio, tablet y móvil, navegación, botones, demos y ausencia de desbordamientos. Ejecuta las verificaciones disponibles y entrega un resumen de los cambios. el mockup esta en la carpeta raiz en images y se llama asi TreesSide_ tecnologia actualizada home

L3. Resume evidence: nested Git root confirmed; branch feat/client-conversion at b4b520f. Existing asset additions/deletions preserved. Focused home-mockup-refresh tests passed 12/12; TypeScript exited 0. Initial full suite exited 1: HTTP tests had no server (ECONNREFUSED localhost:3000), and legacy Home assertions need reconciliation. Updated isolated Home/footer composition, demo copy/context and real-project assertions; fixed test loader directory/index resolution. An intermediate test-edit encoding issue was repaired to UTF-8; legacy Hero remains tested with its unchanged heading. Independent footer/spec verifier mwtty8p8-2-plul running. Focused checks plus production build launched as job-2; production server/browser/full-suite verification and docs remain pending. No completion or delivery claimed.

L2. Read-only exploration mwpmwtu0: actual screenshot /images/projects/la-lupe.webp1200x833; do not use mockup's alternate restaurant art as delivered. Generic ecommerce artwork and unbranded booking artwork available; UptownHair actual screenshot is branded login, not suitable conceptual evidence. Home.module.css is shared by footer, so use separate HomeRedesign.module.css. Three demos and store preserved; avoid fictional real-site functionality. Footer may gain an optional Home-only compact setting with default rendering byte-equivalent; no menu/shared CSS/data/other route edits. Existing dirty mockups/JPG deletions remain untouched. Existing preview job10 port3117 is old production build; stop own direct-node server before rebuilding.

L4. T2 bounded TEST/DOC reconciliation: independently reran `TEST_BASE_URL=http://127.0.0.1:3117 node --test tests/home-brand-card.test.mjs tests/home-tabs.test.mjs tests/home-mockup-refresh.test.mjs` against the parent's existing production preview: exit 0, 20/20 passed, zero skips. The hero span assertion, VM URL globals and directory/index resolution passed without further changes. These checks cover S1-S8 assertions and part of S9 (server markup, demo selection, response/reset). README now removes stale Home team/ribbon descriptions and locates the actual Home components. No new behavior change, so no meaningful RED for this documentation-only slice. Parent reports TypeScript/build success, 33 browser route/width checks at 390/768/1440 and baseline/current default-footer SSR equality; these were not rerun in this slice. At this checkpoint parent full-suite job-6 output was pending; no duplicate full suite launched, no completion claimed. Risk item 3 (shared-footer default review) remains parent-owned.

L5. Parent subsequently reported job-6 exit 0: 274 tests, 274 passed, zero failures/skips; no further suite required. Parent browser job-5 passed all 33 route/width combinations at 390/768/1440 with no overflow or broken images. Parent differential default-footer baseline/current SSR equality exited 0. These are parent-reported results, not reruns by this writer. Writer directly read `.git/conversion-browser/390-home.png`, `768-home.png`, `1440-home.png` and the source mockup `Images/TreesSide_ tecnologia actualizada home.png`. No obvious clipping, overlap or missing section was visible: mobile stacks cards/collage, tablet adapts the service grid, desktop retains the side menu; light/dark separation, concept labels and CTAs are visible. Fidelity differences requiring review rather than an unverified source fix: tree artwork is much subtler than the mockup; salon is a simplified generic visual rather than photographic artwork; retained demo UI is dark rather than the mockup's light sample. Full-page captures were downscaled by the image reader, so small-text readability, contrast and fine pixel fidelity remain uncertain; static captures do not prove menu/CTA interactions or demo reset in-browser. Completion remains pending native review (inspection stopped at `managed_assets_outdated`; parent provider sync job-7 in progress). Independent verifier is unavailable after two setup attempts exhausted before assertions; only static independent findings are available, not an independent verification pass. No additional tests, browser runs, source changes or real enquiries in this continuation.

L6. Functional verification complete: 274/274 tests, TypeScript, build and responsive browser checks passed. Local boundaries: 1bfb6bf isolates shared-footer option; 5e0e5c8 holds Home implementation and new tests (683 authored changed lines, larger cohesive unit explicitly selected by human); a77a5df holds old-test reconciliation and docs (268 authored changed lines). Unrelated Images deletions and untracked assets excluded from commits. Native review of footer-only committed range b4b520f..1bfb6bf remained stopped: managed_assets_outdated with identical stale digest after provider-issued sync succeeded (job-7 exit0). No repeat sync, authority recovery, review approval, push or publication. Independent verifier runtime proof unavailable after setup budget exhausted; parent exact SSR differential passed. Risk: item 3 (shared footer contract). Feature closure remains blocked by native review/provider tooling; implemented work and local commits are preserved.

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

S10. "me gustaria que el ver nuestro trabajo lo enviara a los proyectos, y que el carrusel ahora este en esa seccion tambien me gustaria que en el home el arbol se viera en la parte atras de las imagenes de los proyectos y que estos tengan un efecto 3d y se vayan moviendo con animacion porfa"

S11. "dejalo arriba do de empieza el arbol y que desde ahi deciendan los demas, y en el inicio o home que ahi se vayan cambiando los proyectos como en la que esta actualmente pero como esta creando en el home" Clarifications selected by user: "El carrusel de Proyectos" ("Moverlo al comienzo de la página Proyectos, antes del catálogo.") and "Alternar proyectos y conceptos" ("Rotar capturas reales y propuestas visuales, manteniendo visibles sus etiquetas correspondientes.").

## Tasks
- T4 [S11; preserve S1-S10 except requested order/artwork rotation] Move projects strip before catalog and rotate real/concept Home cards in existing 3D/tree composition — bounded writer (context backstop) — in_progress; commit pending.
- T3 [S10; preserve S1-S9] Link work CTA to projects, mount retained carousel on projects and animate layered Home collage over visible tree — bounded writer (context backstop) — done; commit dad105f (385 authored changed lines). Native assess: medium, reviewDue=false.
- T1 [S1-S8] Home-only sections, isolated styles, real/concept imagery, preserved demos/footer default — bounded writer (context backstop) — implemented, functional checks passed; native review blocked; commits 1bfb6bf, 5e0e5c8.
- T2 [S1-S9] Reconcile outdated home assertions, independent shared-footer preservation check, production/browser/full suite, docs and local slices — parent + verifier (Risk item 3: shared HomeClosing default) — functional checks/docs complete; native review blocked; commit a77a5df.

## Log
L14. T4/S11 evidence follow-up, docs-only. Parent reports fresh production build job-14 exit 0 and full suite job-16 exit 0, 283/283 passed, zero skips; parent reports browser job-17 exit 0, 100/100. Writer directly read `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gentle-jobs-FQWrRe/job-17.log`: final `HOME_MOTION_BROWSER 100/100 checks passed; zero real enquiries`. At 390/768/1440 it confirms automatic frame advance, truthful labels, tree layering/stagger/3D, pause of floating and content beyond cadence, manual access preserving pause, reduced-motion content freeze, actual CTA and catalog-anchor navigation, strip before catalog with fixed-header clearance, unique h1 and no overflow. Title screenshot bright pixels remain 9754/13987/22141. These are parent-run results/log observations, not writer reruns.

Writer visually inspected `390-home-hero.png`, `768-home-hero.png`, `1440-home-hero.png` in `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/home-motion-browser-VZNA7j`. All three show only frame 1: Bendita Gracia and La Lupe labelled “Web real · Portafolio del equipo”, plus generic salon labelled “Diseño conceptual”. Tree is visible behind the cards; title, both CTAs and all three artwork controls are visible. Mobile stacks the three figures; tablet/desktop retain overlapping depth without obvious outer clipping or obscured labels. Desktop viewport capture is populated, not blank, and includes the entire collage/control row (not the lower hero signature). Mobile controls wrap across two lines without clipping. Visible limitation: existing fixed WhatsApp overlaps part of La Lupe artwork at 390/768, not its label; no source fix attempted. Static captures do not independently prove motion timing, keyboard interaction or fine contrast.

Evidence gap: the artifact directory contains only those three Home screenshots (root `*-*.png` listing); no frame-0 composition (La Lupe/salon/ecommerce) or Proyectos-top screenshot was captured. Therefore writer cannot give a visual pass for both compositions or the projects strip top; that route order/header clearance has browser DOM evidence only. No new capture/check/build/server action, source edit, scratch directory, commit or native review/sync in this follow-up. README's stale pending-check statement updated. T4 commit remains pending for the parent; prior footer managed-assets review blocker remains separate and unchanged. Parent browser artifacts/profile above retained for parent cleanup; unrelated image changes preserved.

L13. Parent S11 verification: production build job-14 exit0; fresh preview job-15 at127.0.0.1:3117; full suite job-16 exit0 with283/283 passing, zero failures/skips. Real browser job-17 is still running, so rotation/paused cadence/reduced-motion and visual proof remain pending. No real enquiries, publication or new commits at this checkpoint.

L12. T4 writer implementation [S11; preserve S1-S10 except requested strip order/artwork rotation]: unchanged ProjectCarousel now starts `/proyectos` before the catalog, using SitePage's existing 76px header clearance and preserving the catalog's sole h1. Home retains tree, three layered 3D slots and stagger; two server-composed bounded frames alternate every 6 seconds. Verified catalog captures are La Lupe and Bendita Gracia, visibly labelled “Web real · Portafolio del equipo”; generic salon/ecommerce remain “Diseño conceptual”. No company-contract claim or expanded La Lupe functionality. Persistent pause freezes content and floating; reduced motion starts static, reacts to preference changes and never clears the user's pause. Manual previous/next keeps both frames available while static. Interval and media listener clean up on unmount. Shared carousel/data/footer/demos/assets/dependencies unchanged.

Observed writer checks: RED `node --test tests/home-artwork-rotation.test.mjs tests/home-mockup-refresh.test.mjs` exit 1, 15/19 passed: missing rotation timer, missing reduced-motion static state, missing manual controls and old projects order/header offset. RED `node --test --test-name-pattern="S11 alternate frame" tests/home-mockup-refresh.test.mjs` exit 1, 0/1 passed (old fixed composition). First focused GREEN attempt exit 1, 20/21: new negative-label assertion accidentally included the unchanged hero's “atraer clientes”; narrowed it to artwork figures (test correction, no product workaround). Final `node --test tests/home-artwork-rotation.test.mjs tests/home-mockup-refresh.test.mjs tests/home-section-order.test.mjs` exit 0, 21/21, zero skips. `node node_modules/typescript/bin/tsc --noEmit --incremental false` exit 0, no output. `node --check scripts/check-home-motion-browser.mjs` exit 0. `git diff --check` exit 0 (LF/CRLF advisories only). New deterministic tests exercise timer cadence/wrap, pause/resume, manual access, preference changes, listener/interval cleanup and exact frame labels through rendered component controls; existing CTA/tree/stagger/demo coverage passes.

Browser checker updated for strip-first/header clearance and live rotation, label correctness, content pause beyond cadence, manual access and reduced-motion content freeze. Existing screenshot pixel assertion and desktop viewport-capture fix preserved. Build, full suite, fresh-preview HTTP checks and runtime browser/screenshot proof remain PENDING and parent-owned; no runtime GREEN or feature closure claimed. Old preview job11/port3117 not stopped or rebuilt; no browser run, new scratch, git commit/push or native sync/review attempted. Previous managed-assets review blocker and unrelated image changes remain untouched.

L9. User request (verbatim): dejalo arriba do de empieza el arbol y que desde ahi deciendan los demas, y en el inicio o home que ahi se vayan cambiando los proyectos como en la que esta actualmente pero como esta creando en el home
L10. User selected "El carrusel de Proyectos" in response to "Cuando decís “arriba donde empieza el árbol y desde ahí desciendan los demás”, ¿qué querés acomodar?" and "Alternar proyectos y conceptos" in response to "Para el Home, ¿querés mantener las tarjetas 3D sobre el árbol, pero que vayan cambiando las capturas automáticamente?". Keep labels truthful; mount carousel first on projects; preserve existing tree/3D composition on Home.

L8. Final S10 closure: commit dad105f isolates this follow-up from prior feature work (base 8a78a56). Parent production build job-10 exited 0; full suite job-12 passed 280/280, zero failures/skips. Browser specificity RED was fixed, then runtime checks passed 82/82 after independently isolating Edge captureBeyondViewport blank desktop evidence to capture mode (both GPU modes affected; viewport captures displayed actual title and tree). New motion/browser proof includes actual CTA navigation, carousel controls/catalog anchor, figure movement and stagger, pause/resume, reduced motion, tree layering and bounds at 390/768/1440. Native committed-range assess returned medium, 12 paths/385 changed lines, reviewDue=false (under_budget), no independent verifier required. Prior shared-footer managed-assets review blocker remains separate and unchanged; no approval claimed for that prior range. Risk: none for S10; existing shared carousel implementation and other shared code unchanged. Local preview job-11 remains http://127.0.0.1:3117. Unrelated image changes preserved; no push/publication. Existing floating WhatsApp can overlap a portion of conceptual salon art at narrow sizes, not the label; its behavior was not changed.

L11. S9/S10 browser evidence closed for this bounded implementation slice: parent reports fresh build job10 exit 0 and full suite job12 exit 0, 280/280 (not rerun by writer). Parent job13 browser exit 1, 80/81, only desktop title screenshot pixels failed. One parent-authorized differential diagnostic, `node C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gaY0b1TL/home-gpu-diagnostic-WafkVN/diagnostic.mjs`, exit 0: two isolated Edge sessions at 1440, identical app state, default GPU versus --disable-gpu; each captured viewport and full-hero beyond-viewport. Viewport title bright pixels 22147 / 22141 respectively; both extended captures 0. In both sessions elementFromPoint at title center returned H1#home-title, title bounds x198/y361, all ancestors opacity 1/visible/transform none, scrollY 0. Writer inspected all four images: viewport captures render the full collage, copy, tree and pause control; extended captures drop the main content but retain fixed nav/background. This demonstrates a capture-mode-dependent Edge/CDP raster issue, not the GPU flag or demonstrated app invisibility. Exact browser compositor internals are not claimed.

Narrow checker-only fix: use viewport capture at desktop, retain extended hero capture on mobile/tablet; add an assertion that all three cards and the motion control lie inside the desktop screenshot. Existing title-pixel, visibility, layout, motion and navigation assertions remain intact; no app CSS/DOM overrides, no product-source change, build/server operation or commit. One corrected `TEST_BASE_URL=http://127.0.0.1:3117 node scripts/check-home-motion-browser.mjs` run exit 0, 82/82 passed, zero real enquiries. Screenshot title pixels 390=9754, 768=13987, 1440=22141. This also directly confirms stagger [-2s,-6s,-10s], stacking [1,2,3], 3D movement, pause/resume, reduced motion, actual CTA/project-anchor navigation and no overflow at all widths.

Writer inspected all three final images in `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gaY0b1TL/home-motion-browser-ZjOcUx`: tree visibly behind the three correctly labelled cards, no card-edge clipping; desktop copy, all three cards and pause control now visible. Existing fixed WhatsApp button overlaps salon artwork on mobile/tablet (not the concept label); no unrelated shared redesign attempted. Desktop capture is viewport-sized and does not claim to show the final few pixels of hero signature below it; all requested collage/control content is included and checked. New diagnostic artifacts/helper/profiles retained at `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gaY0b1TL/home-gpu-diagnostic-WafkVN`; corrected browser artifacts/profile at `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gaY0b1TL/home-motion-browser-ZjOcUx`, for parent cleanup. Previous artifact paths remain in L9/L10. Prior native managed-assets blocker remains preserved; this is self-verification, not review disposition or feature closure.

L10. S10 narrow correction after parent stopped preview job9: scoped desktop and mobile frame selectors as `.collage .captureFrame` / `.collage .salonFrame` / `.collage .shopFrame`, so per-card delays and z-index beat the base figure shorthand/stacking. Mobile depth/tilt override now uses `.collageScene .collage figure` to preserve its 6px depth and modest tilt against those stronger frame selectors; mobile placement selectors retain equal specificity to desktop. Added deterministic regression coverage for the selector precedence, exact delays/z-order and preserved mobile overrides; no redesign or shared component changes.

Observed validation, each run once after this correction: `node --test tests/home-mockup-refresh.test.mjs tests/home-section-order.test.mjs` exit 0, 18/18 passed, zero skips; `node node_modules/typescript/bin/tsc --noEmit --incremental false` exit 0, no output; `node --check scripts/check-home-motion-browser.mjs` exit 0; `git diff --check` exit 0, only LF/CRLF advisories. RED remains the prior actual browser evidence in L9; no new browser GREEN claimed.

Checker synchronization tightened without altering production rendering: subscribe to Page.loadEventFired before navigation (pathname/readyState alone can momentarily match stale document state), log scroll/title/ancestor opacity/visibility/transforms before capture, explicitly scroll Home into view and await paint frames, require visible ancestors/title in viewport, and inspect actual captured title pixels so a blank desktop capture can no longer pass through DOM measurements alone. It also asserts computed stacking [1,2,3]. Relevant source inspection found MotionShell does not set main-content opacity; the existing Reveal first wrapper owns a finite CSS entrance, already awaited. Actual cause of the 1440 blank raster remains unproven without another current-build browser run: off-viewport composited capture/stale navigation synchronization are hypotheses, not an observed production defect. Parent must rebuild/start its preview and execute the checker, inspect the 1440 capture and its CAPTURE_BEFORE/CAPTURE_VISIBLE diagnostics; if still blank it will now fail the pixel assertion. No server/build/browser run in this correction, no new temp artifacts, no commit/provider calls; prior temp artifacts and unrelated assets remain preserved.

L9. S10 browser RED, parent-authorized checker-only follow-up against fresh job9: added `scripts/check-home-motion-browser.mjs` using installed Edge/CDP, no dependencies, browser state/screenshots in system temp, blocked enquiry endpoints. `TEST_BASE_URL=http://127.0.0.1:3117 node scripts/check-home-motion-browser.mjs` first exit 1: 64/69 checks passed; all widths computed delays ["0s","0s","0s"] instead of ["-2s","-6s","-10s"]. Two pause samples were taken before the browser completed pending CSS pauses; corrected checker only to await Animation.ready and existing finite entrance completion, and added card-bound checks. Same command rerun exit 1: 69/72 passed, exactly the three intended stagger failures at 390/768/1440. Confirmed cause: HomeRedesign.module.css:100 `.collage figure` animation shorthand outranks frame-class delay declarations at lines 119/122/123. Computed z-index also equals 1 on all figures because the same specificity issue affects the base z-index declaration at line 99; tree remains behind them at 0. Production source untouched pending parent preview stop/fix decision.

Observed passing browser checks at each width: no page overflow on Home/projects/anchor destination; single h1; tree inside relative collage at opacity .85 below all figures; computed 1200px perspective and matrix3d transforms; all cards change after 200ms animation seek and remain within hero bounds at sampled phase; hero pause freezes all animation, resume restores running; reduced motion sets all figure animation names to none; actual work CTA navigates to /proyectos; catalog precedes strip; strip pause/resume controls work and paused transforms settle; actual strip anchor reaches the unique catalog card. No enquiries, server/build actions, commits, sync/provider calls or production edits.

Writer read all three final screenshots from `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gaAmk416/home-motion-browser-JrpHu2`: 390/768 show the tree visibly behind the collage and no card clipping; existing fixed WhatsApp control overlaps part of salon artwork (not the concept label). The 1440 screenshot is blank main-content/background despite valid DOM measurements, so desktop visual proof is missing, not a pass. Waiting for finite entrance did not fix that capture; likely capture/scroll/compositor synchronization remains to diagnose, not proven production failure. First-run artifacts also remain at `C:/Users/malej/AppData/Local/Temp/gpBYKrzW/gaAmk416/home-motion-browser-qzsyTn` (including unreliable early entrance captures). Both temp folders retain browser profiles/screenshots for parent cleanup. No worktree cache created. Required next proof: parent-authorized specificity fix, fresh build/preview and corrected desktop screenshot/browser rerun; no GREEN claimed.

L8. T3 implementation [S10; preserve S1-S9]: Home work CTA now points to `/proyectos`; that route keeps ProjectsSection first and mounts the unchanged ProjectCarousel afterwards. The decorative tree now belongs to the relative collage layer behind all three preserved, truthfully labelled figures; isolated styles add perspective/depth and staggered 12-second floating with smaller mobile amplitude. A tiny client HeroCollage wrapper supplies persistent pause/resume; reduced-motion CSS disables animation and hides the unnecessary control. No shared component, dependencies, assets, menu, footer, catalog spotlight, or demo implementation changed. README and obsolete HTTP expectations updated without removing coverage.

Writer-observed evidence (commands from project root): RED `node --test tests/home-mockup-refresh.test.mjs` exit 1, 11/16 passed, five intended failures: old CTA destination, missing controlled tree layer, missing 3D motion, missing pause wrapper, missing projects strip. First GREEN attempt `node --test tests/home-mockup-refresh.test.mjs tests/home-section-order.test.mjs` exit 1, 16/17 passed; route assertion encountered cross-VM Array prototype inequality despite correct values, corrected with Array.from (test harness only). Final same command exit 0, 17/17 passed, zero skips. `node --test --test-name-pattern="retained strip helper|strip offset|carousel stops|native anchor|responsive grid" tests/motion-carousel.test.mjs tests/carousel-project-navigation.test.mjs tests/home-brand-card.test.mjs` exit 0, 5/5 passed, zero skips (only deterministic tests selected; HTTP tests not claimed). `node node_modules/typescript/bin/tsc --noEmit --incremental false` exit 0, no output. `git diff --check` exit 0; only LF/CRLF advisories. No scratch/cache created. Parent-owned job3/port3117 and .next left untouched; fresh build, HTTP suites (home-brand-card, section-pages, home-carousel-footer, carousel-project-navigation/motion-carousel), full suite and browser verification remain parent-owned and unrun here. In particular tree visibility, animated transforms, reduced-motion behavior and no clipping at 390/768/1440 still need current-build browser proof for S9/S10. Prior native managed-assets blocker remains preserved; no provider calls/sync, commits or pushes.

L7. User follow-up (verbatim): me gustaria que el ver nuestro trabajo lo enviara a los proyectos, y que el carrusel ahora este en esa seccion tambien me gustaria que en el home el arbol se viera en la parte atras de las imagenes de los proyectos y que estos tengan un efecto 3d y se vayan moviendo con animacion porfa

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

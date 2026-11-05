# Servicios por categoría

Fifteen service category pages, one per mockup in `Images/` (numbered `-1` … `-15`), each its own route under `/servicios/<slug>`, reached from a hover/click submenu on Servicios.
Branch: `feat/rediseno-mockup` (after 1a88297). Proyectos stays exactly as committed.

## Specs

- S1. "ya subi los mockup para los sericios que ofrecemos recuerda dejar cada categoria como otra pagina": each mockup below is one page with its own route, metadata (title, description, canonical, og:url) and sitemap entry. Copy comes from the mockup (headings, cards, plans, process, CTA), with only obvious typos fixed.

  | # | Mockup file | Route | Label (breadcrumb) |
  |---|---|---|---|
  | 1 | `Servicios y planes de e-commerce-1.png` | `/servicios/ecommerce` | E-commerce |
  | 2 | `Sistemas de gestión a medida-2.png` | `/servicios/sistemas-de-gestion` | Sistemas de gestión |
  | 3 | `Datos visibles, decisiones más claras-3.png` | `/servicios/datos-y-analitica` | Datos y analítica |
  | 4 | `Control logístico para cada movimiento-4.png` | `/servicios/logistica` | Logística empresarial |
  | 5 | `Restaurante conectado_ servicios y planes-5.png` + `mockup de restaurantes.png` | `/servicios/restaurantes` | Restaurantes |
  | 6 | `Streaming y redes sociales, todo conectado-6.png` | `/servicios/streaming-y-redes` | Streaming y redes sociales |
  | 7 | `Servicios de videojuegos y planes-7.png` | `/servicios/videojuegos` | Videojuegos |
  | 8 | `Automatización empresarial_ menos tareas, más tiempo-8.png` | `/servicios/automatizacion` | Automatización empresarial |
  | 9 | `Servicios de inteligencia artificial y APIs-9.png` | `/servicios/inteligencia-artificial` | Inteligencia artificial y APIs |
  | 10 | `Cada cita en su lugar-10.png` | `/servicios/reservas-y-citas` | Reservas y citas |
  | 11 | `Tecnología para la gestión agropecuaria-11.png` | `/servicios/agropecuario` | Soluciones agropecuarias |
  | 12 | `Diagnóstico, mantenimiento y soporte técnico-12.png` | `/servicios/soporte-tecnico` | Servicio técnico |
  | 13 | `Servicios y planes para marketplaces-13.png` | `/servicios/marketplaces` | Marketplaces |
  | 14 | `Infraestructura tecnológica para crecer-14.png` | `/servicios/infraestructura` | Infraestructura |
  | 15 | `Servicios web y planes a medida-15.png` | `/servicios/sitios-web` | Webs corporativas e institucionales |

- S2. "y que en el menu se despliegue un sub menu de seervicios": the Servicios item of the side rail opens a submenu with "Todos los servicios" plus the 15 categories on mouse hover or click (click does not navigate); in the mobile drawer tapping Servicios toggles the same list. Escape, outside click and navigation close it; without JavaScript the link still reaches `/servicios`. Same behavior already approved for Proyectos ("me gusta"), now on Servicios.
- S3. "el de restauraante hazz unaa combinacion de los dos mockup subidos": `/servicios/restaurantes` combines mockup 5 (hero, "¿Qué te ofrecemos?", plans with Suscripción / Personalizado · pago único modalities, process, CTA) with `mockup de restaurantes.png` (flow "Del pedido al cierre, sin perder el hilo." Meseros → Cocina y bar → Caja → Inventarios → Administración, its POS conceptual view, and the La Lupe reference shown with its original project image and real description, linking to `/proyectos#equipo-la-lupe`).
- S4. Shared layout per mockup: breadcrumb Inicio / Servicios / <label>, "Volver a servicios" link to `/servicios#categorias`, hero art and conceptual view cropped from the mockup (conceptual views labelled "Vista conceptual"; hero art decorative), every plan shows "Por cotizar", notes under the plans, four-step process, CTA to `/contacto`, closing with the shared HomeClosing footer. `/servicios` gains a "categorias" section linking all 15 pages; its existing content stays.
- S5. Proyectos (menu, catalog, routes) remain exactly as in 1a88297 (L1 of the previous request: "deja tal cual como estaban los proyectos").

## Tasks

- T1 [S1, S4] Crop hero art and conceptual view from the 15 mockups (plus the old restaurant POS) into `public/images/services/` — worker — commit: 8601751 (done; 30 webp, 17-91 KB, visually checked)
- T2 [S1, S3, S4] Category data, shared page template, route, `/servicios` categories section, sitemap, tests — commit: pending
- T3 [S2] Servicios submenu (desktop hover/click, mobile toggle), tests — commit: pending
- T4 [S1-S5] Verify: build, full suite on `next start`, browser check 390/1440, visual comparison with mockups; README — commit: pending

## Log

- L1 (user, verbatim): "ya subi los mockup para los sericios que ofrecemos recuerda dejar cada categoria como otra pagina y que en el menu se despliegue un sub menu de seervicios el de restauraante hazz unaa combinacion de los dos mockup subidos"
- L3 (evidence): branch commit-slice counter reports 11.5k lines since origin/main because origin (jorge-puentes-b) is far behind; publication goes to treesside/main. This feature's slices: 8601751 (T1 art), then T2+T3 code.
- L4 (evidence): RED before implementation: tests/service-categories.test.mjs 18 fail / 1 pass (Proyectos unchanged); tests/services-submenu.test.mjs 2 fail. T2 data for #2-#8 and #9-#15 delegated to two background workers with disjoint files; #1 ecommerce, template, types, index, /servicios section and sitemap inline.
- L2 (user, earlier verbatim): "no sigas con los bakups haremos otro cambios mejor restablece a lo que teniamos anttes de empezar edeja tal cual como estaban los proyectos porfa" — restored to 1a88297; build OK, 205/205.

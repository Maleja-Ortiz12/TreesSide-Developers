# Rediseño según mockup

Redesign the whole site following `Images/Mockups pagina.png` (Proyectos page mockup, TreesSide brand), keeping existing content and images.
Branch: `feat/rediseno-mockup` (after 061727f). Pre-existing uncommitted work on main (carousel → `/proyectos#id`, static share image) is left uncommitted and its behavior preserved.

## Specs

- S1. "en la raiz del proyecto ssubbi unos mockups para rediseñar la pagina porrfa guiate en estos backups" + decision (L2) "Todo el sitio con este estilo": every page adopts the mockup's visual language (dark green glass cards, mint accent, pill navigation, kicker with trailing line, circuit connectors, pill CTA, single-row footer).
- S2. "toma la informaacion que ya tgenemos sin cambiarla": texts, projects, categories, authors, links and contact data stay as they are; mockup copy that differs (e.g. "Ideas que ya están funcionando.", "Sitio web conceptual" for La Lupe, "Herramienta web 3D" for the calculator) is not used.
- S3. "e imagaanes solo adapatla al nuevo diseño": only images already in the project are used, placed in the new layout; no new images.
- S4. Decision (L9) "en las caategorias dividelo por restaurantes, juegos, datos, eccomerce": /proyectos filters are Todos / Restaurantes / Juegos / Datos / E-commerce; projects outside those groups appear only under Todos.
- S6. Decision (L7) "Sí, árbol e ilustraciones", corrected by L9 "en la lupe y en floraltech no pusiste las imagenes originales las ue ya existian de los prfoyhectos arregalo porfa": the 3D tree and rocks plus the Emisoras Latinas, Calculadora de contenedores and Ocho80 illustrations come from the mockup (labeled conceptual); La Lupe and Floraltech keep their original project images.
- S7. Decision (L7) "Mantener el carrusel": the featured card keeps rotating, with a cleaner mockup-like layout and no visible control bar.
- S8. Decision (L7) "Los 31, tarjetas compactas": all projects stay, cards show title, group · category, short description and "Ver proyecto"; authors and portfolios move to the detail modal.
- S9. "ahora has el diseño del home con el backup que tte acabo de subir del home esta en la carpeta images de la raiz del proyecto": the home page (/) follows `Images/Mockup del home.png` section by section: hero (tree art with floating demo cards, tabs Restaurantes / Streaming / Logística, "01 / EXPLORA"), stats band, "Menos promesas. Más cosas que puedes probar." demos + two project cards, and the closing "Lo que sigue, lo construimos contigo." block with WhatsApp / Correo / Proyectos path, "Hablemos" circle and giant outlined "TreesSide".
- S10. Decision (L10) "Los del mockup": the home uses the mockup's copy ("Tu próxima idea merece cobrar vida.", its paragraph, "Construyamos tu proyecto", "Explorar demos", "Menos promesas. Más cosas que puedes probar.", "Lo que sigue, lo construimos contigo.", "Hablemos"). Counts, contact data and projects stay the real ones.
- S11. Decision (L10) "Lateral en todo el sitio": every page uses the mockup's vertical side navigation (icons + labels, all existing pages reachable) and its top bar (logo, "ESTUDIO DE SOFTWARE · COLOMBIA", "Hablemos" button); phones keep a menu button ("Abrir menú").
- S12. Decision (L10) "Solo lo del mockup": the home drops the four service cards, the project strip, the plans preview and the demos other than the three in the hero tabs (La Lupe, Emisoras Latinas, Calculadora de contenedores); those contents stay on their own pages.
- S13. Decision (L10) "Reales dentro de un laptop": the La Lupe and Emisoras Latinas cards on the home show their real project images inside a CSS laptop frame.
- S5. Existing behavior keeps working: spotlight autoplay/keys/focus, carousel links to `/proyectos#id`, project modal, reduced motion, no horizontal scroll on phones.

## Tasks

- T1 [S1, S3] Global theme tokens, cards, buttons, kicker, background — inline — commit: a5c90d5, 773acf1 (done)
- T2 [S1, S2] Pill navbar and mockup footer (all links and contact data kept) — inline — commit: cdb4239 (done)
- T3 [S1–S5] Proyectos page: hero, 4 group filters, featured spotlight card, horizontal cards with connectors, CTA — inline — commit: 9048cc4, 6215445 (done)
- T4 [S1, S3] Home hero and section headers with the mockup hero pattern — inline — commit: 6215445 (done; section headers adopt the pattern through the global kicker/title in a5c90d5)
- T5 [S1–S5] Verify: build, full test suite, desktop/mobile screenshots, mobile overflow check — inline — commit: n/a (done)
- T6 [S6] Crop mockup art into public/images/mockup/ — inline — commit: 7510544 (done)
- T7 [S6, S7, S8] Proyectos page fidelity pass: art, compact cards, clean spotlight, CTA backdrop — inline — commit: 7510544 (done)
- T8 [S5-S8] Verify: build, tests, mobile check, side-by-side with mockup — inline — commit: n/a (done)
- T9 [S4, S6] Restore La Lupe/Floraltech images and switch filters to Restaurantes/Juegos/Datos/E-commerce — inline — commit: af6236c (done)
- T10 [S11] Site-wide side navigation and top bar — inline — commit: 4870c09 (done; 158/158, mobile PASS)
- T11 [S9, S13] Crop home mockup art (hero tree with cards, closing roots) — inline — commit: edd81c9 (done: public/images/mockup/home-hero.webp 1316x872, home-roots.webp 566x740 with the Hablemos circle at its center, redrawn in CSS on top)
- T12 [S9, S10, S12, S13] Home page rebuild per mockup, home tests updated — gentle-ai-worker — commit: pending
- T13 [S5, S9-S13] Verify: build, full suite, mobile check, side-by-side with the home mockup — inline — commit: n/a

## Log

- L1 (user, verbatim): "en la raiz del proyecto ssubbi unos mockups para rediseñar la pagina porrfa guiate en estos backups y toma la informaacion que ya tgenemos sin cambiarla e imagaanes solo adapatla al nuevo diseño"
- L2 (user decisions): scope → "Todo el sitio con este estilo"; filters → "4 grupos del mockup (Recomendado)".
- L3 (evidence): baseline on 061727f + uncommitted work: `npm run build` OK, 155/155 tests pass.
- L4 (evidence): slice boundary — branch counter includes 50+ prior commits since origin/main; this feature's own slices are a5c90d5 (~200 lines), 773acf1, cdb4239 (~300 lines). ProjectsSection.tsx carries pre-existing anchor hunks (id, scrollMarginTop, :target) that T3 keeps and commits with the rewrite.
- L5 (requirement change from L2 "4 grupos del mockup"): the earlier "Proyectos del equipo" / "Experiencia laboral" filter chips are replaced by Todos / Web / Aplicaciones / Datos; team vs. employer attribution stays on every card. Tests updated in 9048cc4 (chips, attribution label) plus a new S4 grouping test. Grouping: Web = Sitios web, Web & E-Commerce, Radio web, Marketplaces; Datos = Análisis de datos; Aplicaciones = everything else (including RPA and Tiempo real).
- L6 (evidence): final build OK, tsc OK, 156/156 tests on `next start`, `scripts/check-mobile-browser.mjs` PASS (no horizontal scroll at 360/390 on every page). Mockup copy not used per S2 (hero title, CTA copy, "conceptual" labels). /equipo keeps its own minimal footer (earlier design). Tree artwork reuses public/images/treesside-logo.webp (S3).
- L7 (user, verbatim): "no se parece en nada a los mockups no los encontraste estan en la carpeta raiz con el nombre images". Only `Images/Mockups pagina.png` exists there (the one used). Decisions: images → "Sí, árbol e ilustraciones (Recomendado)"; featured → "Mantener el carrusel"; projects → "Los 31, tarjetas compactas".
- L8 (evidence): 7510544 — build OK, tsc OK, 157/157 tests on next start, check-mobile-browser PASS. Requirement change S8: card-level author/portfolio assertions in member-ramirez, portfolio-catalog, portfolio-projects, project-spotlight, ramirez-new-projects now check the served catalog bundle and the modal source; employer cards keep a visible "Experiencia laboral" label. Mockup logo icon not used: brand test pins the current header logo and it was outside the L7 decision. Crop script lives in ../_scratch_portfolio_tools/crop_mockup.py (not committed).
- L9 (user, verbatim): "vale pero en la lupe y en floraltech no pusiste las imagenes originales las ue ya existian de los prfoyhectos arregalo porfa y en las caategorias dividelo por restaurantes, juegos, datos, eccomerce". Grouping: Restaurantes = La Lupe; Juegos = Videojuegos + Gametroz + Ocho80; Datos = Análisis de datos; E-commerce = Web & E-Commerce. RED observed (4 tests), then 158/158 and check-mobile-browser PASS.
- L10 (user, verbatim): "ahora has el diseño del home con el backup que tte acabo de subir del home esta en la carpeta images de la raiz del proyecto". File: `Images/Mockup del home.png`. Decisions: texts → "Los del mockup (Recomendado)"; navigation → "Lateral en todo el sitio"; sections → "Solo lo del mockup (Recomendado)"; images → "Reales dentro de un laptop (Recomendado)". The user deleted the two old media_*.jpg from Images/ (left untouched).

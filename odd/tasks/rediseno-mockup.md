# Rediseño según mockup

Redesign the whole site following `Images/Mockups pagina.png` (Proyectos page mockup, TreesSide brand), keeping existing content and images.
Branch: `feat/rediseno-mockup` (after 061727f). Pre-existing uncommitted work on main (carousel → `/proyectos#id`, static share image) is left uncommitted and its behavior preserved.

## Specs

- S1. "en la raiz del proyecto ssubbi unos mockups para rediseñar la pagina porrfa guiate en estos backups" + decision (L2) "Todo el sitio con este estilo": every page adopts the mockup's visual language (dark green glass cards, mint accent, pill navigation, kicker with trailing line, circuit connectors, pill CTA, single-row footer).
- S2. "toma la informaacion que ya tgenemos sin cambiarla": texts, projects, categories, authors, links and contact data stay as they are; mockup copy that differs (e.g. "Ideas que ya están funcionando.", "Sitio web conceptual" for La Lupe, "Herramienta web 3D" for the calculator) is not used.
- S3. "e imagaanes solo adapatla al nuevo diseño": only images already in the project are used, placed in the new layout; no new images.
- S4. Decision (L2) "4 grupos del mockup": /proyectos filters are Todos / Web / Aplicaciones / Datos, grouping the real categories; all projects are shown.
- S5. Existing behavior keeps working: spotlight autoplay/keys/focus, carousel links to `/proyectos#id`, project modal, reduced motion, no horizontal scroll on phones.

## Tasks

- T1 [S1, S3] Global theme tokens, cards, buttons, kicker, background — inline — commit: pending
- T2 [S1, S2] Pill navbar and mockup footer (all links and contact data kept) — inline — commit: pending
- T3 [S1–S5] Proyectos page: hero, 4 group filters, featured spotlight card, horizontal cards with connectors, CTA — inline — commit: pending
- T4 [S1, S3] Home hero and section headers with the mockup hero pattern — inline — commit: pending
- T5 [S1–S5] Verify: build, full test suite, desktop/mobile screenshots, mobile overflow check — inline — commit: n/a

## Log

- L1 (user, verbatim): "en la raiz del proyecto ssubbi unos mockups para rediseñar la pagina porrfa guiate en estos backups y toma la informaacion que ya tgenemos sin cambiarla e imagaanes solo adapatla al nuevo diseño"
- L2 (user decisions): scope → "Todo el sitio con este estilo"; filters → "4 grupos del mockup (Recomendado)".
- L3 (evidence): baseline on 061727f + uncommitted work: `npm run build` OK, 155/155 tests pass.

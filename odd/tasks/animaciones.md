# Animaciones en todo el sitio

Add noticeable motion to every page with Framer Motion (published as `motion`): scroll reveals, 3D card tilt,
a home project image carousel and a parallax background, always honoring reduced-motion preferences.
Branch: `feat/animaciones` (from `feat/demos-proyectos`, commit f19d460).

## Specs

- S1. User request (L1): "me gusta prto si quisiera que toda la pagina tuiera mas animacion, mas movimiento, como carruseles de imagenes movimiento D3D".
- S2. Decision (L2): "Carrusel de proyectos en la home" — an endless strip of real project images that moves on its own and pauses on hover.
- S3. Decision (L2): "Aparecer al hacer scroll" — sections and cards enter with fade, slide or 3D depth when they reach the screen, on every page.
- S4. Decision (L2): "Inclinación 3D en las cards" — demo, service and project cards tilt in 3D following the mouse, like the hero card.
- S5. Decision (L2): "Fondo con profundidad (parallax)" — background layers move at different speeds with scroll and mouse.
- S6. Decision (L2): "Agregar Framer Motion"; intensity "Notorio" ("La página se siente viva en cada sección").
- S7. Constraint: users who ask the system to reduce motion get no tilt, parallax or carousel movement, and content stays readable without JavaScript animations.

## Tasks

- T1 [S3, S6, S7] `motion` dependency, reduced-motion config and scroll reveal on every page — inline — commit: 7e77d4b (done)
- T2 [S4, S7] 3D tilt for demo, service and project cards — inline — commit: a06947d (done)
- T3 [S2, S7] Home project image carousel — inline — commit: bfa8da8 (done)
- T4 [S5, S7] Parallax background layers — inline — commit: b51f779 (done)
- T5 [S1-S7] Independent verification (dependency added = high risk) — gentle-ai-verify — fixes: b642bcb, 6b53f46 (done)

## Log

- L1. "me gusta prto si quisiera que toda la pagina tuiera mas animacion, mas movimiento, como carruseles de imagenes movimiento D3D"
- L2. Answers: types "Carrusel de proyectos en la home, Aparecer al hacer scroll, Inclinación 3D en las cards, Fondo con profundidad (parallax)"; technology "Agregar Framer Motion"; intensity "Notorio".
- L3. Note: files with someone else's uncommitted work (globals.css, ProjectsSection.tsx, AboutSection.tsx, TeamGallery.module.css, nosotros/page.tsx, ProjectSpotlight.*) are not edited; motion is added through new components instead.
- L4. Verification (gentle-ai-verify): first pass found a blocker — every section served with inline opacity:0 (invisible without JavaScript, blank hero until hydration) — plus minors (carousel spring drift under reduced motion, tilt stuck on wheel scroll/leaving window). Fixed in b642bcb (first section CSS-only entrance, noscript fallback, spring from rest, release on scroll/blur) and 6b53f46 (pointerout instead of document pointerleave). Re-verification: S3, S4, S7 PASS, no new defects. Suite 100/100, tsc clean, `next build` OK (home 192 kB first load).
- L5. Open advisories: package-lock.json lost `libc` fields on sharp/swc optional packages (npm version difference); carousel copies ~2560 px wide may show a gap on wider screens.

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

- T1 [S3, S6, S7] `motion` dependency, reduced-motion config and scroll reveal on every page — inline — commit: pending
- T2 [S4, S7] 3D tilt for demo, service and project cards — inline — commit: pending
- T3 [S2, S7] Home project image carousel — inline — commit: pending
- T4 [S5, S7] Parallax background layers — inline — commit: pending
- T5 [S1-S7] Independent verification (dependency added = high risk) — gentle-ai-verify — commit: n/a

## Log

- L1. "me gusta prto si quisiera que toda la pagina tuiera mas animacion, mas movimiento, como carruseles de imagenes movimiento D3D"
- L2. Answers: types "Carrusel de proyectos en la home, Aparecer al hacer scroll, Inclinación 3D en las cards, Fondo con profundidad (parallax)"; technology "Agregar Framer Motion"; intensity "Notorio".
- L3. Note: files with someone else's uncommitted work (globals.css, ProjectsSection.tsx, AboutSection.tsx, TeamGallery.module.css, nosotros/page.tsx, ProjectSpotlight.*) are not edited; motion is added through new components instead.

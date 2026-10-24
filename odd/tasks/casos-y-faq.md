# Casos de éxito, preguntas frecuentes y detalles técnicos

Add case study pages for three real projects, a FAQ section, and close the technical leftovers from earlier
features (per-page share URL, carousel gap on very wide screens, package-lock libc churn).
Branch: `feat/casos-y-faq` (from `feat/contacto-y-seo`, commit fb3ec27).

## Specs

- S1. User request (L1): "Vale por el momento aun no podemos hacer lo datos legales estamos en ese proceso pero podemoss avanzar con otras cosas".
- S2. Decision (L2): "Páginas de casos de éxito" — "Una página por proyecto (empezando por La Lupe, Emisoras Latinas y TengoYa) con contexto, problema, solución, tecnologías y resultado. Redacto con lo que ya hay; ustedes corrigen cifras." Only facts already published in the catalog or on the live sites; no invented metrics.
- S3. Decision (L2): "Preguntas frecuentes" — "Sección FAQ: tiempos, dueño del código, soporte, pagos. Redacto un borrador y ustedes confirman las respuestas de política comercial." Answers must not commit to prices, deadlines or terms the team has not confirmed.
- S4. Decision (L2): "Detalles técnicos pendientes" — "Tarjeta de compartir con la URL correcta en cada subpágina, hueco del carrusel en pantallas muy anchas y el package-lock regenerado."
- S5. Legal data (legal name, NIT, address) stays pending (L1); nothing in this feature depends on it.

## Tasks

- T1 [S4] Per-page canonical and share URL — inline — commit: pending
- T2 [S4] Carousel strip wide enough for very wide screens — inline — commit: pending
- T3 [S4] package-lock.json with the libc fields restored — inline — commit: pending
- T4 [S2] Case study pages for La Lupe, Emisoras Latinas and TengoYa, linked from the site and the sitemap — inline — commit: pending
- T5 [S3] FAQ section with FAQPage structured data — inline — commit: pending
- T6 [S2-S4] Independent verification (lockfile = dependency change) — gentle-ai-verify — commit: n/a

## Log

- L1. "Vale por el momento aun no podemos hacer lo datos legales estamos en ese proceso pero podemoss avanzar con otras cosas"
- L2. Selected: "Páginas de casos de éxito", "Preguntas frecuentes", "Detalles técnicos pendientes" (not the quote calculator).
- L3. Note: src/app/nosotros/page.tsx has someone else's uncommitted one-line description change; commits stage only this feature's hunk.

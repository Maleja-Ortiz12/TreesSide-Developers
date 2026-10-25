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

- T1 [S4] Per-page canonical and share URL — inline — commit: a71c2b9 (done)
- T2 [S4] Carousel strip wide enough for very wide screens — inline — commit: a262a0f (done)
- T3 [S4] package-lock.json with the libc fields restored — inline — commit: 6ece0a1 (done)
- T4 [S2] Case study pages for La Lupe, Emisoras Latinas and TengoYa, linked from the site and the sitemap — inline — commit: 81abdeb (done)
- T5 [S3] FAQ section with FAQPage structured data — inline — commit: f4fac3c (done)
- T6 [S2-S4] Independent verification (lockfile = dependency change) — gentle-ai-verify — fix commit: aac4658 (done; independent findings addressed, regression suite green)

## Log

- L1. "Vale por el momento aun no podemos hacer lo datos legales estamos en ese proceso pero podemoss avanzar con otras cosas"
- L2. Selected: "Páginas de casos de éxito", "Preguntas frecuentes", "Detalles técnicos pendientes" (not the quote calculator).
- L3. Note: src/app/nosotros/page.tsx has someone else's uncommitted one-line description change; commits stage only this feature's hunk.
- L4. Independent verifier: 132 tests passed and tsc clean; found an unsupported Emisoras claim, home canonical leaking to 404s, and generic Twitter metadata. Regression tests observed RED; corrected in aac4658. Final suite: 136 passed, 0 failed (TEST_EXIT=0), typecheck TYPE_EXIT=0. No second independent pass or browser visual check was performed after this correction. Production build passed before the correction.
- L5. Native RDD assessment unavailable even with a committed-only range: native refuses undeclared untracked files belonging to existing unrelated work. No native review approval claimed. Legal details and live Formspree delivery remain pending from the preceding feature.

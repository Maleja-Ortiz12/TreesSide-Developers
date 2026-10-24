# Contacto real, política de datos y SEO técnico

Make the contact form deliver messages through Formspree, use the real contact data and brand, publish the
personal data policy required in Colombia, and add technical SEO plus a floating WhatsApp button.
Branch: `feat/contacto-y-seo` (from `feat/animaciones`, commit 01f3753).

## Specs

- S1. User data (L2): "aun no tenemos redes sociales pero si tenemos un correo que es correo@softzenkododevs.com y el telefono pon mientras este 3057173986 el nombre definitivo es TreesSide" — no social links anywhere; email correo@softzenkododevs.com; phone/WhatsApp 3057173986 (+57); brand TreesSide.
- S2. Decision (L3): form delivery "Formspree (Recomendado)". The form must never report success unless Formspree accepted the message; while the Formspree form ID is not configured it offers email and WhatsApp instead.
- S3. Priority 1 (L1 proposal, accepted in L3): personal data policy page (Ley 1581 de 2012) and an unchecked consent checkbox required to send the form.
- S4. Decision (L3): "Sí, prioridad 1 y 2" — sitemap, robots, structured data (JSON-LD), share image (Open Graph) and a floating WhatsApp button.

## Tasks

- T1 [S1] Real phone/WhatsApp, social links removed, footer contact column — inline — commit: 862d7f9 (done)
- T2 [S2, S3] Formspree delivery with honest states, consent checkbox, spam honeypot — inline — commit: 737a21f (done)
- T3 [S3] Personal data policy page linked from the form and footer — inline — commit: fe30af6 (done)
- T4 [S4] sitemap.xml, robots.txt, JSON-LD Organization, Open Graph image — inline — commit: 554edac (done)
- T5 [S4] Floating WhatsApp button on every page — inline — commit: b071c8d (done)
- T6 [S1-S4] Independent verification (personal data sent to a third party) — gentle-ai-verify — fixes: afca9ad (done)

## Log

- L1. Gap analysis proposal: priority 1 "Formulario real (Resend o Formspree) + datos de contacto reales + política de datos y casilla de consentimiento"; priority 2 "Sitemap, robots, JSON-LD, OG image y botón de WhatsApp".
- L2. "aun no tenemos redes sociales pero si tenemos un correo que es correo@softzenkododevs.com y el telefono pon mientras este 3057173986 el nombre definitivo es TreesSide"
- L3. Answers: form "Formspree (Recomendado)"; scope "Sí, prioridad 1 y 2".
- L4. Pending from the team: Formspree form ID (set `NEXT_PUBLIC_FORMSPREE_FORM_ID` in Netlify); legal name/NIT/city for the policy if they have them.
- L5. Verification (gentle-ai-verify): S1-S4 PASS, no blocker/major. Minors fixed in the T6 fix commit (Ley 1581 arts. 14-15 extension/incomplete-claim terms, footer bottom room on phones) plus its suggested probes. Suite 122/122, tsc clean, `next build` OK; production og:image = https://softzenkododevs.com/opengraph-image.
- L6. Open: live Formspree submission untested until the form ID is set (form settings like reCAPTCHA can reject AJAX; the form then shows the honest error); policy lacks legal name/NIT/street address (Decreto 1377 art. 13 a); og:url is the home URL on subpages (pre-existing).

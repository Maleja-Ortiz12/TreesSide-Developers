# Home · administrative visual proposals

The independent `AdminConceptShowcase` follows the existing public-site proposals in `#propuestas`. It contains static, locally designed interfaces, not working products or delivered customer capabilities.

- **ALBA** retains the fictional salon identity. Role identifiers A1–A4 avoid personal records; employee roles, shifts, availability and an appointment schedule appear alongside a mobile professional agenda.
- **BRASA · cocina de barrio** is a separate fictional restaurant, unrelated to La Lupe. Open orders, kitchen tickets, a partial cash-register summary in COP and staff stations share illustrative data. Cash reconciles: 180,000 cash + 300,000 card = 480,000 sales; 100,000 opening float + 180,000 cash − 0 outgoings = 280,000 expected cash.
- Both assets and their persistent DOM captions say **Diseño conceptual · Datos de ejemplo**. The component explicitly disclaims functionality delivered to La Lupe. Existing La Lupe proof, ALBA public-site views and TEC artwork are not replaced.
- An additional conceptual hero frame exposes ALBA administration, BRASA administration and the existing technology store. No portfolio records or eligibility filters change; the initial frame and all existing project batches remain.
- CTAs use existing contextual contact routes; no fake website, transaction or backend interaction is introduced.

## Reproduce assets

```sh
node scripts/render-admin-concepts.mjs
node --test tests/home-admin-concepts.test.mjs
```

Requires the already available `sharp` and installed Edge. Optional `BROWSER_EXECUTABLE` or `EDGE_PATH` selects the browser. The renderer uses self-contained template input, CDP and file URLs, with scratch/profile directories in the OS temp directory and teardown. It makes no external requests and does not touch the older concept renderer or templates. Output: two 1600 × 1200 optimized WebP files.

## Parent-owned fresh-preview verification

Only after a new preview includes these changes:

```sh
TEST_BASE_URL=http://127.0.0.1:PORT node scripts/check-home-admin-browser.mjs
```

The read-only checker measures the public DOM at 390, 768 and 1440 pixels, original image dimensions, contain/aspect ratio, horizontal bounds, persistent sample labels, contact hrefs, concept ordering and retained La Lupe features. It saves six viewport screenshots and measurements in the printed OS-temp evidence directory. It never starts a server, clicks CTAs or submits forms, and blocks external/non-read requests. The parent owns evidence-directory cleanup and visual review. The old live preview is not evidence for this change.

The checker tolerates only one interception error: "Invalid InterceptionId" on a safe same-origin GET/HEAD request that the browser itself reported as canceled (`Network.loadingFailed` with `canceled`). Any other interception error, or any error on a blocked request, still fails the check.

Fresh-preview evidence (production build, `next start` on port 3117): full suite 306/306, `check-home-admin-browser` 34/34, `check-home-motion-browser` 672/672 and `check-home-centering-browser` 156/156, all with zero real enquiries. Screenshots reviewed: Home frames 0 and 7 at 1440 and frame 7 at 390, plus BRASA at 768. The primary artwork stays fully visible above the two secondary cards. The existing floating WhatsApp button still overlaps part of a card on mobile.

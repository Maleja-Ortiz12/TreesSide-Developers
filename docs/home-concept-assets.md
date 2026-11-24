# Home conceptual interfaces

Production assets for S2–S6 of `odd/tasks/home-centering-concept-mockups.md` (T2).

These are locally designed and Edge-rendered interfaces using stock photographs, **not newly AI-generated photography**, delivered websites, client identities, testimonials, or performance evidence. ALBA and TEC are fictional proposal identities (the earlier Arcilla ceramics direction is superseded). Artwork is non-interactive; only the surrounding Home enquiry links are real actions. No real enquiry was sent.

## Composition and integration

- `public/images/home-concepts/salon.webp`: warm editorial salon, desktop home, services and mobile; 1600 × 1200, 121,818 bytes.
- `public/images/home-concepts/shop.webp`: graphite/electric-cyan technology store, desktop landing, guided audio catalog/comparison and mobile; 1600 × 1200, 113,042 bytes.
- Each production composition has three coordinated views, photography, navigation, service/product categories and a primary visual action. No invented sales figures, reviews or client claims.
- `ConceptShowcase.tsx` presents full uncropped compositions with persistent textual conceptual labels, accessible descriptions, fictional-identity disclosure, view labels, and the original enquiry text/destinations. Cards become single-column below 800px; artwork retains its aspect ratio.
- Hero conceptual slots reuse these same assets without changing real-project eligibility, batch ordering, La Lupe artwork/copy, or real frames. Thumbnail images use contain rather than cropping the phone/catalog. The detailed proposal section is the primary reading surface; thumbnail microcopy is not essential content.
- TreesSet's surrounding light section, typography, menu and shared footer are unchanged. The technology revision only adjusts the hero artwork track/width in `HomeRedesign.module.css`.

## Stock provenance

The three original selected pages explicitly identified a free HD photo and `asset_type: photo`, `premium: false`, `plus: false` in the fetched page metadata. Downloaded images were visually inspected: salon interior with mirrors/chairs and decorative neon lettering, unbranded ceramic vases, and stacked unbranded ceramic cups. No recognizable people or commercial logos were observed. They are used only as illustrative stock, never represented as the fictional business's actual premises or merchandise.

License: [Unsplash License](https://unsplash.com/license), which permits commercial use, downloading, modification and distribution without required attribution. Attribution is retained here. The license does **not** provide model/property/trademark releases or guarantee every other right; review those separately for any future real client rollout.

| Local stock file | Photographer | Exact photo page | Exact downloaded URL |
| --- | --- | --- | --- |
| `salon-stock.webp` | Giorgio Trovato | https://unsplash.com/photos/a-hair-salon-with-chairs-and-a-mirror-u-jq0g_ZdZE | https://images.unsplash.com/photo-1637777277435-3c44f82fd0c9?w=1600&q=85&fit=max&fm=jpg |
| `vases-stock.webp` | Yana Hurska | https://unsplash.com/photos/3-brown-clay-vases-on-white-concrete-table-zeGT9j4ltRA | https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1600&q=85&fit=max&fm=jpg |
| `mug-stock.webp` | Diana Light | https://unsplash.com/photos/white-ceramic-mug-on-white-table-u_jt9A7FADk | https://images.unsplash.com/photo-1590422749897-47036da0b0ff?w=1000&q=85&fit=max&fm=jpg |

The proposed Ela De Pure skincare pages (`lGxeKOA6aps`, `aTyW35_SeOI`) were fetched but not used: their descriptions explicitly identify branded products and their recent studio imagery was not an appropriate basis for an unbranded photographic proposal. Two short plant-photo URLs and a search API returned no usable page data; the accessible public pottery search provided the alternatives above. No sibling-repository business assets were accessed or reused. Source metadata and visual inspection are evidence of photographic stock classification, not forensic proof of camera provenance.

## Technology revision — S1–S2 (`technology-concept-jorge-projects.md`, T1)

TEC uses an independent `technology-shop.mjs` template, not the salon's editorial layout: search-led header, category navigation, side index, product showcase and a catalog filter rail with connection-comparison table. Mobile stacks search, categories, product and action. The table is explicitly a general buying guide, **not** fabricated specifications for the photographed item. There are no fictional product brands, prices, client claims or performance figures. The same licensed headphone photograph is used across the three coordinated views; Gaming/Accessories are navigation directions, not invented photographed inventory. This remains static illustrative artwork, not a functional shop.

New stock: `public/images/home-concepts/tech-stock.webp`, photographer **C D-X (@cdx2)**. Exact page: https://unsplash.com/photos/PDX_a_82obo (title: “Flatlay photography of wireless headphones”). Exact download: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85&fit=max&fm=jpg . License: https://unsplash.com/license . Both page and license returned HTTP 200; the page explicitly says “Free to use under the Unsplash License” and its metadata identifies `asset_type: photo`, `premium: false`, `plus: false`, and C D-X. The rendered photograph was visually inspected: black headphones on yellow, no people or recognizable commercial logos observed. No sibling assets or image generation were used. An attempted public search endpoint returned a browser-check HTML page rather than JSON; it supplied no assets.

Shop-only reproduction: `node scripts/render-home-concepts.mjs --concept shop`. `--concept salon` selects only the original salon; omitting the option retains the default salon+shop pair. Selection filters source downloads and both HTML/capture write loops; capture logic itself is unchanged. Invalid/missing selector values fail before writes. Do not run the default full render when salon byte preservation is required. The default download-only mode and both composition calls are tested without rerendering salon.

The hero now uses its entire artwork track instead of a viewport-height width clamp, with .85:1.25 grid tracks. At 1440px, the existing 1200px container minus 48px horizontal padding and 32px gap yields about 667px for the scene, versus the previous 468px at 768px height and 600px at 900px height. These are CSS geometry calculations, not fresh application-browser measurements. Intrinsic height, grid centering, header/rail accounting, tablet/mobile rules, controls, pause and reduced-motion behavior remain unchanged; short viewports may use natural document flow. Fresh integrated centering/rotation checks remain parent-owned because the existing preview is stale.

Salon SHA-256 preservation is pinned in the dedicated test: HTML `9659b6396121519284c3458b36db8afc6475a0a6cc6a3ae678ec2c64dddab74b`; WebP `48fcd7258781748d87b704d09e50e18e5589d38b6a1af56ceedf9ea823aa4a15`. The stock/render inputs are self-contained. Existing vases/mug stock and historical evidence below are retained, not deleted.

## Reproduction

From the repository root, with existing Node, sharp and installed Microsoft Edge:

```sh
node scripts/render-home-concepts.mjs --download-only
node scripts/render-home-concepts.mjs
node --test tests/home-concept-mockups.test.mjs
```

`--download-only` retrieves missing stock and optimizes it to WebP. Existing local stock is reused, so normal rerenders need no external network. `scripts/home-concepts/template.mjs` (delegating shop to `technology-shop.mjs`) generates the checked-in, self-contained `salon.html` and `shop.html` inputs with embedded base64 photographs and system fonts: no remote images, fonts or runtime requests. These are the actual inputs captured for the production assets, not separate approval artboards.

The renderer opens its own headless Edge/CDP instance on an OS-selected port, uses a fresh OS-temp browser profile, renders file URLs at 1600 × 1200, waits for image/font decoding, captures PNG in memory and encodes WebP using existing sharp. Set `EDGE_PATH` if Edge is installed elsewhere. It closes its socket and stops its own browser; it prints the profile path for parent-owned cleanup. It does not use the site's server, `.next`, or the parent's preview browser. Runtime JSX uses local production images only.

## Evidence and boundaries

Focused structural tests observed RED (missing component and production assets), then GREEN (2/2). They check conceptual labels, original CTA text/service identifiers, retained real La Lupe image, local assets, dimensions, size budgets and three-view HTML inputs. Passive visual assets have no meaningful behavioral RED beyond file/integration checks. Both rendered production compositions were visually inspected at their native size. TypeScript, build and suite remain parent-owned; they were not run by this worker. Parent reports integration build job26, suite 292/292, fresh build job30, and centering browser 40/40 passed. This worker subsequently ran the bounded concepts browser check against the parent-confirmed fresh preview on port 3117.

### Fresh-preview browser evidence

`scripts/check-home-concepts-browser.mjs` was executed once by this worker after the parent supplied the earlier job33 failure artifacts and authorized one bounded harness correction/rerun. For future runs, first obtain parent confirmation of the fresh preview URL:

```sh
TEST_BASE_URL=http://127.0.0.1:PORT node scripts/check-home-concepts-browser.mjs
```

The bounded dependency-free Edge/CDP check uses 390×844, 768×1024 and 1440×1000 viewports. It checks both conceptual cards, decoded display images and original local 1600×1200 assets, uncropped 4:3 geometry, bounds/overflow, visible conceptual/fictional labels, exact original enquiry text/path/query, and La Lupe's Home image, description, features and actions. Responsive Next image candidates can report density-corrected natural sizes; original asset dimensions are independently checked through a decoded local image.

It captures the section and each full conceptual composition in **viewport mode**, scrolling each card into view without overriding application CSS, avoiding Edge's known blank extended screenshot issue. It never clicks links or submits forms. Request interception allows only GET/HEAD requests to the local preview origin, blocks all external/mutating requests, and suppresses form submissions. Screenshots and JSON measurements are written only to a printed fresh OS-temp evidence directory, retained with its isolated browser profile for parent review/cleanup. No server, production build, common tests, or application styling is changed by this check. 

Observed command: `TEST_BASE_URL=http://127.0.0.1:3117 node scripts/check-home-concepts-browser.mjs` — exit 0, **28/28 checks passed**, zero external/unsafe requests encountered, zero clicks/submissions, zero interception errors, and zero canceled-interception exceptions used. Nine viewport screenshots and `measurements.json` were saved to `C:\Users\malej\AppData\Local\Temp\gpBYKrzW\gaG3Tjmh\home-concepts-check-fqe3MY`. All six per-card composition screenshots were visually inspected: both conceptual labels, complete three-view artwork and preserved enquiry CTAs are visible at each width. At 390px the artwork is intentionally a thumbnail; readable surrounding labels/copy carry its identity and purpose.

Earlier job33 evidence remains at `C:\Users\malej\AppData\Local\Temp\gpBYKrzW\home-concepts-check-ZrC27X`. Its 15/28 result was a harness positioning race: numeric `scrollBy(0,-90)` inherited `html { scroll-behavior: smooth }` from `src/app/globals.css:44`, following an instant `scrollIntoView`. Measurements sampled moving card tops at 0–6px, before the 90px header offset completed; the mobile screenshot was already later in that scroll, while the desktop screenshot still hid the outer label behind the header. The correction decodes images before positioning and uses one explicit instant absolute scroll followed by two animation frames. All bounds, aspect-ratio and visibility assertions remain unchanged. No application CSS/JSX was edited.

Job33 also recorded six `Invalid InterceptionId` errors without URLs/network IDs, so their original per-request cause cannot be proven retrospectively. The checker now records those identifiers and listens for `Network.loadingFailed`: only safe local read requests independently confirmed canceled may be classified as canceled interceptions; unsafe or uncorrelated errors still fail. The single rerun produced **no errors or cancellations**, so no filtering was exercised. Both evidence directories and browser profiles remain for parent-owned cleanup; no further rerun was attempted.

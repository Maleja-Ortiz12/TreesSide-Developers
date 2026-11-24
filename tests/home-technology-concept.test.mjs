import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { composition } from '../scripts/home-concepts/template.mjs';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('S1 technology shop has independent photographic landing, comparison, catalog and mobile views', () => {
  const html = composition('shop', { tech: 'data:image/webp;base64,TECH' });
  for (const text of ['TEC /', 'Buscar productos', 'Audio portátil', 'Gaming', 'Accesorios', 'Comparar conexiones', '01 / INICIO', '02 / CATÁLOGO', '03 / MÓVIL', 'Diseño conceptual', 'data:image/webp;base64,TECH']) assert.ok(html.includes(text), text);
  assert.match(html, /grid-template-columns: 190px 1fr/);
  assert.match(html, /#101419/);
  assert.match(html, /#77efff/);
  assert.doesNotMatch(html, /arcilla|cerámica|Georgia|testimonios|ventas realizadas/i);
});

test('S1 selective renderer preserves default pair and filters downloads and both write loops', async () => {
  const source = await read('scripts/render-home-concepts.mjs');
  assert.match(source, /const concepts = selected \? \[selected\] : \['salon', 'shop'\]/);
  assert.equal((source.match(/for \(const name of concepts\)/g) || []).length, 2);
  assert.match(source, /concepts\.flatMap/);
  assert.match(source, /--concept/);
});

test('S1 original default download mode and both composition calls remain usable', () => {
  assert.equal(execFileSync(process.execPath, ['scripts/render-home-concepts.mjs', '--download-only'], { encoding: 'utf8' }), '');
  for (const name of ['salon', 'shop']) {
    const html = composition(name, { salon: 'SALON', tech: 'TECH' });
    for (const label of ['01 / INICIO', '02 /', '03 / MÓVIL']) assert.ok(html.includes(label));
  }
});

test('S1 salon inputs and output remain byte identical to the approved baseline', async () => {
  for (const [file, hash] of [
    ['scripts/home-concepts/salon.html', '9659b6396121519284c3458b36db8afc6475a0a6cc6a3ae678ec2c64dddab74b'],
    ['public/images/home-concepts/salon.webp', '48fcd7258781748d87b704d09e50e18e5589d38b6a1af56ceedf9ea823aa4a15'],
  ]) assert.equal(createHash('sha256').update(await readFile(new URL(`../${file}`, import.meta.url))).digest('hex'), hash);
  assert.match(composition('salon', { salon: 'SALON' }), /ALBA/);
});

test('S1 local production technology asset is decoded, full sized, and truthfully integrated', async () => {
  const meta = await sharp('public/images/home-concepts/shop.webp').metadata();
  assert.equal(meta.width, 1600); assert.equal(meta.height, 1200);
  const html = await read('scripts/home-concepts/shop.html');
  assert.ok(html.includes('TEC /')); assert.doesNotMatch(html, /src="https?:/);
  const jsx = await read('src/components/home/ConceptShowcase.tsx');
  assert.ok(jsx.includes('TEC · tecnología cotidiana'));
  for (const text of ['Quiero una tienda virtual', "href: '/servicios/marketplaces'", 'ficticias']) assert.ok(jsx.includes(text));
});

// S9 cascade model from the authored desktop CSS: untransformed resting boxes of
// the large (captureFrame), right-middle (shopFrame) and below-left (salonFrame)
// cards. Browser checkers verify the transformed boxes; this is a server-free budget.
function cascade(css, captions) {
  const desktop = css.split('@media (max-width: 1060px)')[0].replace(/\/\*[\s\S]*?\*\//g, '');
  const block = selector => desktop.match(new RegExp(`\.${selector} \{([^}]+)\}`))?.[1] || '';
  const sceneWidth = Number(block('collageScene').match(/width: min\(100%, (\d+)px\)/)?.[1]);
  const [scenePadY, scenePadX] = block('collageScene').match(/padding: (\d+)px (\d+)px;/).slice(1).map(Number);
  const collage = block('collage');
  const columns = Number(collage.match(/grid-template-columns: repeat\((\d+), minmax\(0, 1fr\)\);/)?.[1]);
  const [rowGap, columnGap] = collage.match(/gap: (\d+)px (\d+)(?:px)?;/).slice(1).map(Number);
  const [padTop, padBottom] = collage.match(/padding-block: (\d+)px (\d+)px;/).slice(1).map(Number);
  const [ratioW, ratioH] = block('collage figure > img').match(/aspect-ratio: (\d+) \/ (\d+);/).slice(1).map(Number);
  const inner = sceneWidth - 2 * scenePadX;
  const column = (inner - (columns - 1) * columnGap) / columns;
  const card = (slot, caption) => {
    const [start, end] = block(`collage .${slot}`).match(/grid-column: (\d+) \/ (\d+);/).slice(1).map(Number);
    const left = (start - 1) * (column + columnGap), width = (end - start) * column + (end - start - 1) * columnGap;
    return { left, right: left + width, width, caption, image: width * ratioH / ratioW, height: caption + width * ratioH / ratioW + 2 };
  };
  const large = { ...card('captureFrame', captions[0]), top: 0 };
  large.bottom = large.height;
  const shop = card('shopFrame', captions[1]), salon = card('salonFrame', captions[2]);
  const raise = Number(block('collage .shopFrame').match(/margin-top: (-?\d+)%;/)?.[1]) / 100;
  salon.top = large.bottom + rowGap; salon.bottom = salon.top + salon.height;
  shop.top = large.bottom + rowGap + raise * shop.width; shop.bottom = shop.top + shop.height;
  const overlapX = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  // Share of a card's image area under a card painted above it (z: large 1, shop 2, salon 3).
  const covered = (below, above) => overlapX(below, above) / below.width
    * Math.max(0, Math.min(below.bottom, above.bottom) - Math.max(below.top + below.caption, above.top)) / below.image;
  const content = Math.max(large.bottom, shop.bottom, salon.bottom);
  const controls = 12 + 44;
  const scene = scenePadY + padTop + content + padBottom + controls + scenePadY;
  return { sceneWidth, inner, columnGap, large, shop, salon, raise, covered, scene };
}
// Hero grid = max(copy, scene) + row gap 12 + signature (14 + 25.3 + 14).
function firstView(scene, height) {
  const pad = Math.max(16, Math.min(32, height * .03)), available = height - 76 - 2 * pad;
  const grid = scene + 12 + 53.3125;
  const top = 76 + pad + Math.max(0, (available - grid) / 2);
  return { sceneBottom: top + scene, gridFits: grid <= available };
}

test('S3/S9 cascade keeps the large card largest and budgets at most 1100px desktop hero height', async () => {
  const css = await read('src/components/home/HomeRedesign.module.css');
  const desktop = css.split('@media (max-width: 1060px)')[0];
  const widthCap = Number(desktop.match(/width: min\(100%, (\d+)px\)/)?.[1]);
  assert.equal(widthCap, 588, 'scene size follows available width, not short viewport height');
  assert.doesNotMatch(desktop, /100svh - 300px/);
  assert.match(desktop, /minmax\(0, \.85fr\) minmax\(0, 1\.25fr\)/);
  assert.doesNotMatch(desktop, /margin-top: 45%/);
  // The scene fits the collage column of the 1200px container.
  const track = (1200 - 48 - 32) * 1.25 / 2.1;
  assert.ok(widthCap <= track, `${widthCap} fits the ${track}px collage column`);
  // Reserve wrapped captions: 72px primary, 86px secondary.
  const model = cascade(css, [72, 86, 86]);
  assert.equal(model.columnGap, 0, 'cards overlap through their column spans');
  assert.ok(model.large.width >= 340, `large card ${model.large.width}px stays large`);
  assert.ok(model.large.width > model.salon.width && model.large.width > model.shop.width, 'large card is the widest');
  for (const height of [600, 768, 900]) {
    const hero = model.scene + 12 + 53.3125 + 2 * Math.max(16, Math.min(32, height * .03));
    assert.ok(hero <= 1100, `${height}: compact intrinsic hero budget ${hero} exceeds 1100`);
  }
  assert.match(css, /\[data-motion='paused'\] figure/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test('S9 reference cascade keeps every caption and most artwork visible and fits laptop first viewports', async () => {
  const css = await read('src/components/home/HomeRedesign.module.css');
  // Frame 0: La Lupe caption without badge (one line), concept captions with one badge line.
  const frame0 = cascade(css, [44, 48, 48]);
  const { large, shop, salon, covered } = frame0;
  // Right-middle card: left edge right of the large card's centre, top inside its lower half.
  assert.ok(shop.left > (large.left + large.right) / 2, `shop left ${shop.left}`);
  assert.ok(shop.top >= large.bottom * .5 && shop.top <= large.bottom * .7, `shop top ${shop.top} of ${large.bottom}`);
  assert.ok(shop.right <= frame0.inner + .01, 'right card stays inside the collage');
  // Below-left card starts right under the large card and touches the right card.
  assert.ok(salon.top >= large.bottom * .9, `salon top ${salon.top} vs large bottom ${large.bottom}`);
  assert.ok(salon.left < shop.left && salon.right >= shop.left, 'below-left card reaches the right card');
  // Captions sit at card tops: nothing painted above them reaches them.
  assert.ok(shop.top >= large.caption, 'large caption uncovered');
  assert.ok(shop.top + shop.caption <= salon.top, 'right caption uncovered');
  // Area-based occlusion budget below the browser thresholds (80% / 70%), leaving
  // room for 3D-transformed bounding boxes; also with wrapped captions.
  for (const model of [frame0, cascade(css, [72, 86, 86])]) {
    const largeCovered = model.covered(model.large, model.shop) + model.covered(model.large, model.salon);
    assert.ok(largeCovered <= .15, `large card covered ${largeCovered}`);
    assert.ok(model.covered(model.shop, model.salon) <= .15, `right card covered ${model.covered(model.shop, model.salon)}`);
  }
  assert.ok(covered(large, shop) > 0, 'the right card does sit over the large card');
  // First viewports: copy and scene incl. controls at 1366x768; everything incl. the
  // signature at 1536x864 and 1920x1080.
  const laptop = firstView(frame0.scene, 768);
  assert.ok(laptop.sceneBottom <= 768, `1366x768 scene bottom ${laptop.sceneBottom}`);
  for (const height of [864, 1080]) {
    const view = firstView(frame0.scene, height);
    assert.ok(view.gridFits && view.sceneBottom <= height, `${height}: scene bottom ${view.sceneBottom}`);
  }
});

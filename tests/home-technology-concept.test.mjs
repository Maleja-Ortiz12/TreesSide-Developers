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
  for (const text of ['Quiero una tienda virtual', "servicio: 'ecommerce'", 'ficticias']) assert.ok(jsx.includes(text));
});

test('S2 larger collage budgets the whole centered grid at 1440×768 and 1440×900', async () => {
  const css = await read('src/components/home/HomeRedesign.module.css');
  const desktop = css.split('@media (max-width: 1060px)')[0];
  const widthOffset = Number(desktop.match(/width: min\(100%, calc\(100svh - (\d+)px\)\)/)?.[1]);
  assert.ok(Number.isFinite(widthOffset), 'scene width must leave room for controls and signature');
  assert.doesNotMatch(desktop, /100svh - 300px/);
  assert.match(desktop, /minmax\(0, \.85fr\) minmax\(0, 1\.25fr\)/);
  assert.match(desktop, /grid-column: 7 \/ 13; grid-row: 1; margin-top: 45%/);
  assert.match(desktop, /grid-column: 1 \/ 7; grid-row: 1; margin-top: 45%/);
  // Server-free layout budget, not a substitute for browser measurement.
  // Preserve the observed 433.375px copy and 53.3125px signature from job-38.
  const track = (1200 - 48 - 32) * 1.25 / 2.1;
  for (const height of [768, 900]) {
    const scene = Math.min(track, height - widthOffset);
    assert.ok(scene > Math.min(620, height - 300), `${height}: larger than the previous scene`);
    const inner = scene - 28; // existing scene inline padding
    const caption = 72; // allow wrapped labels in all rotation slots
    const primary = inner * 833 / 1200 + caption + 2;
    const secondary = inner / 2;
    const lower = secondary * .45 + secondary * .75 + caption + 2;
    assert.ok(secondary * .45 > caption, 'lower cards clear the primary caption');
    const artwork = Math.max(primary, lower) + 44 + 24 + 12 + 44;
    const grid = Math.max(433.375, artwork) + 12 + 53.3125;
    const room = height - 76 - 2 * Math.max(16, Math.min(32, height * .03));
    assert.ok(grid <= room, `${height}: complete grid budget ${grid} fits ${room}`);
  }
  assert.match(css, /\[data-motion='paused'\] figure/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

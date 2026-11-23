import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) { const response = await fetch(`${base}${path}`); assert.equal(response.status, 200, path); return response.text(); }
const text = html => html.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const footerOf = html => html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] || '';
const PAGES = [ '/servicios', '/planes', '/proyectos', '/nosotros', '/equipo', '/contacto'];

test('S23 the footer sphere is a crisp HTML link with visible text, not a transparent overlay on a raster', async () => {
  for (const path of PAGES) {
    const footer = footerOf(await page(path));
    const sphere = footer.match(/<a[^>]*data-talk-sphere[^>]*>[\s\S]*?<\/a>/)?.[0] || '';
    assert.ok(sphere, `${path} sphere link`);
    assert.match(sphere, /href="\/contacto"/);
    assert.equal(text(sphere), 'Hablemos', `${path} sphere label`);
    assert.ok(sphere.includes('<svg'), 'chat and arrow icons are vectors');
    assert.ok(footer.includes('/images/mockup/closing-roots.webp'), `${path} roots art without the baked circle`);
    assert.ok(!footer.includes('home-roots.webp'), `${path} old baked sphere art removed`);
  }
});

test('S23 the sphere floats and shines in 3D on desktop and stays still on phones and for reduced motion', async () => {
  const css = await readFile('src/components/home/Home.module.css', 'utf8');
  assert.match(css, /@keyframes sphereFloat/);
  assert.match(css, /\.sphere[^{]*\{[^}]*radial-gradient/);
  assert.match(css, /\.sphere[^{]*\{[^}]*inset/);
  assert.match(css, /@media \(max-width: 899px\), \(pointer: coarse\), \(prefers-reduced-motion: reduce\) \{[^}]*\.sphere[^}]*animation: none/);
});

test('Home hero distinguishes real work and conceptual visuals', async () => {
  const html = await page('/');
  const hero = html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0] || '';
  assert.ok(hero.includes('la-lupe.webp'));
  assert.equal((text(hero).match(/Diseño conceptual/g) || []).length, 2);
  assert.ok(hero.includes('about-branch.webp'));
  assert.ok(!hero.includes('data-hero-card'));
  const css = await readFile('src/components/home/Home.module.css', 'utf8');
  assert.match(css, /@keyframes cardFloat/);
  assert.match(css, /\.heroCard[^{]*\{[^}]*rotateY\(/);
  assert.match(css, /@media \(max-width: 899px\), \(pointer: coarse\), \(prefers-reduced-motion: reduce\) \{[^}]*\.heroCard[^}]*animation: none/);
});

test('S26 the restaurant and logistics photos are shown whole inside their tree cards', async () => {
  const css = await readFile('src/components/home/Home.module.css', 'utf8');
  assert.match(css, /\.burger, \.pallets \{[^}]*object-fit: contain/, 'whole photo, never cropped');
  for (const body of ['restaurantBody', 'logisticsBody']) {
    const rule = css.match(new RegExp(`[.]${body} [{][^}]*[}]`))?.[0] ?? '';
    assert.ok(rule.includes('grid-template-rows: minmax(0, 1fr)'), `${body} keeps the photo inside the card`);
  }
});

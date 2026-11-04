import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) { const response = await fetch(`${base}${path}`); assert.equal(response.status, 200, path); return response.text(); }
const text = html => html.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const footerOf = html => html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] || '';
const PAGES = ['/', '/servicios', '/planes', '/proyectos', '/nosotros', '/equipo', '/contacto'];

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

test('S23 the home hero shows the three tree cards as real 3D HTML cards over a card-free tree', async () => {
  const html = await page('/');
  const hero = html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0] || '';
  const scene = hero.match(/<div[^>]*data-hero-scene[\s\S]*?<ul[^>]*data-home-stats/)?.[0] || '';
  assert.ok(scene, 'hero scene');
  const cards = [...scene.matchAll(/data-hero-card="([^"]+)"/g)].map(([, id]) => id);
  assert.deepEqual(cards, ['restaurante', 'radio', 'logistica']);
  for (const copy of ['Restaurante', 'Hamburguesa', '$28.000', 'Pizza', '$35.000', 'Bebidas', '$7.000', 'Radio Online', 'Logística de pallets', 'Pallets', '124', 'En tránsito', '36', 'Entregados', '88']) assert.ok(text(scene).includes(copy), copy);
  assert.match(scene, /aria-hidden="true"/, 'decorative illustration');
  const css = await readFile('src/components/home/Home.module.css', 'utf8');
  assert.match(css, /@keyframes cardFloat/);
  assert.match(css, /\.heroCard[^{]*\{[^}]*rotateY\(/);
  assert.match(css, /@media \(max-width: 899px\), \(pointer: coarse\), \(prefers-reduced-motion: reduce\) \{[^}]*\.heroCard[^}]*animation: none/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const anchors = html => [...(html.match(/<section id="carrusel"[\s\S]*?<\/section>/)?.[0] ?? '')
  .matchAll(/<a[^>]*data-carousel-item[^>]*>[\s\S]*?<\/a>/g)].map(m => m[0]);

test('Home featured project leads to its unique catalog card', async () => {
  const [home, catalog] = await Promise.all([page('/'), page('/proyectos')]);
  assert.ok(home.includes('href="/proyectos#equipo-la-lupe"'));
  assert.equal((catalog.match(/id="equipo-la-lupe"/g) || []).length, 1);
  assert.ok(!home.includes('data-carousel-item'));
});

test('S1 the carousel lands with a native anchor load on a card that does not animate while targeted', async () => {
  // Client-side Link scrolling measured the card mid entry animation and could land past it.
  const carousel = await readFile('src/components/motion/ProjectCarousel.tsx', 'utf8');
  assert.doesNotMatch(carousel, /from 'next\/link'|<Link\b/, 'carousel cards are plain anchors');
  assert.match(carousel, /<a href=\{`\/proyectos#\$\{project\.id\}`\}/);
  const catalog = await readFile('src/components/ProjectsSection.tsx', 'utf8');
  assert.match(catalog, /\.project-card:target\s*\{[^}]*animation:\s*none/, 'targeted card skips the entry animation');
});

test('S1 catalog card anchors are unique and clear the fixed header', async () => {
  const catalog = await page('/proyectos');
  const ids = [...catalog.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'no duplicate ids on /proyectos');
  const card = catalog.match(/<div[^>]*\sid="equipo-ocho80"[^>]*>/)?.[0] ?? '';
  assert.match(card, /scroll-margin-top:\s*100px/, 'hash target is not hidden under the 76px header');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const anchors = html => [...html.matchAll(/<article[^>]*data-project-card[^>]*>[\s\S]*?<\/article>/g)].map(m => m[0]);

test('S1 every home carousel card, copies included, leads to the same project card in the catalog', async () => {
  const [home, catalog] = await Promise.all([page('/'), page('/proyectos')]);
  const items = anchors(home);
  assert.ok(items.length > 0, 'carousel cards');
  const seen = new Set();
  for (const item of items) {
    const title = item.match(/<h3[^>]*>([^<]+)<\/h3>/)?.[1];
    const id = item.match(/href="\/proyectos#([a-z0-9-]+)"/)?.[1];
    assert.ok(id, `${title} links to a catalog anchor, got ${item.match(/href="([^"]+)"/)?.[1]}`);
    const start = catalog.search(new RegExp(`<div[^>]*\\sid="${id}"[^>]*data-project="${id}"`));
    assert.ok(start >= 0, `catalog card #${id}`);
    const card = catalog.slice(start).split(/(?=<div[^>]*data-project=)/)[0].slice(0, 6000);
    assert.match(card, new RegExp(`<h3[^>]*>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</h3>`), `#${id} shows ${title}`);
    seen.add(title);
  }
  for (const title of ['La Lupe', 'Emisoras Latinas']) assert.ok(seen.has(title), `carousel includes ${title}`);
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

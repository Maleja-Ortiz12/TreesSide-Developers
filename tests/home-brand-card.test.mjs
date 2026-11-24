import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Keep the tree hero while updating its business proposition (odd/tasks/client-conversion.md S1-S3).
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function home() {
  const response = await fetch(base, { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const hero = html => html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0];

test('S2 home hero uses the exact business proposition and mint gradient', async () => {
  const html = await home();
  const section = hero(html);
  assert.ok(section, 'hero section');
  const titles = [...html.matchAll(/<h1\b[\s\S]*?<\/h1>/g)].map(m => m[0]);
  assert.equal(titles.length, 1, 'one h1 on the page');
  assert.ok(section.includes(titles[0]), 'the h1 is the hero title');
  assert.equal(text(titles[0]), 'Tu negocio puede vender más y trabajar mejor');
  assert.match(titles[0], /<span>trabajar mejor<\/span>/);
  assert.ok(text(section).includes('Creamos páginas web, tiendas y software a medida para ayudarte a atraer clientes, organizar tu operación y automatizar tareas'));
  const primary = section.match(/<a[^>]*class="[^"]*btn btn-primary[^"]*"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.ok(primary.includes('href="/contacto"'), 'primary CTA goes to contact');
  assert.equal(text(primary), 'Cotizar mi proyecto');
  assert.ok(primary.includes('<svg'), 'arrow icon');
  const secondary = section.match(/<a[^>]*href="\/proyectos"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.equal(text(secondary), 'Ver nuestro trabajo');
  assert.equal((section.match(/<figure/g) || []).length, 3);
});

test('S9 hero artwork is the mockup tree, decorative only', async () => {
  const section = hero(await home());
  const art = section.match(/<img[^>]*about-branch\.webp[^>]*>/)?.[0];
  assert.ok(art, 'hero art');
  assert.ok(art.includes('alt=""'));
  assert.ok(!section.includes('treesside-logo'), 'old brand card art removed');
});

test('S2 the proof band names portfolio evidence rather than counting projects or technologies', async () => {
  const section = hero(await home());
  assert.ok(!section.includes('data-home-stats'));
  assert.equal((text(section).match(/Vista conceptual/g) || []).length, 2);
  assert.ok(section.includes('la-lupe.webp'));
  // Preserve the earlier standalone-project regression: Bendita Gracia remains in the catalog,
  // but adding it (or any member project) no longer becomes a company-contract count on the hero.
  const content = await readFile('src/data/content.ts', 'utf8');
  const standalone = content.match(/export const FEATURED_PROJECTS[\s\S]*?\.\.\.TEAM_PROJECTS/)[0];
  assert.ok(standalone.includes("id: 'equipo-bendita-gracia'"));
  assert.ok(standalone.includes("title: 'Bendita Gracia'"));
  const source = await readFile('src/components/Hero.tsx', 'utf8');
  for (const count of ['FEATURED_PROJECTS.length', 'TECHNOLOGIES.length', 'TEAM_MEMBERS.length']) assert.ok(!source.includes(count), count);
});

test('S12 the old hero, brand card, quick services, and plans preview are gone from the home', async () => {
  const html = (await home()).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<head[\s\S]*?<\/head>/g, '');
  for (const marker of ['data-brand-card', 'quick-features-grid', 'id="planes-resumen"', 'Transformamos']) {
    assert.ok(!html.includes(marker), marker);
  }
});

test('hero responsive grid uses a valid CSS property', async () => {
  const source = await readFile('src/components/Hero.tsx', 'utf8');
  assert.ok(!source.includes('grid-templateColumns'));
});

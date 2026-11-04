import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The brand card hero was replaced by the home mockup hero (odd/tasks/rediseno-mockup.md S9, S10, S12).
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function home() {
  const response = await fetch(base, { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const hero = html => html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0];

test('S10 home hero uses the mockup copy, with "vida." in the mint gradient', async () => {
  const html = await home();
  const section = hero(html);
  assert.ok(section, 'hero section');
  const titles = [...html.matchAll(/<h1\b[\s\S]*?<\/h1>/g)].map(m => m[0]);
  assert.equal(titles.length, 1, 'one h1 on the page');
  assert.ok(section.includes(titles[0]), 'the h1 is the hero title');
  assert.equal(text(titles[0]), 'Tu próxima idea merece cobrar vida.');
  assert.match(titles[0], /<span class="[^"]*text-gradient[^"]*">vida\.<\/span>/);
  assert.ok(text(section).includes('Desarrollamos software a la medida para restaurantes, medios de streaming, logística y más, convirtiendo tus ideas en soluciones reales, funcionales y escalables.'));
  const primary = section.match(/<a[^>]*class="[^"]*btn btn-primary[^"]*"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.ok(primary.includes('href="/contacto"'), 'primary CTA goes to contact');
  assert.equal(text(primary), 'Construyamos tu proyecto');
  assert.ok(primary.includes('<svg'), 'arrow icon');
  const secondary = section.match(/<a[^>]*href="#carrusel"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.equal(text(secondary), 'Explorar proyectos');
  assert.ok(text(section).includes('01 / EXPLORA'));
});

test('S9 hero artwork is the mockup tree, decorative only', async () => {
  const section = hero(await home());
  const art = section.match(/<img[^>]*home-hero\.webp[^>]*>/)?.[0];
  assert.ok(art, 'hero art');
  assert.ok(art.includes('alt=""'));
  assert.ok(!section.includes('treesside-logo'), 'old brand card art removed');
});

test('S9 the stats band counts come from the real catalog data', async () => {
  const section = hero(await home());
  const band = section.match(/<ul[^>]*data-home-stats[\s\S]*?<\/ul>/)?.[0];
  assert.ok(band, 'stats band');
  const team = await readFile('src/data/team.ts', 'utf8');
  // Entries marked sameAs are merged into another member's card.
  const projects = team.split('\n').filter(line => /\{ name: '[^']+', description:/.test(line) && !line.includes('sameAs')).length;
  const content = await readFile('src/data/content.ts', 'utf8');
  const techs = (content.match(/export const TECHNOLOGIES[\s\S]*?\];/)[0].match(/name: '/g) || []).length;
  const members = (team.match(/photo: '\/images\/team\//g) || []).length;
  assert.equal(text(band), `${projects} proyectos ${techs} tecnologías ${members} desarrolladores`);
  assert.ok(band.includes('href="/proyectos"'), 'projects count leads to the catalog');
  const source = await readFile('src/components/Hero.tsx', 'utf8');
  for (const count of ['FEATURED_PROJECTS.length', 'TECHNOLOGIES.length', 'TEAM_MEMBERS.length']) assert.ok(source.includes(count), count);
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

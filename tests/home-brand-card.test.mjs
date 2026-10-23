import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function home() {
  const response = await fetch(base, { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('home brand card shows the current name, subtitle and tagline', async () => {
  const html = await home();
  const hero = html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  const card = hero.match(/<div[^>]*data-brand-card[\s\S]*?data-brand-card-end/)?.[0];
  assert.ok(card, 'brand card');
  assert.match(card, /<span[^>]*>TreesSide<\/span>/);
  assert.match(card, /<span[^>]*>Developers<\/span>/);
  assert.ok(text(card).includes('Código que construye futuro'));
  assert.ok(!text(hero).replace(/\s/g, '').includes('SoftZenkodoDevs'));
});

test('home brand card stats come from the real catalog data', async () => {
  const html = await home();
  const card = html.match(/<div[^>]*data-brand-card[\s\S]*?data-brand-card-end/)?.[0];
  const content = text(card);
  const team = await readFile('src/data/team.ts', 'utf8');
  const projects = (team.match(/\{ name: '[^']+', description:/g) || []).length;
  const content_ts = await readFile('src/data/content.ts', 'utf8');
  const techs = (content_ts.match(/export const TECHNOLOGIES[\s\S]*?\];/)[0].match(/name: '/g) || []).length;
  assert.ok(content.includes(`${projects} proyectos`), `${projects} proyectos`);
  assert.ok(content.includes(`${techs} tecnologías`), `${techs} tecnologías`);
  assert.ok(content.includes('3 desarrolladores'));
});

test('hero responsive grid uses a valid CSS property', async () => {
  const source = await readFile('src/components/Hero.tsx', 'utf8');
  assert.ok(!source.includes('grid-templateColumns'));
});

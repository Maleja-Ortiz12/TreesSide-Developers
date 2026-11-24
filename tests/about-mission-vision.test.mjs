import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const members = ['Ronaldo Delgado Correa', 'Jorge Luis Puentes Brochero', 'María Alejandra Ortiz Páez', 'Jorge Luis Ramírez Trochez'];

test('Nosotros states mission, vision and how TreesSet wants to drive Colombia’s technological growth', async () => {
  const html = await page('/nosotros');
  const section = html.match(/<section[^>]*id="mision-vision"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'mission/vision section');
  const content = text(section);
  for (const phrase of ['Misión', 'Visión', 'Cómo queremos impulsar el crecimiento tecnológico de Colombia']) assert.ok(content.includes(phrase), phrase);
  assert.equal((section.match(/<li/g) || []).length, 4, 'four concrete ways to contribute');
});

test('Nosotros no longer shows the team; the team keeps its own page', async () => {
  const html = await page('/nosotros');
  const content = text(html);
  assert.ok(!html.includes('/images/team/'), 'no team portraits on /nosotros');
  for (const name of members) assert.ok(!content.includes(name), name);
  assert.ok(!content.includes('Las personas detrás de tu proyecto'));
  assert.ok(!content.includes('Lo que nos apasiona'));
  assert.ok(html.includes('href="/equipo"'), 'still links to the team page');
  const team = text(await page('/equipo'));
  for (const name of members) assert.ok(team.includes(name), `team page keeps ${name}`);
});

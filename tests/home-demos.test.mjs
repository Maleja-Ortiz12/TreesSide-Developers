import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// The interactive demos and their component tests were removed with the Home demos section
// (odd/tasks/admin-concepts-visible-collage.md S10); old `?demo=` contact links stay accepted.
async function home() {
  const response = await fetch(process.env.TEST_BASE_URL || 'http://localhost:3000', { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  return response.text();
}
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('S10 Home no longer shows the interactive demos or their simulation copy', async () => {
  const html = await home();
  assert.doesNotMatch(html, /<section[^>]*id="demos"/);
  assert.deepEqual([...html.matchAll(/<article[^>]*data-demo="([^"]+)"/g)].map(match => match[1]), []);
  assert.ok(!html.includes('data-demo-tab'), 'no demo tabs');
  const copy = plain(html);
  for (const label of ['Pruébalo antes de imaginarlo', 'Demo interactiva · Datos de ejemplo', 'Simulación local', 'Quiero una solución similar']) assert.ok(!copy.includes(label), label);
  assert.doesNotMatch(html, /[?&](amp;)?demo=/);
});

test('Home showcases only confirmed real La Lupe work with a flat capture', async () => {
  const html = await home();
  const cards = [...html.matchAll(/<article[^>]*data-project-card="([^"]+)"[\s\S]*?<\/article>/g)];
  assert.deepEqual(cards.map(m => m[1]), ['equipo-la-lupe']);
  const card = cards[0][0];
  for (const label of ['La Lupe', 'restaurante mexicano', 'Presentación del restaurante', 'Menú', 'Platos destacados', 'Contacto por WhatsApp']) assert.ok(plain(card).includes(label), label);
  assert.ok(card.includes('/images/projects/la-lupe.webp'));
  assert.ok(card.includes('href="/proyectos"'));
  assert.ok(plain(card).includes('Ver proyectos'));
  assert.ok(!card.includes('href="/proyectos#equipo-la-lupe"'));
  const css = readFileSync('src/components/home/Home.module.css', 'utf8');
  assert.doesNotMatch(css, /\.laptop \{[^}]*rotate\(/);
});

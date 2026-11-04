import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PLANS = [
  ['impulso-web', 'Impulso Web', '$500.000'],
  ['catalogo-administrable', 'Catálogo Administrable', '$900.000'],
  ['vende-online', 'Vende Online', '$1.490.000'],
  ['automatiza-tu-negocio', 'Negocio Integral', '$3.490.000'],
];
async function page() {
  const response = await fetch(new URL('/planes', base));
  assert.equal(response.status, 200);
  return response.text();
}
const text = value => value.replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

test('S16 plans follows the mockup hero and links its comparison and overview', async () => {
  const html = await page();
  const title = html.match(/<h1\b[\s\S]*?<\/h1>/)?.[0] ?? '';
  assert.equal(text(title), 'Elige cómo empieza tu próxima idea.');
  assert.ok(html.includes('plans-tree.webp'));
  for (const [href, label] of [['#comparativo-planes', 'Ver comparación de alcances'], ['#explorar-planes', 'Explorar planes']]) {
    assert.ok([...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].some(([link]) => link.includes(`href="${href}"`) && text(link).includes(label)), label);
  }
});

test('S16 four illustrated cards display the original prices and link the existing full scope anchors', async () => {
  const html = await page();
  const cards = [...html.matchAll(/<article\b[^>]*data-plan-preview="([^"]+)"[\s\S]*?<\/article>/g)];
  assert.deepEqual(cards.map(([, id]) => id), PLANS.map(([id]) => id));
  for (const [id, name, price] of PLANS) {
    const card = cards.find(([, candidate]) => candidate === id)?.[0];
    for (const copy of [name, price, 'COP', 'Desde', 'Implementación · pago único']) assert.ok(text(card).includes(copy), `${id}: ${copy}`);
    assert.ok(card.includes(`href="#${id}"`));
    assert.match(card, /<img[^>]*alt=""/);
    assert.ok(text(card).includes('Ver alcance'));
    // Canonical fragments still point at the complete original detail, not at the summary card.
    assert.match(html, new RegExp(`<article[^>]*id="${id}"[^>]*data-plan="${id}"`));
  }
});

test('S16 comparison is an accessible cumulative four-plan table without changing its scope', async () => {
  const html = await page();
  const table = html.match(/<table\b[^>]*data-plans-comparison[\s\S]*?<\/table>/)?.[0] ?? '';
  assert.match(table, /<caption\b/);
  const headings = [...table.matchAll(/<th[^>]*scope="col"[^>]*>([\s\S]*?)<\/th>/g)].map(([, value]) => text(value));
  assert.deepEqual(headings, ['Alcance', ...PLANS.map(([, name]) => name)]);
  const rows = [...table.matchAll(/<tr[^>]*data-scope-row="([^"]+)"[\s\S]*?<\/tr>/g)];
  assert.deepEqual(rows.map(([, id]) => id), PLANS.map(([id]) => id));
  assert.deepEqual(rows.map(([row]) => [...row.matchAll(/data-included="(true|false)"/g)].map(([, value]) => value === 'true')), [
    [true, true, true, true], [false, true, true, true], [false, false, true, true], [false, false, false, true],
  ]);
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(([footer]) => footer);
  assert.equal(footers.length, 1);
  assert.ok(footers[0].includes('Lo que sigue,'));
  assert.ok(footers[0].includes('href="/politica-de-datos"'));
});

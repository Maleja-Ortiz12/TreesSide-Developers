import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path = '/servicios') {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

test('S15 services adopts the mockup hero, its actions and tree illustration', async () => {
  const html = await page();
  const hero = html.match(/<section id="servicios"[\s\S]*?<\/section>/)?.[0] ?? '';
  const h1 = hero.match(/<h1\b[\s\S]*?<\/h1>/)?.[0];
  assert.ok(h1);
  assert.equal(text(h1).trim(), 'Tecnología que resuelve. Software que crece contigo.');
  assert.ok(hero.includes('services-tree.webp'));
  for (const [copy, href] of [['Conversemos sobre tu proyecto', '/contacto'], ['Ver planes', '/planes']]) {
    assert.ok([...hero.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].some(([link]) => link.includes(`href="${href}"`) && text(link).includes(copy)), copy);
  }
  assert.ok(!html.includes('id="planes-resumen"'));
});

test('S15 nine illustrated service cards retain every original title and item', async () => {
  const html = await page();
  const cards = [...html.matchAll(/<article\b[^>]*data-service="([^"]+)"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 9);
  const source = await readFile('src/data/content.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: () => ({ TEAM_MEMBERS: [] }) });
  for (const service of exports.SERVICES) {
    const card = cards.find(([, id]) => id === service.id)?.[0];
    assert.ok(card, service.id);
    assert.ok(text(card).includes(service.title), service.title);
    for (const item of service.items) assert.ok(text(card).includes(item), `${service.id}: ${item}`);
    assert.match(card, /<img[^>]*alt=""/);
    assert.match(card, /<details\b/);
    assert.ok(text(card).includes('Conocer más'));
  }
  assert.ok(html.includes('id="tecnologias"'));
  assert.ok(html.includes('data-tech="UiPath"'));
});

test('S15 process uses the mockup steps and the page ends in one integrated footer', async () => {
  const html = await page();
  const process = html.match(/<section id="proceso-servicios"[\s\S]*?<\/section>/)?.[0] ?? '';
  const labels = [...process.matchAll(/<h3\b[^>]*>([^<]*)<\/h3>/g)].map(([, label]) => label);
  assert.deepEqual(labels, ['Descubrimos', 'Diseñamos', 'Construimos', 'Lanzamos']);
  const footers = [...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(([footer]) => footer);
  assert.equal(footers.length, 1);
  for (const copy of ['Lo que sigue,', 'Hablemos', 'Política de datos']) assert.ok(footers[0].includes(copy));
  assert.ok(!footers[0].includes('site-footer'));
  // The existing process on Nosotros is not replaced by the services-specific copy.
  const about = await page('/nosotros');
  for (const copy of ['Analizamos', 'Diseñamos', 'Desarrollamos', 'Entregamos']) assert.ok(about.includes(copy), copy);
});

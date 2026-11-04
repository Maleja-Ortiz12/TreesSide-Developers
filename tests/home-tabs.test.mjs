import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';

// S14 retires demo selection: the hero now links directly to the restored project strip.
test('home hero leads to the actual carousel without obsolete demo controls', async () => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  const html = await response.text();
  const hero = html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(hero.includes('href="#carrusel"'));
  assert.ok(hero.includes('Explorar proyectos'));
  assert.ok(!hero.includes('data-demo-tab'));
  assert.ok(!hero.includes('aria-controls="demo-'));
  assert.ok(html.includes('id="carrusel"'));
});

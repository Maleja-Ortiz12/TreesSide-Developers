import test from 'node:test';
import assert from 'node:assert/strict';

test('about keeps its Colombian commitment and adds international growth as an ambition', async () => {
  const response = await fetch(new URL('/nosotros', process.env.TEST_BASE_URL || 'http://localhost:3000'), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const section = html.match(/<section id="sobre-nosotros"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  const text = section.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  assert.ok(text.includes('Colombia sea un país más tecnológico y productivo'));
  assert.ok(text.includes('Queremos llegar a mercados extranjeros'));
  assert.ok(text.includes('seguir innovando y creciendo'));
  assert.ok(text.includes('Desde Colombia, con visión global'));
});

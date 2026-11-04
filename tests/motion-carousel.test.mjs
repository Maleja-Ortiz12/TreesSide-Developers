import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

async function home() {
  const response = await fetch(process.env.TEST_BASE_URL || 'http://localhost:3000', { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200);
  return response.text();
}
const carousel = html => html.match(/<section id="carrusel"[\s\S]*?<\/section>/)?.[0];
const items = (html, hidden) => [...html.matchAll(/<a[^>]*data-carousel-item[^>]*>[\s\S]*?<\/a>/g)].map(m => m[0])
  .filter(item => item.includes('tabindex="-1"') === hidden);

async function loadModule() {
  const code = ts.transpileModule(await readFile('src/components/motion/ProjectCarousel.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: () => new Proxy({}, { get: () => () => null }) });
  return exports;
}

// S14 restores the original moving strip in place of the home demos.
test('S14 the original project carousel returns with accessible copies and pause controls', async () => {
  const html = await home();
  const section = carousel(html);
  assert.ok(section);
  assert.match(html, /data-reveal[^>]*>\s*<section id="carrusel"/);
  assert.ok(!html.includes('data-demo='));
  assert.ok(section.includes('Pausar carrusel'));
  const visible = items(section, false);
  assert.ok(visible.length > 0);
  const titles = visible.map(item => item.match(/<strong>([^<]+)<\/strong>/)?.[1]);
  assert.equal(new Set(titles).size, titles.length);
  for (const hidden of items(section, true)) assert.ok(hidden.includes('aria-hidden="true"'));
  const rows = section.split(/(?=<div[^>]*class="[^"]*viewport)/).slice(1);
  assert.equal(rows.length, 2);
  for (const row of rows) {
    const copies = row.split(/(?=<div class="[^"]*set)/).slice(1).map(copy => (copy.match(/data-carousel-item/g) || []).length);
    assert.equal(copies.length, 2);
    assert.equal(copies[0], copies[1]);
    assert.ok(copies[0] >= 14);
  }
});
test('the retained strip helper fills wide screens without changing ordering', async () => {
  const { repeatToMinimum } = await loadModule();
  assert.deepEqual(Array.from(repeatToMinimum(['a', 'b', 'c'], 7)), ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c']);
  assert.deepEqual(Array.from(repeatToMinimum([], 14)), []);
});

test('S2 the strip offset wraps seamlessly in both directions', async () => {
  const { wrapOffset } = await loadModule();
  assert.equal(wrapOffset(-1050, 1000), -50);
  assert.equal(wrapOffset(-1000, 1000), 0);
  assert.equal(wrapOffset(-400, 1000), -400);
  assert.equal(wrapOffset(30, 1000), -970);
  assert.equal(wrapOffset(-20, 0), 0, 'unmeasured strip stays put');
});

test('S7 the carousel stops moving for reduced motion and while hovered, focused or paused', async () => {
  const source = await readFile('src/components/motion/ProjectCarousel.tsx', 'utf8');
  assert.ok(source.includes('useReducedMotion()'));
  // Starting from rest means reduced-motion visitors never see the strip drift while the spring settles.
  assert.match(source, /useSpring\(0,/);
  for (const event of ['onPointerEnter', 'onPointerLeave', 'onFocus', 'onBlur']) assert.ok(source.includes(event), event);
});

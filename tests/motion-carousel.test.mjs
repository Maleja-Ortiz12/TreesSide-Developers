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

// S12 replaces the home strip with two static laptop project links; the reusable strip remains tested below.
test('S12 the home shows two laptop project cards instead of the moving strip', async () => {
  const html = await home();
  assert.ok(!carousel(html));
  assert.equal((html.match(/data-laptop/g) || []).length, 2);
  for (const id of ['equipo-la-lupe', 'equipo-emisoras-latinas']) assert.ok(html.includes(`href="/proyectos#${id}"`));
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

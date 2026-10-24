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

test('S2 home shows a project image carousel inside a scroll reveal', async () => {
  const html = await home();
  assert.match(html, /data-reveal[^>]*>\s*<section id="carrusel"/);
  const section = carousel(html);
  assert.ok(section, 'carousel section');
  assert.ok(section.includes('Proyectos que ya construimos'));
  const visible = items(section, false);
  for (const [title, slug] of [['La Lupe', 'la-lupe'], ['Ocho80', 'ocho80'], ['TengoYa', 'tengoya'], ['Emisoras Latinas', 'emisoras-latinas-cover']]) {
    const item = visible.find(entry => entry.includes(title));
    assert.ok(item, `item ${title}`);
    assert.ok(item.includes(`%2Fimages%2Fprojects%2F${slug}.webp`) || item.includes(`/images/projects/${slug}.webp`), `image ${title}`);
    const expected = { 'La Lupe': '/casos/la-lupe', TengoYa: '/casos/tengoya', 'Emisoras Latinas': '/casos/emisoras-latinas' }[title] ?? '/proyectos';
    assert.ok(item.includes(`href="${expected}"`), `link ${title}`);
  }
  assert.ok(!visible.some(entry => entry.includes('Gudfy') || entry.includes('Luhos')), 'employer work stays out');
  assert.ok(!section.includes('treesside-logo'), 'only real project images');
});

test('S2 the loop copy and wide-screen fillers are hidden from assistive tech and keyboard, and motion can be paused', async () => {
  const section = carousel(await home());
  const visible = items(section, false);
  const titles = visible.map(item => item.match(/<strong>([^<]+)<\/strong>/)?.[1]);
  assert.equal(new Set(titles).size, titles.length, 'each project is announced once');
  for (const hidden of items(section, true)) assert.ok(hidden.includes('aria-hidden="true"'), 'repeat hidden from screen readers');
  assert.match(section, /<div[^>]*aria-hidden="true"[^>]*data-carousel-copy/);
  assert.ok(section.includes('Pausar carrusel'));
});

test('S4 every strip copy holds at least 14 cards so very wide screens never see a gap', async () => {
  const section = carousel(await home());
  const rows = section.split(/(?=<div[^>]*class="[^"]*viewport)/).slice(1);
  assert.equal(rows.length, 2);
  for (const row of rows) {
    const count = (row.match(/data-carousel-item/g) || []).length;
    assert.ok(count >= 28, `two copies of at least 14 cards, got ${count}`);
  }
  const { repeatToMinimum } = await loadModule();
  assert.deepEqual(Array.from(repeatToMinimum(['a', 'b', 'c'], 7)), ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c']);
  assert.deepEqual(Array.from(repeatToMinimum(['a', 'b'], 1)), ['a', 'b']);
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

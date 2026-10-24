import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
async function loadModule() {
  const code = ts.transpileModule(await readFile('src/components/motion/ParallaxBackground.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: () => new Proxy({}, { get: () => () => null }) });
  return exports;
}

test('S5 every page has a decorative three-layer parallax background', async () => {
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/contacto', '/equipo']) {
    const html = await page(path);
    const layer = html.match(/<div[^>]*data-parallax[^>]*>[\s\S]*?<\/div>\s*<\/div>/)?.[0] ?? '';
    assert.match(html, /<div[^>]*aria-hidden="true"[^>]*data-parallax|<div[^>]*data-parallax[^>]*aria-hidden="true"/, `${path} hidden from assistive tech`);
    assert.equal((html.match(/data-depth="/g) || []).length, 3, `${path} layers`);
    assert.ok(layer, path);
  }
});

test('S5 deeper layers scroll faster and wrap within their tile', async () => {
  const { layerOffset, LAYERS } = await loadModule();
  assert.equal(layerOffset(0, 0.4, 300), 0);
  assert.equal(layerOffset(1000, 0.4, 300), -100);
  assert.equal(layerOffset(750, 0.4, 300), 0);
  // Copy out of the vm realm so deepEqual compares values, not Array prototypes.
  const depths = Array.from(LAYERS, layer => layer.depth);
  assert.deepEqual([...depths].sort((a, b) => a - b), depths, 'layers ordered far to near');
  assert.ok(depths[2] > depths[0] * 2, 'near layer clearly faster than the far one');
});

test('S7 the background never blocks clicks and stays still for reduced motion', async () => {
  const source = await readFile('src/components/motion/ParallaxBackground.tsx', 'utf8');
  const css = await readFile('src/components/motion/ParallaxBackground.module.css', 'utf8');
  assert.ok(source.includes('useReducedMotion()'));
  assert.match(css, /\.root\s*\{[^}]*pointer-events:\s*none/);
  assert.match(css, /\.root\s*\{[^}]*position:\s*fixed/);
  const shell = await readFile('src/components/motion/MotionShell.tsx', 'utf8');
  assert.ok(shell.includes('<ParallaxBackground />'));
});

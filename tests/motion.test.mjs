import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Renders a motion component with motion.* replaced by plain elements so its animation props can be inspected.
async function render(file, name, props = {}) {
  const code = ts.transpileModule(await readFile(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  const jsx = (type, p) => ({ type, props: p });
  const motion = new Proxy({}, { get: (_, tag) => `motion.${String(tag)}` });
  vm.runInNewContext(code, { exports, require: path => path === 'motion/react' ? { motion, MotionConfig: 'MotionConfig' }
    : path === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : {} });
  return exports[name](props);
}

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

const SECTIONS = {
  '/': ['demos'],
  '/servicios': ['servicios', 'tecnologias'],
  '/proyectos': ['proyectos'],
  '/nosotros': ['sobre-nosotros', 'proceso'],
  '/contacto': ['contacto'],
};

test('S6 Framer Motion is a declared dependency and honors reduced motion', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  assert.ok(pkg.dependencies.motion, 'motion dependency');
  const shell = await readFile('src/components/motion/MotionShell.tsx', 'utf8');
  assert.ok(shell.includes('reducedMotion="user"'));
});

test('S3 a finished reveal leaves no transform, so fixed overlays like the project modal keep working', async () => {
  const tree = await render('src/components/motion/Reveal.tsx', 'Reveal', { children: 'x' });
  assert.equal(tree.type, 'motion.div');
  const end = tree.props.whileInView;
  for (const [key, value] of Object.entries(end)) {
    assert.equal(value, key === 'opacity' || key.startsWith('scale') ? 1 : 0, `${key} ends at its identity value`);
  }
  assert.ok(tree.props.initial.transformPerspective > 0, '3D depth while entering');
  assert.ok(!('transformPerspective' in (tree.props.style ?? {})), 'no permanent perspective');
  assert.equal(tree.props.viewport.once, true);
});

test('S3 every page section is wrapped in a scroll reveal', async () => {
  for (const [path, ids] of Object.entries(SECTIONS)) {
    const html = await page(path);
    for (const id of ids) {
      assert.match(html, new RegExp(`data-reveal[^>]*>\\s*<section id="${id}"`), `${path} #${id}`);
    }
  }
  const team = await page('/equipo');
  assert.match(team, /<main[^>]*>\s*<div[^>]*data-reveal/, '/equipo gallery');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Loads the legacy Hero (and the data it imports) with React and Next replaced by plain stand-ins,
// so its tab scroll can be checked without a browser. The Home no longer mounts the demos (S10).
function loader() {
  const cache = new Map();
  const scrolled = [];
  const jsx = (type, props) => ({ type, props });
  const react = { useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(), useState: initial => [initial, () => {}] };
  const globals = {
    document: { getElementById: id => ({ scrollIntoView: options => scrolled.push({ id, options }) }) },
    window: { matchMedia: () => ({ matches: false }) },
  };
  const file = base => ['', '.ts', '.tsx', '/index.ts', '/index.tsx'].map(ext => base + ext).find(candidate => existsSync(candidate) && statSync(candidate).isFile());
  function load(target) {
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} };
    cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, { ...globals, URL, URLSearchParams, module, exports: module.exports, require: spec => resolve(spec, target) });
    return module.exports;
  }
  function resolve(spec, from) {
    if (spec === 'react') return react;
    if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
    if (spec === 'next/link') return { default: 'Link' };
    if (spec === 'next/image') return { default: 'Image' };
    if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
    if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
    const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(from), spec);
    const target = file(base);
    assert.ok(target, `module ${spec}`);
    return load(target);
  }
  return { load: relative => load(path.resolve(relative)), scrolled };
}

const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');

test('S9 the tab scroll jumps instead of gliding for reduced motion', () => {
  const { load, scrolled } = loader();
  const smooth = load('src/components/Hero.tsx');
  nodes(smooth.Hero()).find(node => node.props?.['data-demo-tab'] === 'emisoras-latinas').props.onClick();
  assert.equal(scrolled.at(-1).options.behavior, 'smooth');
  const source = readFileSync('src/components/Hero.tsx', 'utf8');
  assert.match(source, /prefers-reduced-motion: reduce/);
  // The page sets CSS smooth scrolling, so only 'instant' really jumps.
  assert.match(source, /reduce\)'\)\.matches \? 'instant' : 'smooth'/);
});

// admin-concepts-visible-collage S10: the interactive demos section left the Home page.
test('S10 the server Home HTML no longer renders the demo tabs or panels', async () => {
  const response = await fetch(process.env.TEST_BASE_URL || 'http://localhost:3000', { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.doesNotMatch(html, /<section[^>]*id="demos"/);
  assert.doesNotMatch(html, /data-demo-tab=|data-demo="/);
  assert.ok(!html.includes('Demo interactiva'), 'no interactive demo badge');
});

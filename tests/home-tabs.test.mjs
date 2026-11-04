import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Loads the real Hero and HomeDemos (and the data they import) with React and Next replaced by plain
// stand-ins, so a tab click can be followed into the demos section without a browser.
function loader() {
  const cache = new Map();
  const scrolled = [];
  const jsx = (type, props) => ({ type, props });
  const react = { useSyncExternalStore: (subscribe, getSnapshot) => getSnapshot(), useState: initial => [initial, () => {}] };
  const globals = {
    document: { getElementById: id => ({ scrollIntoView: options => scrolled.push({ id, options }) }) },
    window: { matchMedia: () => ({ matches: false }) },
  };
  const file = base => ['', '.ts', '.tsx'].map(ext => base + ext).find(candidate => existsSync(candidate) && !candidate.endsWith(path.sep));
  function load(target) {
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} };
    cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, { ...globals, module, exports: module.exports, require: spec => resolve(spec, target) });
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

test('S9 the hero tabs pick which demo the demos section shows and scroll to it', () => {
  const { load, scrolled } = loader();
  const { Hero } = load('src/components/Hero.tsx');
  const { HomeDemos } = load('src/components/HomeDemos.tsx');
  const tabs = () => nodes(Hero()).filter(node => node.type === 'button' && node.props['data-demo-tab']);
  const visible = () => nodes(HomeDemos()).filter(node => node.type === 'article' && node.props['data-demo'] && !node.props.hidden).map(node => node.props['data-demo']);
  const pressed = () => tabs().filter(tab => tab.props['aria-pressed']).map(tab => text(tab).trim());

  assert.deepEqual(tabs().map(tab => text(tab).trim()), ['Restaurantes', 'Streaming', 'Logística']);
  assert.deepEqual(pressed(), ['Restaurantes']);
  assert.deepEqual(visible(), ['la-lupe']);

  for (const [label, demo] of [['Streaming', 'emisoras-latinas'], ['Logística', 'calculadora-de-contenedores'], ['Restaurantes', 'la-lupe']]) {
    const tab = tabs().find(item => text(item).trim() === label);
    assert.equal(tab.props['aria-controls'], `demo-${demo}`);
    tab.props.onClick();
    assert.deepEqual(pressed(), [label], `${label} pressed`);
    assert.deepEqual(visible(), [demo], `${label} shows ${demo}`);
    assert.equal(scrolled.at(-1)?.id, 'demos', `${label} scrolls to the demos`);
  }
  assert.equal(scrolled.length, 3);
});

test('S9 the tab scroll jumps instead of gliding for reduced motion', () => {
  const { load, scrolled } = loader();
  const smooth = load('src/components/Hero.tsx');
  nodes(smooth.Hero()).find(node => node.props?.['data-demo-tab'] === 'emisoras-latinas').props.onClick();
  assert.equal(scrolled.at(-1).options.behavior, 'smooth');
  const source = readFileSync('src/components/Hero.tsx', 'utf8');
  assert.match(source, /prefers-reduced-motion: reduce/);
});

test('S9 the server HTML renders the tabs with the first one pressed, each pointing at its demo', async () => {
  const response = await fetch(process.env.TEST_BASE_URL || 'http://localhost:3000', { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const hero = html.match(/<section[^>]*id="inicio"[\s\S]*?<\/section>/)?.[0] ?? '';
  const tabs = [...hero.matchAll(/<button[^>]*data-demo-tab="([^"]+)"[^>]*>/g)];
  assert.deepEqual(tabs.map(match => match[1]), ['la-lupe', 'emisoras-latinas', 'calculadora-de-contenedores']);
  assert.deepEqual(tabs.map(match => match[0].includes('aria-pressed="true"')), [true, false, false]);
  for (const [tag, id] of tabs) {
    assert.ok(tag.includes(`aria-controls="demo-${id}"`), `${id} controls`);
    assert.match(html, new RegExp(`<article[^>]*id="demo-${id}"`), `${id} target`);
  }
});

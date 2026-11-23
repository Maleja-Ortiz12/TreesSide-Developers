import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function fixture(reduced = false) {
  const states = [], effects = [], timers = new Map(), listeners = new Set();
  let cursor = 0, serial = 0;
  const media = { matches: reduced, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in states)) states[i] = initial;
      return [states[i], value => { states[i] = typeof value === 'function' ? value(states[i]) : value; }];
    },
    useEffect(fn, deps) {
      const i = cursor++, old = effects[i];
      if (!old || deps.some((value, j) => value !== old.deps[j])) {
        old?.cleanup?.(); effects[i] = { deps, pending: fn };
      }
    },
  };
  const module = { exports: {} }, jsx = (type, props) => ({ type, props });
  vm.runInNewContext(ts.transpileModule(readFileSync('src/components/home/HeroCollage.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { module, exports: module.exports,
    window: { matchMedia: () => media },
    setInterval: (fn, delay) => { assert.equal(delay, 6000); timers.set(++serial, fn); return serial; },
    clearInterval: id => timers.delete(id),
    require: name => name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : { default: new Proxy({}, { get: (_, key) => key }) },
  });
  return {
    render() { cursor = 0; const tree = module.exports.HeroCollage({ frames: ['real + concepts', 'more real + concept'], children: 'tree' });
      for (const effect of effects) if (effect?.pending) { effect.cleanup = effect.pending(); delete effect.pending; }
      return tree;
    },
    tick() { for (const fn of [...timers.values()]) fn(); },
    reduce(value) { media.matches = value; for (const fn of listeners) fn(); },
    unmount() { for (const effect of effects) effect?.cleanup?.(); },
    timers, listeners,
  };
}
const nodes = n => !n || typeof n !== 'object' ? [] : Array.isArray(n) ? n.flatMap(nodes) : [n, ...nodes(n.props.children)];
const region = tree => nodes(tree).find(n => n.props.id === 'hero-collage');
const button = (tree, label) => nodes(tree).find(n => n.type === 'button' && (n.props['aria-label'] === label || n.props.children === label));

test('S11 six-second artwork cycles, wraps, pauses persistently, supports manual access and cleans up', () => {
  const ui = fixture(); ui.render(); let tree = ui.render();
  assert.equal(ui.timers.size, 1);
  assert.ok(region(tree).props.children.includes('real + concepts'));
  ui.tick(); tree = ui.render(); assert.ok(region(tree).props.children.includes('more real + concept'));
  ui.tick(); tree = ui.render(); assert.ok(region(tree).props.children.includes('real + concepts'));
  button(tree, 'Pausar animación').props.onClick(); tree = ui.render();
  assert.equal(region(tree).props['data-motion'], 'paused'); assert.equal(ui.timers.size, 0);
  ui.tick(); tree = ui.render(); assert.ok(region(tree).props.children.includes('real + concepts'));
  button(tree, 'Siguiente composición').props.onClick(); tree = ui.render();
  assert.ok(region(tree).props.children.includes('more real + concept')); assert.equal(region(tree).props['data-motion'], 'paused');
  button(tree, 'Composición anterior').props.onClick(); tree = ui.render(); assert.ok(region(tree).props.children.includes('real + concepts'));
  button(tree, 'Reanudar animación').props.onClick(); ui.render(); assert.equal(ui.timers.size, 1);
  ui.unmount(); assert.equal(ui.timers.size, 0); assert.equal(ui.listeners.size, 0);
});

test('S11 reduced motion starts static, allows manual access, responds to changes without losing pause', () => {
  const ui = fixture(true); let tree = ui.render(); tree = ui.render();
  assert.equal(ui.timers.size, 0); assert.equal(region(tree).props['data-motion'], 'paused');
  button(tree, 'Siguiente composición').props.onClick(); tree = ui.render(); assert.ok(region(tree).props.children.includes('more real + concept'));
  ui.reduce(false); ui.render(); assert.equal(ui.timers.size, 1);
  ui.reduce(true); tree = ui.render(); assert.equal(ui.timers.size, 0); assert.equal(region(tree).props['data-motion'], 'paused');
  ui.reduce(false); tree = ui.render(); button(tree, 'Pausar animación').props.onClick(); ui.render();
  ui.reduce(true); ui.render(); ui.reduce(false); tree = ui.render();
  assert.equal(region(tree).props['data-motion'], 'paused'); assert.equal(ui.timers.size, 0);
  ui.unmount(); assert.equal(ui.listeners.size, 0);
});

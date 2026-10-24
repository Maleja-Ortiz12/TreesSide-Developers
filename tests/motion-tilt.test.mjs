import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// Loads TiltEffect with fake browser globals and a recording `animate`, then returns its pointer handlers.
async function load({ reduce = false, finePointer = true } = {}) {
  const code = ts.transpileModule(await readFile('src/components/motion/TiltEffect.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const calls = [], listeners = {};
  const exports = {};
  const windowListeners = {};
  const window = {
    matchMedia: query => ({ matches: query.includes('reduce') ? reduce : finePointer }),
    addEventListener: (type, fn) => { windowListeners[type] = fn; }, removeEventListener: type => { delete windowListeners[type]; },
  };
  const document = { addEventListener: (type, fn) => { listeners[type] = fn; }, removeEventListener: type => { delete listeners[type]; } };
  vm.runInNewContext(code, {
    exports, window, document,
    require: path => path === 'react' ? { useEffect: fn => { fn(); } }
      : path === 'motion/react' ? { animate: (el, values, options) => { calls.push({ el, values, options }); return Promise.resolve(); } }
      : {},
  });
  exports.TiltEffect();
  return { exports, calls, listeners, windowListeners };
}
const card = (extra = {}) => ({
  style: { transition: 'all .3s ease', transform: '' },
  getBoundingClientRect: () => ({ left: 100, top: 100, width: 200, height: 100 }),
  querySelector: () => null,
  ...extra,
});
const over = el => ({ target: { closest: () => el } });

test('S4 tilt follows the pointer: center is flat, corners lean toward the pointer', async () => {
  const { exports } = await load();
  const rect = { left: 100, top: 100, width: 200, height: 100 };
  const center = exports.tiltFor(rect, 200, 150);
  assert.equal(Math.abs(center.rotateX), 0);
  assert.equal(Math.abs(center.rotateY), 0);
  const topLeft = exports.tiltFor(rect, 100, 100);
  assert.equal(topLeft.rotateX, exports.MAX_TILT);
  assert.equal(topLeft.rotateY, -exports.MAX_TILT);
  const outside = exports.tiltFor(rect, 900, 900);
  assert.equal(outside.rotateX, -exports.MAX_TILT, 'clamped');
  assert.equal(outside.rotateY, exports.MAX_TILT, 'clamped');
});

test('S4 demo, service and project cards tilt; 3D tech cards keep their own animation', async () => {
  const { exports } = await load();
  assert.ok(exports.TILT_SELECTOR.includes('.glass-card'));
  assert.ok(exports.TILT_SELECTOR.includes('#demos article'));
  assert.ok(exports.TILT_SELECTOR.includes('[data-tilt]'));
  assert.ok(exports.TILT_SELECTOR.includes(':not(.tech-card-3d)'));
});

test('S4 hovering a card springs it toward the mouse and leaving restores it untouched', async () => {
  const { calls, listeners } = await load();
  const el = card();
  listeners.pointermove({ pointerType: 'mouse', clientX: 300, clientY: 100, ...over(el) });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].el, el);
  assert.ok(calls[0].values.rotateY > 0 && calls[0].values.rotateX > 0, 'leans to the top-right');
  assert.ok(calls[0].values.transformPerspective > 0);
  assert.equal(calls[0].options.type, 'spring');
  assert.ok(!el.style.transition.includes('all'), 'CSS transition no longer fights the spring');
  listeners.pointermove({ pointerType: 'mouse', clientX: 0, clientY: 0, ...over(null) });
  const reset = calls.at(-1);
  assert.equal(reset.values.rotateX, 0);
  assert.equal(reset.values.rotateY, 0);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.style.transform, '', 'inline transform cleared');
  assert.equal(el.style.transition, 'all .3s ease', 'original transition restored');
});

test('S4 a tilted card is released when the page scrolls, the mouse leaves the window or the tab loses focus', async () => {
  for (const [target, type] of [['window', 'scroll'], ['document', 'pointerleave'], ['window', 'blur']]) {
    const { calls, listeners, windowListeners } = await load();
    const el = card();
    listeners.pointermove({ pointerType: 'mouse', clientX: 300, clientY: 100, ...over(el) });
    const handler = (target === 'window' ? windowListeners : listeners)[type];
    assert.ok(handler, `${target} ${type} listener`);
    handler({});
    const reset = calls.at(-1);
    assert.equal(reset.values.rotateX, 0, type);
    assert.equal(reset.values.rotateY, 0, type);
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(el.style.transform, '', `${type} clears transform`);
  }
});

test('S4 cards with form fields and touch pointers do not tilt', async () => {
  const { calls, listeners } = await load();
  listeners.pointermove({ pointerType: 'mouse', clientX: 150, clientY: 120, ...over(card({ querySelector: () => ({}) })) });
  listeners.pointermove({ pointerType: 'touch', clientX: 150, clientY: 120, ...over(card()) });
  assert.equal(calls.length, 0);
});

test('S7 reduced motion or a coarse pointer disables tilt entirely', async () => {
  for (const options of [{ reduce: true }, { finePointer: false }]) {
    const { listeners } = await load(options);
    assert.equal(listeners.pointermove, undefined, JSON.stringify(options));
  }
});

test('S4 the tilt effect is mounted on every page through the motion shell', async () => {
  const shell = await readFile('src/components/motion/MotionShell.tsx', 'utf8');
  assert.ok(shell.includes('<TiltEffect />'));
});

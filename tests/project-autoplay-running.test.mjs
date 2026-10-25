import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function mount() {
  const code = ts.transpileModule(readFileSync('src/components/ProjectSpotlight.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const slots = [], timers = new Map();
  let cursor = 0, dirty = false, pending = [], sequence = 0;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], value => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; }
      }];
    },
    useRef(initial) {
      const i = cursor++;
      return slots[i] ??= { current: initial };
    },
    useEffect(callback, deps) {
      const i = cursor++;
      const old = slots[i];
      if (!old || deps.some((dep, j) => !Object.is(dep, old.deps[j]))) {
        pending.push(() => { old?.cleanup?.(); slots[i] = { deps, cleanup: callback() }; });
      }
    },
  };
  const exports = {}, jsx = (type, props) => ({ type, props });
  vm.runInNewContext(code, {
    exports,
    require: name => name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : name.endsWith('.css') ? { default: {} } : { default: () => null },
    document: { hidden: false, addEventListener() {}, removeEventListener() {} },
    window: {
      matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
      setTimeout: (callback, delay) => { const id = ++sequence; timers.set(id, { callback, delay }); return id; },
      clearTimeout: id => timers.delete(id),
    },
  });
  let tree;
  const render = () => {
    let rounds = 0;
    do {
      assert.ok(++rounds < 10, 'render settles');
      cursor = 0; dirty = false; pending = [];
      tree = exports.ProjectSpotlight({ projects: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }], onOpen() {} });
      pending.forEach(effect => effect());
    } while (dirty);
    return tree;
  };
  return { render, timers, tick() { const [id, timer] = [...timers][0]; timers.delete(id); timer.callback(); return render(); } };
}
const control = tree => tree.props.children[2].props.children[1].props.children[0];

test('starts automatically on entry and advances after five seconds', () => {
  const app = mount();
  let tree = app.render();
  assert.equal(app.timers.size, 1);
  assert.equal([...app.timers.values()][0].delay, 5000);
  assert.equal(tree.props.children[1].props.children[1].props.children[1].props.children, 'A');
  tree = app.tick();
  assert.equal(tree.props.children[1].props.children[1].props.children[1].props.children, 'B');
});

test('Play resumes even while the pointer stays inside the carousel', () => {
  const app = mount();
  let tree = app.render();
  tree.props.onMouseEnter?.(); tree = app.render();
  control(tree).props.onPointerDown();
  tree.props.onFocusCapture(); tree = app.render();
  control(tree).props.onClick(); tree = app.render();
  assert.equal(app.timers.size, 0, 'Pause stops the timer');
  control(tree).props.onPointerDown();
  control(tree).props.onClick(); tree = app.render();
  assert.equal(control(tree).props['aria-label'], 'Pausar cambio automático');
  assert.equal(app.timers.size, 1, 'Play schedules the timer without mouse leave');
});

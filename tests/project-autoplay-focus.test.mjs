import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('pointer Pause stays paused after focus and pointer leave', () => {
  const source = readFileSync('src/components/ProjectSpotlight.tsx', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const state = [];
  let cursor = 0;
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in state)) state[i] = initial;
      return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }];
    },
    useRef(initial) {
      const i = cursor++;
      if (!(i in state)) state[i] = { current: initial };
      return state[i];
    },
    useEffect() {},
  };
  const exports = {};
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(code, { exports, require: name =>
    name === 'react' ? react : name === 'react/jsx-runtime' ? { jsx, jsxs: jsx } :
    name.endsWith('.css') ? { default: {} } : { default: () => null },
  });
  const render = () => {
    cursor = 0;
    return exports.ProjectSpotlight({ projects: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }], onOpen() {} });
  };
  const control = tree => tree.props.children[2].props.children[1].props.children[0];
  let tree = render();
  tree.props.onMouseEnter?.(); tree = render();
  assert.equal(control(tree).props['aria-label'], 'Pausar cambio automático');
  control(tree).props.onPointerDown?.();
  tree.props.onFocusCapture(); tree = render();
  control(tree).props.onClick(); tree = render();
  tree.props.onMouseLeave?.(); tree = render();
  assert.equal(control(tree).props['aria-label'], 'Reanudar cambio automático');
  control(tree).props.onPointerDown?.();
  control(tree).props.onClick(); tree = render();
  assert.equal(control(tree).props['aria-label'], 'Pausar cambio automático');
});

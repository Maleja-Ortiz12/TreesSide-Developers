import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Render the production carousel/catalog and drive their public events against a fake window; no server or build.
function harness({ pathname = '/proyectos', hash = '' } = {}) {
  const cache = new Map(), pushes = [], history = [], dispatched = [], listeners = new Map();
  const location = { pathname, search: '', hash, get href() { return `http://test${this.pathname}${this.search}${this.hash}`; } };
  const go = (kind, url) => {
    history.push([kind, url]);
    const next = new URL(url, location.href);
    Object.assign(location, { pathname: next.pathname, search: next.search, hash: next.hash });
  };
  const window = {
    location,
    history: { state: null, pushState: (_, __, url) => go('push', url), replaceState: (_, __, url) => go('replace', url) },
    addEventListener: (type, listener) => listeners.set(type, [...(listeners.get(type) ?? []), listener]),
    removeEventListener: (type, listener) => listeners.set(type, (listeners.get(type) ?? []).filter(item => item !== listener)),
    dispatchEvent: event => { dispatched.push(event.type); for (const listener of listeners.get(event.type) ?? []) listener(event); return true; },
  };
  class HashChangeEvent { constructor(type, init = {}) { Object.assign(this, init, { type }); } }
  // Minimal hook runtime: state survives re-renders, effects are collected per render and run on demand.
  const hooks = { cells: [], index: 0, effects: [] };
  const react = {
    useState: initial => {
      const index = hooks.index++, cells = hooks.cells;
      if (!(index in cells)) cells[index] = initial;
      return [cells[index], value => { cells[index] = typeof value === 'function' ? value(cells[index]) : value; }];
    },
    useRef: initial => ({ current: initial ?? null }), useEffect: effect => hooks.effects.push(effect), useId: () => 'id',
    useSyncExternalStore: (_, __, server) => server(), useCallback: fn => fn, useMemo: fn => fn(),
  };
  const value = { get: () => 0, set() {}, jump() {} };
  const motion = { motion: new Proxy({}, { get: (_, name) => `motion.${String(name)}` }), useAnimationFrame() {}, useInView: () => true,
    useMotionValue: () => value, useReducedMotion: () => false, useSpring: () => value, useTransform: () => value };
  const jsx = (type, props) => ({ type, props });
  function load(target) {
    target = path.resolve(target);
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} }; cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, window, HashChangeEvent, URL, URLSearchParams, require: spec => {
      if (spec === 'react-dom') return { createPortal: node => node }; // modal portals to <body>; render in place for the harness
      if (spec === 'react') return react;
      if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (spec === 'motion/react') return motion;
      if (spec === 'next/link' || spec === 'next/image') return { default: spec };
      if (spec === 'next/navigation') return { useRouter: () => ({ push: href => pushes.push(href) }) };
      if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
      if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
      const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(target), spec);
      const resolved = ['', '.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(file => existsSync(file) && statSync(file).isFile());
      assert.ok(resolved, spec); return load(resolved);
    } });
    return module.exports;
  }
  // Each component gets its own hook slots, like separate React fibers.
  const mount = render => {
    const own = { cells: [] };
    let effects = [];
    return {
      render() { Object.assign(hooks, { cells: own.cells, index: 0, effects: [] }); const tree = render(); effects = hooks.effects; return tree; },
      effects: () => effects.map(effect => effect()),
    };
  };
  return { load, mount, window, location, history, dispatched, listeners, pushes };
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const named = (tree, name) => nodes(tree).filter(node => typeof node.type === 'function' && node.type.name === name);
const modalOf = tree => named(tree, 'ProjectModal')[0];
const projects = h => Array.from(h.load('src/data/content.ts').FEATURED_PROJECTS);

// Renders both carousel rows down to their anchors (first lap and aria-hidden copies).
function carouselAnchors(h) {
  const tree = h.mount(() => h.load('src/components/motion/ProjectCarousel.tsx').ProjectCarousel()).render();
  return named(tree, 'Row').flatMap(row => named(h.mount(() => row.type(row.props)).render(), 'Item'))
    .map(item => ({ copy: item.props.copy === true, project: item.props.project, anchor: item.type(item.props) }));
}
const click = (init = {}) => {
  const event = { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, defaultPrevented: false, prevented: 0, ...init };
  event.preventDefault = () => { event.defaultPrevented = true; event.prevented++; };
  return event;
};
function catalog(h) {
  const section = h.mount(() => h.load('src/components/ProjectsSection.tsx').ProjectsSection());
  section.render();
  const cleanups = section.effects();
  return { section, cleanups, modal: () => modalOf(section.render()) };
}

test('S2 a plain left click on a carousel item opens it in place via the URL fragment', () => {
  const h = harness(), items = carouselAnchors(h);
  assert.ok(items.length > 0);
  const { project, anchor } = items.find(item => !item.copy);
  const event = click();
  anchor.props.onClick(event);
  assert.equal(event.prevented, 1, 'native navigation is prevented');
  assert.deepEqual(h.history, [['push', `#${project.id}`]]);
  assert.equal(h.location.pathname + h.location.hash, `/proyectos#${project.id}`);
  assert.deepEqual(h.dispatched, ['hashchange']);
});

test('S2 modifier and middle clicks on a carousel item keep native navigation', () => {
  for (const init of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    const h = harness(), { anchor } = carouselAnchors(h).find(item => !item.copy);
    const event = click(init);
    anchor.props.onClick(event);
    assert.equal(event.prevented, 0, JSON.stringify(init));
    assert.deepEqual(h.history, [], JSON.stringify(init));
    assert.deepEqual(h.dispatched, [], JSON.stringify(init));
    assert.equal(h.location.hash, '', JSON.stringify(init));
  }
  // Outside the catalog page there is no modal to open, so the link navigates natively.
  const h = harness({ pathname: '/' }), { anchor } = carouselAnchors(h).find(item => !item.copy);
  const event = click();
  anchor.props.onClick(event);
  assert.equal(event.prevented, 0);
  assert.deepEqual(h.history, []);
  assert.deepEqual(h.dispatched, []);
});

test('S2 carousel anchors keep the /proyectos#<id> fallback and inert copies (PRESERVE)', () => {
  const items = carouselAnchors(harness());
  assert.ok(items.some(item => item.copy) && items.some(item => !item.copy));
  for (const { copy, project, anchor } of items) {
    assert.equal(anchor.type, 'a');
    assert.equal(anchor.props.href, `/proyectos#${project.id}`);
    assert.equal(anchor.props['data-carousel-item'], '');
    assert.equal(anchor.props.tabIndex, copy ? -1 : undefined, project.id);
    assert.equal(anchor.props['aria-hidden'], copy ? true : undefined, project.id);
  }
});

test('S1 /proyectos#<id> opens the matching published project modal on arrival', () => {
  const h = harness({ hash: '#equipo-ocho80' }), { modal } = catalog(h);
  assert.equal(modal().props.project.id, 'equipo-ocho80');
  assert.equal(modal().props.project, projects(h).find(project => project.id === 'equipo-ocho80'));
  assert.deepEqual(h.history, [], 'arrival does not rewrite history');
});

test('S1 unknown or unpublished fragments open nothing', () => {
  for (const hash of ['', '#', '#no-existe', '#equipo-tengoya', '#proyectos', '#carrusel']) {
    const h = harness({ hash }), { modal } = catalog(h);
    assert.equal(modal().props.project, null, hash);
    assert.deepEqual(h.history, [], hash);
  }
});

test('S1 hashchange opens the matching project, ignores unknown ids and Back (no match) closes it', () => {
  const h = harness(), { modal, cleanups } = catalog(h);
  assert.equal(modal().props.project, null);
  Object.assign(h.location, { hash: '#equipo-la-lupe' }); h.window.dispatchEvent({ type: 'hashchange' });
  assert.equal(modal().props.project.id, 'equipo-la-lupe');
  Object.assign(h.location, { hash: '' }); h.window.dispatchEvent({ type: 'hashchange' });
  assert.equal(modal().props.project, null, 'Back to the bare page closes the modal');
  Object.assign(h.location, { hash: '#no-existe' }); h.window.dispatchEvent({ type: 'hashchange' });
  assert.equal(modal().props.project, null);
  for (const cleanup of cleanups) cleanup?.();
  assert.deepEqual(h.listeners.get('hashchange'), [], 'listener removed on unmount');
});

test('S2 carousel click opens the same project modal in the catalog without leaving the page', () => {
  const h = harness(), { modal } = catalog(h);
  const { project, anchor } = carouselAnchors(h).find(item => item.copy);
  anchor.props.onClick(click());
  assert.equal(modal().props.project.id, project.id);
  assert.equal(h.location.pathname, '/proyectos');
});

test('S1 closing clears the fragment with replaceState and keeps the contact flow', () => {
  const h = harness({ hash: '#equipo-ocho80' }), { modal } = catalog(h);
  const open = modal();
  open.props.onClose();
  open.props.onContactClick();
  assert.deepEqual(h.history, [['replace', '/proyectos']]);
  assert.equal(h.location.hash, '');
  assert.deepEqual(h.pushes, ['/contacto?proyecto=equipo-ocho80']);
  assert.equal(modal().props.project, null);
  assert.deepEqual(h.dispatched, [], 'clearing the fragment does not re-trigger hash handling');
});

test('S1 catalog cards still open the modal and closing it leaves history untouched (PRESERVE)', () => {
  const h = harness(), { section, modal } = catalog(h);
  const card = nodes(section.render()).find(node => node.props?.['data-project'] === 'equipo-la-lupe');
  card.props.onClick();
  assert.equal(modal().props.project.id, 'equipo-la-lupe');
  modal().props.onClose();
  assert.equal(modal().props.project, null);
  assert.deepEqual(h.history, []);
});

// S1 browser evidence (odd/tasks/projects-modal.md L5): the overlay rendered inside #proyectos sat in a
// transformed ancestor, so `position: fixed` followed the section and focusing it scrolled the page down.
test('S1 modal renders over the viewport and focus moves never scroll the page', () => {
  const source = readFileSync('src/components/ProjectModal.tsx', 'utf8');
  assert.match(source, /import \{ createPortal \} from 'react-dom'/);
  assert.match(source, /createPortal\([\s\S]*document\.body\)/, 'overlay is portalled to <body>');
  assert.match(source, /\(first \?\? panel\.current\)\?\.focus\(\{ preventScroll: true \}\)/);
  assert.match(source, /opener\?\.focus\(\{ preventScroll: true \}\)/);
  // L6: styled-jsx only scopes JSX it returns; a variable-held overlay lost `position: fixed`.
  assert.match(source, /return <BodyPortal><div className="project-overlay" style=\{OVERLAY_STYLE\}/);
  // L7: the root overlay is not scoped by styled-jsx in the browser; its fixed viewport layout is inline.
  assert.match(source, /OVERLAY_STYLE[^=]*= \{ position: 'fixed', inset: 0, zIndex: 200/);
  assert.doesNotMatch(source, /const overlay = </);
});

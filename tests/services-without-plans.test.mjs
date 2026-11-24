import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// S1: plans live only on /planes; every service page renders without plan cards and links to /planes.
// Production modules rendered without a server; function components are expanded to their markup.
function harness() {
  const cache = new Map();
  const jsx = (type, props) => ({ type, props });
  const react = { useState: initial => [initial, () => {}], useSyncExternalStore: (_, __, server) => server(), useEffect: () => {}, useRef: () => ({ current: null }), useId: () => 'id' };
  function load(target) {
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} }; cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, window: {}, URL, URLSearchParams,
      require: spec => {
        if (spec === 'react') return { ...react, default: react };
        if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
        if (spec === '@/components/SitePage') return { SitePage: 'SitePage' };
        if (spec === '@/components/home/HomeClosing') return { HomeClosing: 'HomeClosing' };
        if (spec === 'next/link' || spec === 'next/image') return { default: spec };
        if (spec === 'next/navigation') return { notFound: () => { throw Error('404'); } };
        if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
        if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
        const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(target), spec);
        const resolved = ['', '.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(file => existsSync(file) && statSync(file).isFile());
        assert.ok(resolved, `module ${spec}`); return load(resolved);
      },
    });
    return module.exports;
  }
  return { load: file => load(path.resolve(file)) };
}
const expand = tree => {
  if (!tree || typeof tree !== 'object') return tree;
  if (Array.isArray(tree)) return tree.map(expand);
  if (typeof tree.type === 'function') return expand(tree.type(tree.props));
  return { ...tree, props: { ...tree.props, children: [tree.props?.children].flat(Infinity).map(expand) } };
};
const nodes = tree => !tree || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(nodes) : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : Array.isArray(tree) ? tree.map(text).join('') : [tree.props?.children].flat(Infinity).map(text).join('');
const links = tree => nodes(tree).filter(node => node.type === 'next/link' || node.type === 'a');

const h = harness();
const { SERVICE_CATEGORIES, LEGACY_SERVICE_CATEGORIES } = h.load('src/data/serviceCategories/index.ts');
const { CUSTOM_LAYOUTS } = h.load('src/components/services/layouts/index.ts');
const ALL = [...SERVICE_CATEGORIES, ...LEGACY_SERVICE_CATEGORIES];
const render = async slug => expand(await h.load('src/app/servicios/[categoria]/page.tsx').default({ params: Promise.resolve({ categoria: slug }) }));

test('S1 covers every service page, including the custom layouts and the legacy combined page', () => {
  const slugs = ALL.map(category => category.slug);
  for (const slug of ['restaurantes', 'videojuegos', 'streaming', 'redes-sociales']) {
    assert.ok(CUSTOM_LAYOUTS[slug], `${slug} custom layout`);
    assert.ok(slugs.includes(slug), slug);
  }
  assert.ok(slugs.includes('streaming-y-redes'), 'legacy page');
  assert.equal(slugs.length, 17);
});

for (const category of ALL) {
  test(`S1 /servicios/${category.slug} shows no plan section or plan cards`, async () => {
    const tree = await render(category.slug), copy = text(tree);
    for (const id of ['planes', 'plans-title', 'planes-title']) assert.ok(!nodes(tree).some(node => node.props?.id === id), `no #${id}`);
    assert.ok(!copy.includes('Consultar este plan'), 'no "Consultar este plan"');
    assert.ok(!copy.includes('Por cotizar'), 'no plan price');
    assert.ok(!links(tree).some(link => String(link.props.href).includes('opcion=')), 'no plan enquiry links');
    for (const plan of category.plans.items) {
      assert.ok(!copy.includes(plan.summary), `${plan.name}: no plan summary`);
      for (const item of plan.scope) assert.ok(!copy.includes(item), `${plan.name}: no plan scope "${item}"`);
      if (plan.billing) assert.ok(!copy.includes(`Tipo de facturación: ${plan.billing}`), `${plan.name}: no billing`);
    }
  });

  test(`S1 /servicios/${category.slug} links to /planes with a visible "Ver planes" and keeps its service enquiries`, async () => {
    const tree = await render(category.slug);
    // Some heroes already offer their own /planes link (logística: "Conoce los planes"); exactly one says "Ver planes".
    const toPlans = links(tree).filter(link => link.props.href === '/planes' && text(link).trim() === 'Ver planes');
    assert.equal(toPlans.length, 1, 'one "Ver planes" link to /planes');
    const block = nodes(tree).find(node => node.props?.['data-plans-link'] !== undefined);
    assert.ok(block, 'plans link block');
    assert.ok(nodes(block).includes(toPlans[0]), 'link inside its block');
    assert.match(text(block), /¿Buscas un plan\?/);
    const contact = links(tree).filter(link => String(link.props.href).startsWith('/contacto'));
    assert.ok(contact.length, 'contact CTA kept');
    for (const link of contact) assert.equal(new URL(link.props.href, 'http://test').searchParams.get('servicio'), category.slug);
  });
}

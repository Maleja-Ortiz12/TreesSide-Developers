import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Render production components and exercise their public events, without a server or sends.
function harness(selected = null) {
  const cache = new Map(), effects = [], pushes = [], focus = [];
  const controls = ['first', 'last'].map(name => ({ focus: () => { document.activeElement = controls.find(control => control.name === name); focus.push(name); }, name }));
  const opener = { focus: () => focus.push('opener') };
  const document = { activeElement: opener };
  const panel = { querySelectorAll: () => controls, focus: () => focus.push('panel'), contains: element => controls.includes(element) };
  const jsx = (type, props) => ({ type, props });
  const react = { useState: initial => [initial === null ? selected : initial, () => {}], useRef: () => ({ current: panel }), useEffect: effect => effects.push(effect), useId: () => 'project-title' };
  function load(target) {
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} }; cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, document, window: {}, URL, URLSearchParams,
      require: spec => {
        if (spec === 'react-dom') return { createPortal: node => node }; // modal portals to <body>; render in place for the harness
        if (spec === 'react') return react;
        if (spec === '@/components/SitePage') return { SitePage: 'SitePage' };
        if (spec === '@/components/home/HomeClosing') return { HomeClosing: 'HomeClosing' };
        if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
        if (spec === 'next/link' || spec === 'next/image') return { default: spec };
        if (spec === 'next/navigation') return { useRouter: () => ({ push: href => pushes.push(href) }), notFound: () => { throw Error('404'); } };
        if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
        if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
        const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(target), spec);
        const resolved = ['', '.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(file => existsSync(file) && statSync(file).isFile());
        assert.ok(resolved, `module ${spec}`); return load(resolved);
      },
    });
    return module.exports;
  }
  return { load: file => load(path.resolve(file)), effects, pushes, focus, controls, document };
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');
const links = tree => nodes(tree).filter(node => node.type === 'next/link' || node.type === 'a');
const contactLinks = tree => links(tree).filter(node => typeof node.props.href === 'string' && node.props.href.startsWith('/contacto'));

function modal(h, project, callbacks = {}) {
  return h.load('src/components/ProjectModal.tsx').ProjectModal({ project, onClose: () => {}, onContactClick: () => {}, ...callbacks });
}

test('S3 catalog/modal distinguish client, employment and personal evidence without invented details', () => {
  const h = harness();
  const projects = h.load('src/data/content.ts').FEATURED_PROJECTS;
  const bendita = projects.find(project => project.client === 'Bendita Gracia');
  assert.ok(bendita); assert.equal(bendita.image, '/images/projects/bendita-gracia.webp');
  assert.match(text(modal(h, bendita)), /Proyecto para cliente/);
  for (const project of projects.filter(project => project.owner)) {
    const tree = modal(h, project), copy = text(tree);
    assert.ok(copy.includes(project.experience ? 'Experiencia laboral' : 'Proyecto personal del equipo'), project.title);
    if (project.experience) assert.ok(copy.includes('otra empresa'), project.title);
    for (const author of project.authors) assert.ok(links(tree).some(link => link.props.href === author.portfolio));
    assert.ok(nodes(tree).some(node => node.props?.src === project.image));
  }
  const minimal = { id: 'example', title: 'Example', tag: '', description: 'Descripción existente', image: '/image.webp', category: 'Web' };
  const copy = text(modal(h, minimal));
  assert.match(copy, /Proyecto personal del equipo/);
  assert.doesNotMatch(copy, /Confidencial|2024|Cliente|Año de Desarrollo/);
  assert.equal(modal(h, null), null);
});

test('S3 modal exposes existing case context, solution, delivered features and original public links', () => {
  const h = harness(), projects = h.load('src/data/content.ts').FEATURED_PROJECTS;
  for (const item of h.load('src/data/cases.ts').CASE_STUDIES) {
    const project = projects.find(project => project.title === item.project), tree = modal(h, project), copy = text(tree);
    for (const heading of ['Contexto o necesidad', 'Solución desarrollada', 'Participación del equipo', 'Funcionalidades entregadas']) assert.ok(copy.includes(heading), heading);
    assert.ok(copy.includes(item.context));
    for (const feature of item.solution) assert.ok(copy.includes(feature));
    assert.ok(links(tree).some(link => link.props.href === `/casos/${item.slug}`));
    if (project.projectUrl || item.liveUrl) assert.ok(links(tree).some(link => link.props.href === (project.projectUrl || item.liveUrl)));
  }
  const project = { id: 'custom', title: 'Custom', description: 'Existing summary', detailedDescription: 'Existing detail', features: ['Existing feature'], category: 'Web', image: '/custom.webp' };
  assert.ok(text(modal(h, project)).includes('Existing detail'));
  assert.ok(text(modal(h, project)).includes('Existing feature'));
});

test('S8 dialog has accessible semantics, Escape, focus wrapping/restoration and unchanged callback order', () => {
  const h = harness(), calls = [];
  const project = h.load('src/data/content.ts').FEATURED_PROJECTS[0];
  const tree = modal(h, project, { onClose: () => calls.push('close'), onContactClick: () => calls.push('contact') });
  const dialog = nodes(tree).find(node => node.props?.role === 'dialog');
  assert.ok(dialog); assert.equal(dialog.props['aria-modal'], true);
  assert.ok(nodes(tree).some(node => node.type === 'h2' && node.props.id === dialog.props['aria-labelledby']));
  const cleanups = h.effects.map(effect => effect());
  assert.equal(h.focus.at(-1), 'first');
  let prevented = 0;
  const key = (key, shiftKey = false) => dialog.props.onKeyDown({ key, shiftKey, preventDefault: () => prevented++ });
  h.document.activeElement = h.controls[1]; key('Tab'); assert.equal(h.focus.at(-1), 'first');
  h.document.activeElement = h.controls[0]; key('Tab', true); assert.equal(h.focus.at(-1), 'last');
  key('Escape'); assert.deepEqual(calls, ['close']); assert.equal(prevented, 3);
  calls.length = 0;
  nodes(tree).find(node => node.type === 'button' && text(node).includes('Quiero un proyecto similar')).props.onClick();
  assert.deepEqual(calls, ['close', 'contact']);
  for (const cleanup of cleanups) cleanup?.(); assert.equal(h.focus.at(-1), 'opener');
});

test('S3 project cards and selected-project enquiry preserve catalog/filter behavior', () => {
  const initial = harness(), project = initial.load('src/data/content.ts').FEATURED_PROJECTS[0];
  const h = harness(project), tree = h.load('src/components/ProjectsSection.tsx').ProjectsSection();
  const modalNode = nodes(tree).find(node => typeof node.type === 'function' && node.type.name === 'ProjectModal');
  modalNode.props.onContactClick(); assert.deepEqual(h.pushes, [`/contacto?proyecto=${project.id}`]);
  const cards = nodes(tree).filter(node => node.props?.['data-project']);
  assert.equal(cards.length, h.load('src/data/content.ts').FEATURED_PROJECTS.length);
  for (const card of cards) assert.match(text(card), /Proyecto para cliente|Proyecto personal del equipo|Experiencia laboral/);
  assert.ok(nodes(tree).some(node => node.props?.['aria-label'] === 'Filtrar proyectos'));
});

test('S4 About prioritizes traceable work and business audience instead of technology/contract counts', () => {
  const h = harness(), tree = h.load('src/components/about/AboutMockup.tsx').AboutMockup();
  assert.match(text(tree), /negocios|emprendimientos/);
  assert.match(text(tree), /no son contratos|no se presentan como contratos/);
  const proof = nodes(tree).find(node => node.props?.['data-about-stats'] !== undefined);
  assert.ok(proof); assert.doesNotMatch(text(proof), /\d|tecnologías/);
  for (const href of ['/proyectos', '/equipo', '/casos/la-lupe']) assert.ok(links(tree).some(link => link.props.href === href));
  assert.ok(nodes(tree).some(node => node.props?.src === '/images/mockup/about-branch.webp'));
  assert.ok(nodes(tree).some(node => node.props?.['data-about-purpose'] !== undefined));
});

test('S4 shared process names concrete deliverables without indefinite support', () => {
  const h = harness(), steps = h.load('src/data/content.ts').PROCESS_STEPS;
  assert.deepEqual(Array.from(steps, step => step.title), ['Descubrimiento', 'Diseño', 'Desarrollo', 'Lanzamiento']);
  assert.deepEqual(Array.from(steps, step => step.description), ['Necesidades, propuesta y alcance.', 'Estructura y diseño para aprobación.', 'Avances revisables.', 'Publicación, entrega y capacitación según el alcance contratado.']);
  const tree = h.load('src/components/services/ServicesProcess.tsx').ServicesProcess();
  for (const step of steps) assert.ok(text(tree).includes(step.description));
  assert.doesNotMatch(text(tree), /Soporte y mejora continua/);
});

test('S3 cases retain functional evidence without unsupported traffic or commercial counts', async () => {
  const h = harness(), cases = h.load('src/data/cases.ts').CASE_STUDIES;
  for (const item of cases) {
    assert.doesNotMatch(JSON.stringify(item), /15\.000|1\.122|miles de|visitas diarias/);
    assert.ok(item.solution.length); assert.ok(item.results.length);
    const tree = await h.load('src/app/casos/[slug]/page.tsx').default({ params: Promise.resolve({ slug: item.slug }) });
    assert.match(text(tree), /Proyecto personal del equipo/);
    const project = h.load('src/data/content.ts').FEATURED_PROJECTS.find(project => project.title === item.project);
    assert.ok(contactLinks(tree).some(link => link.props.href === `/contacto?proyecto=${project.id}`));
  }
});

test('S8 every existing service template/custom layout/plan carries a validated service slug and preserves scope', async () => {
  const h = harness(), { SERVICE_CATEGORIES, LEGACY_SERVICE_CATEGORIES } = h.load('src/data/serviceCategories/index.ts');
  const { CUSTOM_LAYOUTS } = h.load('src/components/services/layouts/index.ts');
  for (const category of [...SERVICE_CATEGORIES, ...LEGACY_SERVICE_CATEGORIES]) {
    let tree = await h.load('src/app/servicios/[categoria]/page.tsx').default({ params: Promise.resolve({ categoria: category.slug }) });
    if (CUSTOM_LAYOUTS[category.slug]) tree = CUSTOM_LAYOUTS[category.slug]({ category });
    const planNode = nodes(tree).find(node => typeof node.type === 'function' && node.type.name === 'CategoryPlans');
    if (planNode) tree = [tree, planNode.type(planNode.props)].map(tree => ({ type: 'Fragment', props: { children: tree } }));
    const root = { type: 'Fragment', props: { children: tree } };
    assert.ok(contactLinks(root).length, category.slug);
    for (const link of contactLinks(root)) assert.equal(new URL(link.props.href, 'http://test').searchParams.get('servicio'), category.slug, category.slug);
    assert.match(text(root), /Consultar este plan/);
    for (const plan of category.plans.items) { assert.ok(text(root).includes(plan.name)); assert.ok(text(root).includes(plan.summary)); }
  }
  const cards = h.load('src/components/ServicesSection.tsx').ServicesSection();
  const serviceCategory = h.load('src/data/serviceCategories/index.ts').serviceCategory;
  for (const card of nodes(cards).filter(node => node.props?.['data-service'])) {
    const cta = contactLinks(card)[0]; assert.ok(cta, card.props['data-service']);
    assert.ok(serviceCategory(new URL(cta.props.href, 'http://test').searchParams.get('servicio')));
  }
  const categories = h.load('src/components/services/ServiceCategories.tsx').ServiceCategories();
  for (const category of SERVICE_CATEGORIES) {
    assert.ok(links(categories).some(link => link.props.href === `/servicios/${category.slug}`));
    assert.ok(links(categories).some(link => link.props.href === `/contacto?servicio=${category.slug}`));
  }
});

test('S7 existing email stays centralized and pending confirmation is documented; metadata keeps full brand', () => {
  const h = harness(); assert.equal(h.load('src/data/content.ts').CONTACT_INFO.email, 'correo@softzenkododevs.com');
  const doc = readFileSync('docs/client-conversion.md', 'utf8'); assert.match(doc, /correo@softzenkododevs\.com/); assert.match(doc, /pendiente|confirmar/i);
  const layout = readFileSync('src/app/layout.tsx', 'utf8'); assert.match(layout, /email: CONTACT_INFO.email/); assert.match(layout, /TreesSide Developers/);
  assert.doesNotMatch(readFileSync('src/components/ProjectsSection.tsx', 'utf8'), /Catálogo de TreesSide y/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const RAMIREZ = 'Jorge Luis Ramírez Trochez';
const PUENTES = 'Jorge Luis Puentes Brochero';
const REMOVED = [
  ['Gametroz', 'equipo-gametroz'],
  ['Fundación Propósito Posible', 'equipo-fundacion-proposito-posible'],
  ['ALTiora Inmobiliaria', 'equipo-altiora-inmobiliaria'],
  ['CV Automatic', 'equipo-cv-automatic'],
  ['TengoYa', 'equipo-tengoya'], ['CarWeb', 'equipo-carweb'], ['Histech', 'equipo-histech'],
  ['Robot Alejo 2.0', 'equipo-robot-alejo-2-0'],
  ['Migración Pega → UiPath', 'equipo-migracion-pega-uipath'],
];

// Execute public data exports and component render functions; no build, server, or stored state.
function harness() {
  const cache = new Map();
  const jsx = (type, props) => ({ type, props });
  function load(target) {
    target = path.resolve(target);
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} }; cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, URL, URLSearchParams, require: spec => {
      if (spec === 'react-dom') return { createPortal: node => node }; // modal portals to <body>; render in place for the harness
      if (spec === 'react') return { useState: value => [value, () => {}], useRef: () => ({ current: null }), useEffect: () => {}, useId: () => 'title' };
      if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (spec === 'next/link' || spec === 'next/image') return { default: spec };
      if (spec === 'next/navigation') return { useRouter: () => ({}), notFound: () => { throw Error('404'); } };
      if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
      if (spec === 'motion/react') return {};
      if (spec === '@/components/SitePage') return { SitePage: 'SitePage' };
      if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
      const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(target), spec);
      const resolved = ['', '.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(file => existsSync(file) && statSync(file).isFile());
      assert.ok(resolved, spec); return load(resolved);
    } });
    return module.exports;
  }
  return { load };
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');

test('S3-S6 exclusive personal and employer projects are absent from published team and catalog fixtures', () => {
  const { load } = harness();
  const members = load('src/data/team.ts').TEAM_MEMBERS;
  const catalog = load('src/data/content.ts').FEATURED_PROJECTS;
  for (const [title, id] of REMOVED) {
    assert.ok(!members.some(member => member.projects.some(project => project.name === title)), title);
    assert.ok(!catalog.some(project => project.id === id || project.title === title), id);
  }
  assert.equal(catalog.length, 23);
});

test('S5-S6 shared aliases retain both credits and all member identities, skills and portfolios', () => {
  const { load } = harness();
  const members = load('src/data/team.ts').TEAM_MEMBERS;
  assert.equal(members.length, 4);
  const ramirez = members.find(member => member.name === RAMIREZ);
  assert.equal(ramirez.portfolio, 'https://www.jorgeramirez.site/');
  assert.equal(ramirez.photo, '/images/team/jorge-ramirez.webp');
  assert.match(ramirez.education, /Desarrollador RPA UiPath/);
  assert.match(ramirez.description, /Automation Engineer/);
  assert.equal(ramirez.contributions.length, 3);
  assert.equal(Array.from(ramirez.skills).join('|'), 'UiPath|Python|Bizagi|SAP|SQL|OpenAI|Power BI|Next.js|Azure');
  for (const [title, alias, author] of [['Emisoras Latinas', 'Emisoras Latinas', 'María Alejandra Ortiz Páez'], ['Radio Navidad', 'Christmas Radio Navidad', 'Ronaldo Delgado Correa']]) {
    assert.ok(ramirez.projects.some(project => project.name === alias && project.sameAs === title));
    const matches = load('src/data/content.ts').FEATURED_PROJECTS.filter(project => project.title === title);
    assert.equal(matches.length, 1);
    assert.equal(Array.from(matches[0].authors, item => item.name).join('|'), `${author}|${RAMIREZ}`);
    const modal = load('src/components/ProjectModal.tsx').ProjectModal({ project: matches[0], onClose() {}, onContactClick() {} });
    assert.ok(text(modal).includes(RAMIREZ));
    assert.ok(nodes(modal).some(node => node.props?.href === ramirez.portfolio));
  }
  const puentes = members.find(member => member.name === PUENTES);
  assert.equal(Array.from(puentes.projects, project => project.name).join('|'), 'Floraltech E-Commerce|Atherium 3D Game|Otaku Portal|API de Tienda + Asistente IA|Portfolio CMS|Dashboard BI · Superstore|EDA · Renta Ciudadana|Análisis de Ventas de Cafetería');
  const catalog = load('src/data/content.ts').FEATURED_PROJECTS;
  for (const member of members.filter(member => member !== ramirez)) {
    for (const project of member.projects) assert.ok(catalog.some(item => item.title === (project.sameAs ?? project.name) && item.authors.some(author => author.name === member.name)), project.name);
  }
  assert.equal(load('src/data/content.ts').CONTACT_INFO.email, 'correo@softzenkododevs.com');
});

test('S3-S6 public catalog, member view, Home frames and carousel inputs no longer publish excluded projects', () => {
  const { load } = harness();
  const catalog = load('src/components/ProjectsSection.tsx').ProjectsSection();
  const cards = nodes(catalog).filter(node => node.props?.['data-project']);
  assert.equal(cards.length, 23);
  const team = load('src/components/TeamGallery.tsx').TeamGallery();
  assert.ok(text(team).includes(RAMIREZ));
  assert.ok(text(team).includes('Christmas Radio Navidad'));
  const home = load('src/components/home/HomeRedesign.tsx').HomeRedesign();
  const artwork = nodes(home).find(node => typeof node.type === 'function' && node.type.name === 'HeroArtwork');
  const frames = artwork.type(artwork.props).props.frames;
  const carousel = load('src/components/motion/ProjectCarousel.tsx').ProjectCarousel();
  const rows = nodes(carousel).filter(node => node.props?.projects).flatMap(node => Array.from(node.props.projects));
  for (const [title, id] of REMOVED) {
    assert.ok(!text(team).includes(title), title);
    assert.ok(!cards.some(card => card.props['data-project'] === id), id);
    assert.ok(!JSON.stringify(frames).includes(id), `Home ${id}`);
    assert.ok(!rows.some(project => project.id === id), `carousel ${id}`);
  }
  for (const id of ['equipo-emisoras-latinas', 'equipo-radio-navidad', 'equipo-floraltech-e-commerce']) {
    assert.ok(cards.some(card => card.props['data-project'] === id));
    assert.ok(JSON.stringify(frames).includes(id));
    assert.ok(rows.some(project => project.id === id));
  }
});

test('S4 TengoYa has no case, generated route, metadata, index link or sitemap URL; shared cases still publish', async () => {
  const { load } = harness();
  const cases = load('src/data/cases.ts');
  assert.equal(cases.caseForProject('TengoYa'), undefined);
  assert.equal(cases.caseHref('TengoYa'), undefined);
  const route = load('src/app/casos/[slug]/page.tsx');
  assert.equal(Array.from(route.generateStaticParams(), item => item.slug).join('|'), 'la-lupe|emisoras-latinas');
  assert.equal(JSON.stringify(await route.generateMetadata({ params: Promise.resolve({ slug: 'tengoya' }) })), '{}');
  await assert.rejects(route.default({ params: Promise.resolve({ slug: 'tengoya' }) }), /404/);
  const index = load('src/app/casos/page.tsx').default();
  const sitemap = load('src/app/sitemap.ts').default();
  assert.ok(!nodes(index).some(node => node.props?.href === '/casos/tengoya'));
  assert.ok(!sitemap.some(item => item.url.endsWith('/casos/tengoya')));
  for (const slug of ['la-lupe', 'emisoras-latinas']) {
    assert.ok(nodes(index).some(node => node.props?.href === `/casos/${slug}`));
    assert.ok(sitemap.some(item => item.url.endsWith(`/casos/${slug}`)));
    assert.ok((await route.generateMetadata({ params: Promise.resolve({ slug }) })).title);
    const tree = await route.default({ params: Promise.resolve({ slug }) });
    assert.ok(text(tree).includes(slug === 'la-lupe' ? 'La Lupe' : RAMIREZ));
  }
});

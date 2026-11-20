import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the production components without a server, network requests or real enquiries.
function loader(reduced = false) {
  const cache = new Map(), scrolled = [];
  const jsx = (type, props) => ({ type, props });
  const react = { useSyncExternalStore: (_, snapshot) => snapshot(), useState: initial => [initial, () => {}] };
  function load(target) {
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} };
    cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports,
      document: { getElementById: id => ({ scrollIntoView: options => scrolled.push({ id, options }) }) },
      window: { matchMedia: () => ({ matches: reduced }) },
      require: spec => {
        if (spec === 'react') return react;
        if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
        if (spec === 'next/link' || spec === 'next/image') return { default: spec };
        if (spec === 'lucide-react') return new Proxy({}, { get: (_, name) => `icon:${String(name)}` });
        if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, name) => String(name) }) };
        const base = spec.startsWith('@/') ? path.resolve('src', spec.slice(2)) : path.resolve(path.dirname(target), spec);
        const resolved = ['', '.ts', '.tsx'].map(ext => base + ext).find(file => existsSync(file));
        assert.ok(resolved, `module ${spec}`);
        return load(resolved);
      },
    });
    return module.exports;
  }
  return { load: file => load(path.resolve(file)), scrolled };
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');
const links = tree => nodes(tree).filter(node => node.type === 'next/link' || node.type === 'a');
const byText = (tree, label) => links(tree).find(node => text(node).trim() === label);

test('S2 exact proposition and primary actions replace quantity-based proof with verifiable evidence', () => {
  const { load } = loader();
  const hero = load('src/components/Hero.tsx').Hero();
  const headings = nodes(hero).filter(node => node.type === 'h1');
  assert.equal(headings.length, 1);
  assert.equal(text(headings[0]), 'Tu negocio puede vender más y trabajar mejor con el software adecuado');
  assert.ok(text(hero).includes('Creamos páginas web, tiendas y plataformas a medida para negocios que necesitan recibir clientes, organizar su operación y automatizar tareas'));
  assert.equal(byText(hero, 'Cotizar mi proyecto')?.props.href, '/contacto');
  assert.equal(byText(hero, 'Ver proyectos reales')?.props.href, '/proyectos');
  const proof = nodes(hero).find(node => node.props?.['data-home-stats'] !== undefined);
  assert.ok(proof, 'existing proof band stays discoverable');
  assert.doesNotMatch(text(proof), /\d|tecnologías|desarrolladores/);
  for (const href of ['/proyectos#equipo-la-lupe', '/proyectos#equipo-emisoras-latinas', '/equipo']) {
    assert.ok(links(proof).some(link => link.props.href === href), href);
  }
});

test('S2 three business solutions explain audience, problem and capabilities, with contextual enquiries and service discovery', () => {
  const { load } = loader();
  const hero = load('src/components/Hero.tsx').Hero();
  const cards = nodes(hero).filter(node => node.type === 'article' && node.props['data-home-solution']);
  assert.deepEqual(cards.map(card => card.props['data-home-solution']), ['restaurantes', 'ecommerce', 'automatizacion']);
  assert.deepEqual(cards.map(card => text(nodes(card).find(node => node.type === 'h3'))), ['Web para restaurantes', 'Tiendas virtuales', 'Software a medida y automatización']);
  for (const card of cards) {
    const slug = card.props['data-home-solution'];
    const copy = text(card);
    assert.match(copy, /Para quién/);
    assert.match(copy, /Qué resuelve/);
    assert.ok(nodes(card).filter(node => node.type === 'li').length >= 3, `${slug} capabilities`);
    assert.equal(byText(card, 'Cotizar esta solución')?.props.href, `/contacto?servicio=${slug}`);
    assert.equal(byText(card, 'Ver servicio')?.props.href, `/servicios/${slug}`);
  }
  assert.equal(byText(hero, 'Ver todos los servicios')?.props.href, '/servicios');
});

test('S3 demos preserve their identities and provide service and proposal links with exact context', () => {
  const { load } = loader();
  const home = load('src/components/HomeDemos.tsx').HomeDemos();
  const cards = nodes(home).filter(node => node.type === 'article' && node.props['data-demo']);
  assert.equal(cards.length, 3);
  for (const [index, [id, demo, category, kind, component]] of [
    ['la-lupe', 'restaurante', 'restaurantes', 'Restaurante', 'MenuQuoteDemo'],
    ['emisoras-latinas', 'radio', 'streaming', 'Radio', 'RadioDemo'],
    ['calculadora-de-contenedores', 'logistica', 'logistica', 'Logística', 'LoadCalculatorDemo'],
  ].entries()) {
    const card = cards[index];
    assert.equal(card.props['data-demo'], id);
    assert.ok(text(card).includes(`Demo conceptual · ${kind}`));
    assert.ok(nodes(card).some(node => typeof node.type === 'function' && node.type.name === component));
    assert.equal(byText(card, 'Ver servicio')?.props.href, `/servicios/${category}?servicio=${category}&demo=${demo}`);
    assert.equal(byText(card, 'Solicitar una propuesta')?.props.href, `/contacto?servicio=${category}&demo=${demo}`);
    assert.ok(links(card).some(link => link.props.href === (id === 'calculadora-de-contenedores' ? `/proyectos#equipo-${id}` : `/casos/${id}`)));
  }
  assert.ok(text(home).includes('No se guardan ni se envían datos'));
});

test('S1/S8 preserve tab selection, controlled demo panels, source links and reduced-motion scrolling', () => {
  for (const reduced of [false, true]) {
    const { load, scrolled } = loader(reduced);
    const { Hero } = load('src/components/Hero.tsx');
    const { HomeDemos } = load('src/components/HomeDemos.tsx');
    const tabs = () => nodes(Hero()).filter(node => node.props?.['data-demo-tab']);
    assert.deepEqual(tabs().map(text), ['Restaurantes', 'Streaming', 'Logística']);
    for (const [index, id] of ['la-lupe', 'emisoras-latinas', 'calculadora-de-contenedores'].entries()) {
      const tab = tabs()[index];
      assert.equal(tab.props['aria-controls'], `demo-${id}`);
      tab.props.onClick();
      assert.deepEqual(tabs().filter(node => node.props['aria-pressed']).map(node => node.props['data-demo-tab']), [id]);
      assert.deepEqual(nodes(HomeDemos()).filter(node => node.props?.['data-demo'] && !node.props.hidden).map(node => node.props.id), [`demo-${id}`]);
      assert.equal(scrolled.at(-1).id, 'demos');
      assert.equal(scrolled.at(-1).options.behavior, reduced ? 'instant' : 'smooth');
    }
  }
});

test('S3 home project evidence uses existing context, solution, authors, screenshots and available public links', () => {
  const { load } = loader();
  const home = load('src/components/HomeDemos.tsx').HomeDemos();
  const projects = load('src/data/content.ts').FEATURED_PROJECTS;
  const { caseForProject } = load('src/data/cases.ts');
  const cards = nodes(home).filter(node => node.props?.['data-project-card']);
  assert.deepEqual(cards.map(card => card.props['data-project-card']), ['equipo-la-lupe', 'equipo-emisoras-latinas']);
  for (const card of cards) {
    const project = projects.find(project => project.id === card.props['data-project-card']);
    const evidence = caseForProject(project.title);
    const copy = text(card);
    assert.ok(copy.includes('Portafolio del equipo'));
    assert.ok(copy.includes(evidence.context));
    assert.ok(copy.includes(project.description));
    assert.ok(copy.includes('Participación del equipo'));
    for (const author of project.authors) assert.equal(byText(card, author.name)?.props.href, author.portfolio);
    assert.ok(copy.includes('Funcionalidades entregadas'));
    for (const feature of evidence.solution) assert.ok(copy.includes(feature));
    const image = nodes(card).find(node => node.type === 'next/image');
    assert.equal(image.props.src, project.image);
    assert.ok(image.props.sizes, 'responsive image sizing');
    assert.equal(byText(card, 'Ver proyecto')?.props.href, `/proyectos#${project.id}`);
    const publicUrl = project.projectUrl ?? evidence.liveUrl;
    assert.equal(byText(card, 'Visitar sitio público')?.props.href, publicUrl);
    if (publicUrl) assert.match(byText(card, 'Visitar sitio público').props.rel, /noopener/);
  }
});

test('S1/S8 keep the tree, carousel, responsive layouts, focus and reduced-motion safeguards', () => {
  const hero = readFileSync('src/components/home/HeroScene.tsx', 'utf8');
  assert.match(hero, /home-hero\.webp/);
  for (const card of ['restaurante', 'radio', 'logistica']) assert.ok(hero.includes(`data-hero-card="${card}"`));
  assert.match(hero, /prefers-reduced-motion: no-preference/);
  const page = readFileSync('src/app/page.tsx', 'utf8');
  assert.match(page, /<Hero\s*\/>\s*<ProjectCarousel\s*\/>\s*<HomeDemos\s*\/>/);
  const css = readFileSync('src/components/home/Home.module.css', 'utf8');
  assert.match(css, /\.solutionGrid\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media[^}]*max-width:\s*1060px[\s\S]*?\.solutionGrid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.solutions a:focus-visible/);
  assert.match(css, /\.demoActions a:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.ok(page.includes('Tu negocio puede vender más y trabajar mejor con el software adecuado'));
});

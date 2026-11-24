import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Run the actual component functions and event handlers without HTTP or side effects.
function harness(frame = 0) {
  const cache = new Map(), states = new Map();
  let active, cursor;
  const jsx = (type, props) => ({ type, props });
  const react = {
    useState(initial) {
      const values = states.get(active), index = cursor++;
      if (!(index in values)) values[index] = typeof initial === 'function' ? initial() : initial === 0 ? frame : initial;
      return [values[index], value => { values[index] = typeof value === 'function' ? value(values[index]) : value; }];
    },
    useSyncExternalStore: (_subscribe, snapshot) => snapshot(),
    useRef: value => ({ current: value }), useEffect() {},
  };
  function load(relative) {
    const target = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'].map(ext => path.resolve(relative + ext)).find(file => existsSync(file) && statSync(file).isFile());
    assert.ok(target, `component exists: ${relative}`);
    if (cache.has(target)) return cache.get(target).exports;
    const module = { exports: {} };
    cache.set(target, module);
    const code = ts.transpileModule(readFileSync(target, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, URL, URLSearchParams, require: spec => {
      if (spec === 'react') return react;
      if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
      if (spec === 'next/link') return { default: 'a' };
      if (spec === 'next/image') return { default: 'img' };
      if (spec === 'lucide-react') return new Proxy({}, { get: (_, key) => `icon:${String(key)}` });
      if (spec.endsWith('.css')) return { default: new Proxy({}, { get: (_, key) => String(key) }) };
      return load(spec.startsWith('@/') ? `src/${spec.slice(2)}` : path.resolve(path.dirname(target), spec));
    } });
    return module.exports;
  }
  function expand(node) {
    if (Array.isArray(node)) return node.map(expand);
    if (!node || typeof node !== 'object') return node;
    if (typeof node.type === 'function') return render(node.type, node.props);
    return { ...node, props: { ...node.props, children: expand(node.props?.children) } };
  }
  function render(component, props = {}) {
    active = component; cursor = 0;
    if (!states.has(component)) states.set(component, []);
    return expand(component(props));
  }
  return { load, render };
}
const nodes = tree => !tree || typeof tree !== 'object' ? [] : Array.isArray(tree) ? tree.flatMap(nodes) : [tree, ...nodes(tree.props?.children)];
const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : Array.isArray(tree) ? tree.map(text).join('') : text(tree.props?.children);
const byId = (tree, id) => nodes(tree).find(node => node.props.id === id);
const links = tree => nodes(tree).filter(node => node.type === 'a');
const exactLink = (tree, label) => links(tree).find(node => text(node).trim() === label);
function home(frame = 0) {
  const ui = harness(frame);
  const { HomeRedesign } = ui.load('src/components/home/HomeRedesign');
  return { ...ui, tree: ui.render(HomeRedesign) };
}

test('S1/S8 production Home uses isolated sections, not the old hero, carousel or proof strip', () => {
  const source = readFileSync('src/app/page.tsx', 'utf8');
  assert.match(source, /<HomeRedesign\s*\/>/);
  assert.match(source, /<HomeClosing showClosing=\{false\}\s*\/>/);
  assert.doesNotMatch(source, /<Hero|<ProjectCarousel|<HomeDemos/);
  const { tree } = home();
  assert.deepEqual(nodes(tree).filter(n => n.type === 'section' && n.props.id).map(n => n.props.id),
    ['inicio', 'soluciones', 'trabajo', 'propuestas', 'demos', 'proceso-home', 'siguiente-paso']);
  assert.equal(nodes(tree).filter(n => n.type === 'h1').length, 1);
  assert.equal(nodes(tree).filter(n => n.props['data-project-card']).length, 1);
  assert.doesNotMatch(text(tree), /UptownHair|testimonios|proyectos entregados/i);
});

test('S2 exact hero copy, two actions, real capture and two visibly labelled concepts', () => {
  const { tree } = home(), hero = byId(tree, 'inicio');
  assert.equal(text(nodes(hero).find(n => n.type === 'h1')), 'Tu negocio puede vender más y trabajar mejor');
  assert.ok(text(hero).includes('Creamos páginas web, tiendas y software a medida para ayudarte a atraer clientes, organizar tu operación y automatizar tareas'));
  assert.deepEqual(links(hero).map(n => text(n).trim()), ['Cotizar mi proyecto', 'Ver nuestro trabajo']);
  assert.equal(exactLink(hero, 'Cotizar mi proyecto').props.href, '/contacto');
  assert.equal(exactLink(hero, 'Ver nuestro trabajo').props.href, '/proyectos');
  const figures = nodes(hero).filter(n => n.type === 'figure');
  assert.equal(figures.length, 3);
  assert.equal(figures.filter(n => text(n).includes('Diseño conceptual')).length, 2);
  assert.ok(nodes(hero).some(n => n.type === 'img' && n.props.src === '/images/projects/la-lupe.webp'));
  assert.ok(nodes(hero).some(n => n.type === 'img' && n.props.src === '/images/mockup/about-branch.webp' && n.props.alt === ''));
  assert.equal(nodes(hero).filter(n => n.type === 'button').length, 3, 'motion and manual artwork controls belong in the hero');
});

// S7 (admin-concepts-visible-collage): a sliding window over one ordered list.
const SLOT_ORDER = ['captureFrame', 'shopFrame', 'salonFrame'];
const CONCEPT_ASSETS = ['/images/home-concepts/salon.webp', '/images/home-concepts/shop.webp',
  '/images/home-concepts/salon-admin.webp', '/images/home-concepts/restaurant-admin.webp'];
function eligibleCatalog() {
  const { FEATURED_PROJECTS: catalog } = home().load('src/data/content');
  const expected = Array.from(catalog).filter(p => !p.experience && p.image !== '/images/treesside-logo.jpg' && p.id !== 'equipo-uptownhair');
  return { catalog, expected, total: expected.length + CONCEPT_ASSETS.length };
}
const heroFigures = frame => nodes(byId(home(frame).tree, 'hero-collage')).filter(n => n.type === 'figure');
const figureSrc = figure => nodes(figure).find(n => n.type === 'img')?.props.src;

test('S7 every composition promotes the first small card into the large slot', () => {
  const { total } = eligibleCatalog();
  const frames = Array.from({ length: total }, (_, frame) => heroFigures(frame));
  assert.deepEqual(frames[0].map(figureSrc), ['/images/projects/la-lupe.webp', ...CONCEPT_ASSETS.slice(0, 2)], 'first paint keeps La Lupe large with the salon and shop concepts');
  for (let frame = 0; frame < total; frame++) {
    const current = frames[frame], next = frames[(frame + 1) % total];
    assert.deepEqual(current.map(f => f.props.className), SLOT_ORDER, `frame ${frame}: large slot first, then left and right small slots`);
    assert.equal(figureSrc(next[0]), figureSrc(current[1]), `frame ${frame}: left small card becomes the next large card`);
    assert.equal(figureSrc(next[1]), figureSrc(current[2]), `frame ${frame}: right small card moves to the left`);
  }
  assert.equal(new Set(frames.map(f => figureSrc(f[0]))).size, total, 'each item is large exactly once per cycle');
});

test('S12/S7 large-slot cycle covers the eligible catalog and concepts once with truthful media', () => {
  const { catalog, expected, total } = eligibleCatalog();
  const primaries = [];
  for (let frame = 0; frame < total; frame++) {
    const figures = heroFigures(frame);
    assert.equal(figures.length, 3);
    for (const [slot, figure] of figures.entries()) {
      const image = nodes(figure).find(n => n.type === 'img');
      const project = catalog.find(p => p.image === image?.props.src);
      if (slot === 0) primaries.push(project?.id ?? image.props.src);
      if (!project) { assert.match(text(figure), /Diseño conceptual/); assert.doesNotMatch(text(figure), /Portafolio del equipo/); continue; }
      assert.ok(expected.some(p => p.id === project.id), project.id);
      assert.ok(text(figure).includes(project.title));
      assert.match(text(figure), /Portafolio del equipo/);
      assert.doesNotMatch(text(figure), /Web real|cliente|contrat|UptownHair/i);
      if (project.imageLabel) {
        assert.ok(text(figure).includes(project.imageLabel));
        assert.match(text(figure), /Diseño conceptual/);
        assert.doesNotMatch(image.props.alt, /Captura real/);
      }
      assert.equal(image.props.style?.objectFit, project.imageFit ?? 'cover');
      assert.ok(existsSync(`public${image.props.src}`), project.id);
    }
  }
  assert.deepEqual([...primaries].sort(), [...expected.map(p => p.id), ...CONCEPT_ASSETS].sort(), 'every eligible project and concept is large exactly once');
});

test('S9 every hero slot uses the uniform card frame; captures keep their fit and concepts stay complete', () => {
  const { catalog, total } = eligibleCatalog();
  for (let frame = 0; frame < total; frame++) {
    for (const figure of heroFigures(frame)) {
      const image = nodes(figure).find(n => n.type === 'img');
      assert.equal(image.props.style?.aspectRatio, undefined, `frame ${frame}: ${image.props.src} follows the shared CSS frame ratio`);
      if (!catalog.some(p => p.image === image.props.src)) assert.equal(image.props.style?.objectFit, 'contain', `frame ${frame}: ${image.props.src} is shown complete`);
    }
  }
  const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
  assert.match(css, /\.collage figure > img \{[^}]*aspect-ratio: 16 \/ 10;[^}]*object-position: top;/);
});

test('S10 tree shares the relative collage layer behind all three preserved figures', () => {
  const { tree } = home();
  const collage = byId(tree, 'hero-collage');
  assert.ok(collage, 'collage is the controlled motion region');
  assert.equal(nodes(collage).filter(n => n.type === 'figure').length, 3);
  const treeImage = nodes(collage).find(n => n.type === 'img' && n.props.src === '/images/mockup/about-branch.webp');
  assert.ok(treeImage, 'decorative tree is inside the collage, not behind the copy');
  assert.equal(treeImage.props['aria-hidden'], 'true');
  const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
  assert.match(css, /\.collage\s*\{[^}]*position: relative/);
  assert.match(css, /\.treeAccent\s*\{[^}]*z-index: 0/);
  assert.match(css, /\.collage figure\s*\{[^}]*z-index: 1/);
});

test('S12/S2 conceptual badges retain dark text while plain capture captions stay mint', () => {
  const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
  // Exclude badges from the more-specific caption rule, not just a later color override.
  assert.equal(/\.captureFrame figcaption > span:not\(\.conceptLabel\)\s*\{\s*color: #9bffce;\s*\}/.test(css), true,
    'mint caption color must explicitly exclude conceptual badges');
  assert.equal(/\.captureFrame figcaption > span\s*\{/.test(css), false);
  assert.match(css, /\.conceptLabel\s*\{[^}]*color: #073526;[^}]*background: #a0f3cd;/);
  // S7 frame 6 promotes Calculadora de contenedores (labelled illustration) to the large slot.
  const firstCard = nodes(byId(home(6).tree, 'inicio')).find(n => n.type === 'figure');
  assert.ok(text(firstCard).includes('Calculadora de contenedores'));
  const spans = nodes(firstCard).filter(n => n.type === 'span');
  assert.ok(spans.some(n => n.props.className === 'conceptLabel' && text(n).includes('Diseño conceptual')));
  assert.ok(spans.some(n => !n.props.className && text(n) === 'Portafolio del equipo'), 'ordinary portfolio span retains the mint rule');
});

test('S10 all three cards float slowly with staggered 3D depth, modest mobile motion and reduced-motion opt-out', () => {
  const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
  assert.match(css, /\.collage\s*\{[^}]*perspective: 1200px/);
  assert.match(css, /\.collage figure\s*\{[^}]*animation: heroFloat 12s ease-in-out infinite/);
  for (const name of ['captureFrame', 'salonFrame', 'shopFrame']) {
    assert.match(css, new RegExp(`\\.${name}\\s*\\{[^}]*--depth:`));
    assert.match(css, new RegExp(`\\.${name}\\s*\\{[^}]*animation-delay:`));
  }
  assert.match(css, /@keyframes heroFloat\s*\{[\s\S]*?translate3d[\s\S]*?rotateX[\s\S]*?rotateY/);
  assert.match(css, /data-motion='paused'[^}]*animation-play-state: paused/);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*?--float-distance: -3px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation: none !important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.motionControl\s*\{\s*display: none/);
});

test('S10 frame delays and stacking outrank the base figure rule while mobile depth remains modest', () => {
  const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
  // Two classes (0,2,0) outrank .collage figure (0,1,1), whose animation shorthand resets delay.
  // S9: the below-left slot (salonFrame) paints above the right-middle slot (shopFrame).
  for (const [frame, delay, z] of [['captureFrame', '-2s', null], ['salonFrame', '-6s', 3], ['shopFrame', '-10s', 2]]) {
    const block = css.match(new RegExp(String.raw`\.collage \.${frame}\s*\{([^}]+)\}`))?.[1];
    assert.ok(block, `${frame} must outrank the base figure selector`);
    assert.ok(block.includes(`animation-delay: ${delay};`));
    if (z !== null) assert.ok(block.includes(`z-index: ${z};`));
    // Later mobile placement rules must have equal specificity to the new desktop selectors.
    const mobile = css.slice(css.indexOf('@media (max-width: 600px)'));
    assert.match(mobile, new RegExp(String.raw`\.collage \.${frame}\s*\{`));
  }
  assert.match(css, /\.collageScene \.collage figure\s*\{ --depth: 6px; --tilt-x: 2deg; --tilt-y: -2deg;/);
});

test('PRESERVE S10 persistent accessible motion control retains content while hydration is static', () => {
  const ui = harness(), { HeroCollage } = ui.load('src/components/home/HeroCollage');
  const render = () => ui.render(HeroCollage, { children: 'Preserved artwork', frames: [''] });
  const control = () => nodes(render()).find(n => n.type === 'button' && n.props['aria-pressed'] !== undefined);
  assert.equal(text(control()), 'Pausar animación');
  assert.equal(control().props['aria-pressed'], false);
  assert.equal(control().props['aria-controls'], 'hero-collage');
  assert.equal(byId(render(), 'hero-collage').props['data-motion'], 'paused');
  control().props.onClick();
  assert.equal(text(control()), 'Reanudar animación');
  assert.equal(control().props['aria-pressed'], true);
  assert.equal(byId(render(), 'hero-collage').props['data-motion'], 'paused');
  assert.equal(text(byId(render(), 'hero-collage')), 'Preserved artwork');
  control().props.onClick();
  assert.equal(byId(render(), 'hero-collage').props['data-motion'], 'paused');
  assert.equal(text(control()), 'Pausar animación');
});

test('S11 projects starts with the unchanged carousel before the catalog, clearing the header', () => {
  const code = ts.transpileModule(readFileSync('src/app/proyectos/page.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const module = { exports: {} };
  const jsx = (type, props) => ({ type, props });
  vm.runInNewContext(code, { module, exports: module.exports, require: spec => {
    if (spec === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (spec === '@/lib/metadata') return { pageMetadata: () => ({}) };
    return new Proxy({}, { get: (_, key) => String(key) });
  } });
  const route = module.exports.default();
  assert.equal(route.type, 'SitePage');
  assert.notEqual(route.props.offsetHeader, false);
  assert.equal(route.props.footer.type, 'HomeClosing');
  assert.deepEqual(Array.from(nodes(route.props.children), n => n.type), ['ProjectCarousel', 'ProjectsSection']);
  assert.doesNotMatch(readFileSync('src/components/home/HomeRedesign.tsx', 'utf8'), /ProjectCarousel/);
});

test('S3 three light service cards give benefits and existing service destinations', () => {
  const { tree } = home(), section = byId(tree, 'soluciones');
  assert.equal(text(nodes(section).find(n => n.type === 'h2')), '¿Qué necesita tu negocio?');
  const cards = nodes(section).filter(n => n.type === 'article');
  assert.deepEqual(cards.map(n => text(nodes(n).find(item => item.type === 'h3'))), ['Web para restaurantes', 'Tiendas virtuales', 'Software y automatización']);
  assert.deepEqual(links(section).map(n => n.props.href), ['/servicios/restaurantes', '/servicios/ecommerce', '/servicios/automatizacion']);
  for (const card of cards) assert.ok(nodes(card).some(n => n.type === 'p' && text(n).length > 40));
  assert.match(text(section), /posibilidades del servicio/i);
});

test('S4 La Lupe alone is real work with confirmed features and the catalog anchor', () => {
  const { tree } = home(), section = byId(tree, 'trabajo');
  assert.equal(text(nodes(section).find(n => n.type === 'h2')), 'Conoce nuestro trabajo');
  assert.equal(text(nodes(section).find(n => n.type === 'h3')), 'La Lupe');
  assert.match(text(section), /restaurante mexicano/);
  assert.deepEqual(nodes(section).filter(n => n.type === 'li').map(text), ['Presentación del restaurante', 'Menú', 'Platos destacados', 'Contacto por WhatsApp']);
  assert.equal(exactLink(section, 'Ver proyecto').props.href, '/proyectos#equipo-la-lupe');
  assert.equal(exactLink(section, 'Quiero una web para mi negocio').props.href, '/contacto?servicio=restaurantes');
  assert.doesNotMatch(text(section), /pedidos|reservas|pagos|paneles|Emisoras/i);
  assert.ok(nodes(section).some(n => n.type === 'img' && n.props.src === '/images/projects/la-lupe.webp'));
});

test('S5 generic salon and ecommerce concepts are proposals, never delivered websites', () => {
  const { tree } = home(), section = byId(tree, 'propuestas');
  assert.equal(text(nodes(section).find(n => n.type === 'h2')), 'Así podría verse tu negocio');
  assert.ok(text(section).includes('Explora propuestas visuales que podemos adaptar a la identidad y las necesidades de tu negocio'));
  const cards = nodes(section).filter(n => n.type === 'article' && n.props['data-home-concept']);
  assert.equal(cards.length, 2);
  for (const card of cards) assert.ok(text(card).includes('Diseño conceptual'));
  assert.match(text(cards[0]), /Peluquerías y salones de belleza/);
  assert.match(text(cards[0]), /servicios, instalaciones y profesionales/);
  assert.match(text(cards[1]), /Comercio electrónico/);
  assert.match(text(cards[1]), /catálogo de productos/);
  assert.equal(exactLink(section, 'Quiero algo similar').props.href, '/contacto?servicio=sitios-web');
  assert.equal(exactLink(section, 'Quiero una tienda virtual').props.href, '/contacto?servicio=ecommerce');
  assert.match(text(section), /no son sitios web desarrollados/i);
  assert.doesNotMatch(text(section), /UptownHair|Ver sitio/i);
  assert.ok(links(section).every(n => n.props.href.startsWith('/contacto?')));
});

test('S6 selectors live in demos and preserve all three store selections, panels and contextual CTAs', () => {
  const ui = harness(), { HomeDemos } = ui.load('src/components/HomeDemos');
  const render = () => ui.render(HomeDemos);
  const cards = () => nodes(render()).filter(n => n.type === 'article');
  const tabs = () => nodes(render()).filter(n => n.props['data-demo-tab']);
  assert.deepEqual(tabs().map(text), ['Restaurantes', 'Streaming', 'Logística']);
  assert.deepEqual(cards().map(n => n.props['data-demo']), ['la-lupe', 'emisoras-latinas', 'calculadora-de-contenedores']);
  assert.deepEqual(cards().filter(n => !n.props.hidden).map(n => n.props.id), ['demo-la-lupe']);
  assert.ok(text(render()).includes('Demo interactiva · Datos de ejemplo'));
  assert.match(text(render()), /no representa funcionalidades implementadas en la web real de La Lupe/);
  assert.match(text(render()), /No se guardan ni se envían datos/);
  assert.equal(nodes(render()).filter(n => n.props['data-project-card']).length, 0);
  for (const [id, service, slug] of [['emisoras-latinas', 'streaming', 'radio'], ['calculadora-de-contenedores', 'logistica', 'logistica'], ['la-lupe', 'restaurantes', 'restaurante']]) {
    const tab = tabs().find(n => n.props['data-demo-tab'] === id);
    assert.equal(tab.props['aria-controls'], `demo-${id}`);
    tab.props.onClick();
    assert.deepEqual(cards().filter(n => !n.props.hidden).map(n => n.props['data-demo']), [id]);
    assert.deepEqual(tabs().filter(n => n.props['aria-pressed']).map(n => n.props['data-demo-tab']), [id]);
    const card = cards().find(n => n.props['data-demo'] === id);
    assert.equal(exactLink(card, 'Quiero una solución similar').props.href, `/contacto?servicio=${service}&demo=${slug}`);
    assert.equal(exactLink(card, 'Ver servicio').props.href, `/servicios/${service}?servicio=${service}&demo=${slug}`);
  }
});

test('S7 four exact stages and compact closing CTA', () => {
  const { tree } = home(), process = byId(tree, 'proceso-home'), closing = byId(tree, 'siguiente-paso');
  assert.equal(text(nodes(process).find(n => n.type === 'h2')), 'Así construimos contigo');
  assert.deepEqual(nodes(process).filter(n => n.type === 'h3').map(text), ['Descubrimos', 'Diseñamos', 'Desarrollamos', 'Lanzamos']);
  assert.deepEqual(nodes(process).filter(n => n.type === 'p').map(text), ['necesidades, propuesta y alcance.', 'estructura y diseño para aprobación.', 'construcción y avances revisables.', 'publicación y entrega según el alcance.']);
  assert.equal(text(nodes(closing).find(n => n.type === 'h2')), 'El próximo paso de tu negocio empieza aquí');
  assert.equal(exactLink(closing, 'Cuéntanos tu proyecto').props.href, '/contacto');
});

test('S1/S8 footer opt-out retains every detail and default equals explicit true', () => {
  const ui = harness(), { HomeClosing } = ui.load('src/components/home/HomeClosing');
  const original = ui.render(HomeClosing), explicit = ui.render(HomeClosing, { showClosing: true });
  assert.deepEqual(original, explicit);
  assert.equal(original.props['aria-labelledby'], 'closing-title');
  assert.ok(byId(original, 'closing-title'));
  const compact = ui.render(HomeClosing, { showClosing: false });
  assert.equal(byId(compact, 'closing-title'), undefined);
  assert.ok(compact.props['aria-label']);
  assert.equal(compact.props['aria-labelledby'], undefined);
  const details = tree => nodes(tree).find(n => n.props.className?.includes('footerDetails'));
  assert.deepEqual(details(compact), details(original));
  assert.equal(nodes(compact).filter(n => n.props['data-talk-sphere'] !== undefined).length, 0);
});

test('S8 assets are existing local resources and all contact context validates at the existing boundary', () => {
  const { tree, load } = home(), { readEnquiryContext } = load('src/lib/enquiry');
  for (const img of nodes(tree).filter(n => n.type === 'img')) {
    assert.ok(img.props.src.startsWith('/images/'));
    assert.ok(existsSync(`public${img.props.src}`), img.props.src);
    assert.doesNotMatch(img.props.src, /uptownhair|home-hero/);
    assert.equal(typeof img.props.alt, 'string');
  }
  for (const link of links(tree)) {
    const url = new URL(link.props.href, 'https://example.invalid');
    assert.equal(url.origin, 'https://example.invalid', 'no fictional external sites');
    if (url.pathname === '/contacto') assert.equal(readEnquiryContext(url.search).length, [...url.searchParams].length);
  }
  const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /@media[^{}]*max-width: 1060px/);
  assert.match(css, /@media[^{}]*max-width: 600px/);
  assert.match(css, /minmax\(0, 1fr\)/);
});

for (const [file, name, action, expected, reset] of [
  ['MenuQuoteDemo', 'MenuQuoteDemo', 'Agregar Flautas', 'Total: $35.900', 'Reiniciar pedido'],
  ['RadioDemo', 'RadioDemo', 'Escuchar Vallenato', 'En vivo (simulado): Vallenato · Colombia', 'Reiniciar radio'],
  ['LoadCalculatorDemo', 'LoadCalculatorDemo', 'Pequeña', '20 cajas por capa · 7 capas · 140 cajas · 560 kg', 'Reiniciar cálculo'],
]) test(`PRESERVE S6 ${name} still responds and resets`, () => {
  const ui = harness(), component = ui.load(`src/components/demos/${file}`)[name];
  const render = () => ui.render(component), initial = text(render());
  const click = label => {
    const button = nodes(render()).find(n => n.type === 'button' && (n.props['aria-label'] === label || text(n) === label));
    assert.ok(button && !button.props.disabled, label); button.props.onClick();
  };
  click(action); assert.ok(text(render()).includes(expected));
  click(reset); assert.equal(text(render()), initial);
});

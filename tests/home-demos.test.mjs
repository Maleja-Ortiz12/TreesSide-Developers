import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Renders one demo component with a minimal useState so clicks can be simulated without a browser.
function mount(file, name) {
  const code = ts.transpileModule(readFileSync(`src/components/demos/${file}.tsx`, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const state = [];
  let cursor = 0;
  const exports = {}, jsx = (type, props) => ({ type, props });
  vm.runInNewContext(code, { exports, require: path => path === 'react' ? {
    useState(initial) { const i = cursor++; if (!(i in state)) state[i] = typeof initial === 'function' ? initial() : initial; return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }]; },
  } : path === 'react/jsx-runtime' ? { jsx, jsxs: jsx } : path.endsWith('.css') ? { default: {} } : { default: () => null } });
  const render = () => { cursor = 0; return exports[name](); };
  const nodes = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
  const text = tree => tree == null || typeof tree === 'boolean' ? '' : typeof tree !== 'object' ? String(tree) : [tree.props?.children].flat(Infinity).map(text).join('');
  const find = (type, label) => nodes(render()).find(n => n.type === type && (n.props['aria-label'] === label || text(n) === label));
  const button = label => { const node = find('button', label); assert.ok(node, label); return node; };
  return {
    exports, render, nodes: () => nodes(render()), text: () => text(render()), button,
    click(label) { const b = button(label); assert.ok(!b.props.disabled, `${label} enabled`); b.props.onClick(); },
    input(label, value) { const node = find('input', label) || find('select', label); assert.ok(node, label); node.props.onChange({ target: { value: String(value) } }); },
  };
}

async function home() {
  const response = await fetch(process.env.TEST_BASE_URL || 'http://localhost:3000', { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200);
  return response.text();
}
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const demoCard = (html, id) => html.match(new RegExp(`<article[^>]*data-demo="${id}"[\\s\\S]*?</article>`))?.[0];

test('UptownHair booking needs a service and a slot, confirms once and resets', () => {
  const ui = mount('BookingDemo', 'BookingDemo');
  assert.equal(ui.button('Confirmar turno').props.disabled, true);
  ui.click('11:00');
  assert.equal(ui.button('Confirmar turno').props.disabled, true, 'service still missing');
  ui.click('Color');
  ui.click('Confirmar turno');
  assert.ok(ui.text().includes('Turno de ejemplo confirmado: Color a las 11:00'));
  assert.equal(ui.button('Confirmar turno').props.disabled, true);
  ui.click('Reiniciar reserva');
  assert.equal(ui.button('Confirmar turno').props.disabled, true);
  assert.ok(!ui.text().includes('confirmado'));
});

test('Entre Lanas inventory tracks each product, flags low stock and never goes below zero', () => {
  const ui = mount('InventoryDemo', 'InventoryDemo');
  assert.ok(ui.text().includes('1 producto con stock bajo'));
  for (let i = 0; i < 2; i++) ui.click('Vender Fragancia de lavanda');
  assert.ok(ui.text().includes('Sin existencias'));
  assert.equal(ui.button('Vender Fragancia de lavanda').props.disabled, true);
  ui.button('Vender Fragancia de lavanda').props.onClick();
  ui.click('Vender Ovillo de lana merino');
  ui.click('Vender Ovillo de lana merino');
  assert.ok(ui.text().includes('2 productos con stock bajo'));
  ui.click('Reponer Fragancia de lavanda');
  assert.ok(ui.text().includes('1 unidad'));
  ui.click('Reiniciar inventario');
  assert.ok(ui.text().includes('1 producto con stock bajo'));
  assert.ok(!ui.text().includes('Sin existencias'));
});

test('La Lupe menu adds real dishes, totals in pesos and prepares a WhatsApp-style quote', () => {
  const ui = mount('MenuQuoteDemo', 'MenuQuoteDemo');
  assert.equal(ui.button('Preparar cotización').props.disabled, true);
  assert.equal(ui.button('Quitar Flautas').props.disabled, true);
  ui.click('Agregar Flautas'); ui.click('Agregar Flautas'); ui.click('Agregar Nachos grandes');
  assert.ok(ui.text().includes('Total: $110.700'));
  ui.click('Quitar Nachos grandes');
  assert.ok(ui.text().includes('Total: $71.800'));
  assert.equal(ui.button('Quitar Nachos grandes').props.disabled, true);
  ui.click('Agregar Nachos grandes');
  ui.click('Preparar cotización');
  assert.ok(ui.text().includes('Hola La Lupe, quiero cotizar: 1 × Nachos grandes, 2 × Flautas. Total estimado: $110.700'));
  ui.click('Reiniciar pedido');
  assert.ok(ui.text().includes('Total: $0'));
  assert.ok(!ui.text().includes('Hola La Lupe'));
  assert.equal(ui.button('Preparar cotización').props.disabled, true);
});

test('Emisoras Latinas radio filters stations by country, plays, pauses and resets', () => {
  const ui = mount('RadioDemo', 'RadioDemo');
  const station = name => ui.nodes().some(n => n.type === 'button' && n.props['aria-label'] === `Escuchar ${name}`);
  assert.ok(ui.text().includes('Elige una emisora para empezar.'));
  assert.equal(ui.button('Pausar').props.disabled, true);
  ui.click('México');
  assert.ok(station('Rock en Español'));
  assert.ok(!station('Vallenato'), 'filtered out');
  ui.click('Escuchar Rock en Español');
  assert.ok(ui.text().includes('En vivo (simulado): Rock en Español · México'));
  ui.click('Pausar');
  assert.ok(ui.text().includes('En pausa: Rock en Español'));
  ui.click('Reanudar');
  assert.ok(ui.text().includes('En vivo (simulado): Rock en Español'));
  ui.click('Reiniciar radio');
  assert.ok(ui.text().includes('Elige una emisora para empezar.'));
  assert.ok(station('Vallenato'), 'filter reset');
});

test('container calculator picks the best box orientation, layers and weight on a 120×100 pallet', () => {
  const ui = mount('LoadCalculatorDemo', 'LoadCalculatorDemo');
  const boxes = () => ui.nodes().filter(n => n.type === 'rect' && n.props['data-box']).length;
  assert.ok(ui.text().includes('9 cajas por capa · 6 capas · 54 cajas · 432 kg'));
  assert.equal(boxes(), 9);
  ui.click('Pequeña');
  assert.ok(ui.text().includes('20 cajas por capa · 7 capas · 140 cajas · 560 kg'));
  assert.equal(boxes(), 20);
  for (let i = 0; i < 5; i++) ui.click('Bajar altura');
  assert.ok(ui.text().includes('Altura máxima: 100 cm'));
  assert.ok(ui.text().includes('20 cajas por capa · 5 capas · 100 cajas · 400 kg'));
  for (let i = 0; i < 5; i++) ui.click('Bajar altura');
  assert.equal(ui.button('Bajar altura').props.disabled, true, 'minimum 50 cm');
  ui.click('Grande');
  assert.ok(ui.text().includes('4 cajas por capa · 1 capa · 4 cajas · 60 kg'));
  ui.click('Reiniciar cálculo');
  assert.ok(ui.text().includes('Altura máxima: 150 cm'));
  assert.ok(ui.text().includes('9 cajas por capa · 6 capas · 54 cajas · 432 kg'));
});

test('Ocho80 bingo draws balls, marks the card, calls a line, then bingo, and resets', () => {
  const ui = mount('BingoDemo', 'BingoDemo');
  const marked = () => ui.nodes().filter(n => n.props?.['data-marked'] === true).length;
  assert.ok(ui.text().includes('Balotas: 0 de 30'));
  assert.ok(ui.text().includes('Saca una balota para empezar.'));
  for (let i = 0; i < 4; i++) ui.click('Sacar balota');
  assert.ok(!ui.text().includes('¡Línea!'));
  ui.click('Sacar balota');
  assert.ok(ui.text().includes('¡Línea!'));
  assert.ok(ui.text().includes('Balotas: 5 de 30'));
  assert.equal(marked(), 3);
  for (let i = 0; i < 12; i++) ui.click('Sacar balota');
  assert.ok(ui.text().includes('¡Bingo!'));
  assert.ok(ui.text().includes('Balotas: 17 de 30'));
  assert.equal(marked(), 9);
  assert.equal(ui.button('Sacar balota').props.disabled, true);
  ui.click('Reiniciar bingo');
  assert.ok(ui.text().includes('Balotas: 0 de 30'));
  assert.equal(marked(), 0);
});

// Home demo rendering was retired by S14; the six independent demo behavior tests above remain.

// The home keeps only the three demos chosen by the hero tabs (odd/tasks/rediseno-mockup.md S12).
test('S12 home shows the three mockup demos in order, the first one visible', async () => {
  const html = await home();
  const ids = [...html.matchAll(/<article[^>]*data-demo="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['la-lupe', 'emisoras-latinas', 'calculadora-de-contenedores']);
  const opening = id => html.match(new RegExp(`<article[^>]*data-demo="${id}"[^>]*>`))[0];
  assert.ok(!/\shidden=""/.test(opening('la-lupe')), 'La Lupe demo shown first');
  for (const id of ['emisoras-latinas', 'calculadora-de-contenedores']) assert.match(opening(id), /\shidden=""/, `${id} waits for its tab`);
  for (const gone of ['uptownhair', 'ocho80', 'entre-lanas-y-fragancias']) assert.ok(!html.includes(`data-demo="${gone}"`), `${gone} demo left the home`);
});

test('S9 home demo cards carry the mockup label and name the real project they are based on', async () => {
  const html = await home();
  for (const [id, kind, project, href] of [
    ['la-lupe', 'Restaurante', 'La Lupe', '/casos/la-lupe'],
    ['emisoras-latinas', 'Radio', 'Emisoras Latinas', '/casos/emisoras-latinas'],
    ['calculadora-de-contenedores', 'Logística', 'Calculadora de contenedores', null],
  ]) {
    const card = demoCard(html, id);
    assert.ok(card, `demo card ${id}`);
    assert.ok(plain(card).includes(`Demo conceptual · ${kind}`), `label ${id}`);
    assert.ok(plain(card).includes(`Basado en ${project}`), `source ${id}`);
    if (href) assert.ok(card.includes(`href="${href}"`), `${id} links its case study`);
  }
});

test('S10 home demos section uses the mockup heading and keeps the sample-data disclaimer', async () => {
  const html = await home();
  const section = html.match(/<section id="demos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'demos section');
  const title = section.match(/<h2\b[\s\S]*?<\/h2>/)?.[0] ?? '';
  assert.equal(plain(title).trim(), 'Menos promesas. Más cosas que puedes probar.');
  assert.match(title, /<span class="[^"]*text-gradient[^"]*">puedes probar\.<\/span>/);
  assert.ok(plain(section).includes('Explora demos conceptuales de soluciones reales y comprueba por ti mismo cómo podemos llevar tu idea al siguiente nivel.'));
  assert.ok(section.includes('No se guardan ni se envían datos'));
  assert.ok(!html.includes('Prueba lo que podemos construir'), 'previous heading replaced');
});

test('S13/S25 La Lupe and Emisoras Latinas cards show their real image in a laptop and lead to their catalog card', async () => {
  const html = await home();
  const team = readFileSync('src/data/team.ts', 'utf8');
  const cards = [...html.matchAll(/<article[^>]*data-project-card="([^"]+)"[\s\S]*?<\/article>/g)];
  assert.deepEqual(cards.map(match => match[1]), ['equipo-la-lupe', 'equipo-emisoras-latinas']);
  for (const [index, [title, image]] of [['La Lupe', 'la-lupe'], ['Emisoras Latinas', 'emisoras-latinas-cover']].entries()) {
    const [card, id] = cards[index];
    // The catalog card is the member entry that is not merged into another one (no sameAs).
    const entry = team.split('\n').find(line => line.includes(`{ name: '${title}', description:`) && !line.includes('sameAs'));
    const description = entry.match(/description: '([^']+)'/)[1];
    assert.match(card, new RegExp(`<h3[^>]*>${title}</h3>`), `${id} title`);
    assert.ok(plain(card).includes(description), `${id} real description`);
    const laptop = card.match(/<div[^>]*data-laptop[\s\S]*?<img[^>]*>/)?.[0] ?? '';
    assert.ok(laptop.includes(`src="/images/projects/${image}.webp"`), `${id} real image inside the laptop`);
    const link = card.match(/<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/);
    assert.equal(link?.[1], `/proyectos#${id}`, `${id} link`);
    assert.ok(plain(link[0]).includes('Ver proyecto'), `${id} link text`);
  }
});

test('S25 the laptop cards sit under "Ideas que cobran vida." and their screens are flat', async () => {
  const html = await home();
  const section = html.match(/<section id="demos"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /<h3[^>]*>Ideas que cobran <span class="[^"]*text-gradient[^"]*">vida\.<\/span><\/h3>/);
  const css = readFileSync('src/components/home/Home.module.css', 'utf8');
  assert.doesNotMatch(css, /\.laptop \{[^}]*rotate\(/, 'no tilt on the project screenshot');
});

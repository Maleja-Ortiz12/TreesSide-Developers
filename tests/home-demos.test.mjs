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

test('home demo cards name the real project, its authors and what we can build', async () => {
  const html = await home();
  for (const [id, project, authors] of [
    ['la-lupe', 'La Lupe', 'María Alejandra Ortiz Páez y Ronaldo Delgado Correa'],
    ['emisoras-latinas', 'Emisoras Latinas', 'María Alejandra Ortiz Páez y Jorge Luis Ramírez Trochez'],
    ['uptownhair', 'UptownHair', 'María Alejandra Ortiz Páez'],
    ['entre-lanas-y-fragancias', 'Entre Lanas y Fragancias', 'María Alejandra Ortiz Páez'],
  ]) {
    const card = demoCard(html, id);
    assert.ok(card, `demo card ${id}`);
    assert.ok(plain(card).includes(`Basado en ${project}`), `source ${id}`);
    assert.ok(plain(card).includes(authors), `authors ${id}`);
    assert.ok(plain(card).includes('Podemos construir'), `can build ${id}`);
  }
  assert.ok(demoCard(html, 'la-lupe').includes('href="https://lalupe.co/"'), 'La Lupe links its live site');
  assert.ok(!html.includes('Pedido de ejemplo'), 'generic automation demo removed');
});

test('home keeps the demos heading, disclaimer and previous hero', async () => {
  const html = await home();
  assert.ok(html.includes('id="demos"'));
  assert.ok(html.includes('Prueba lo que podemos construir'));
  assert.ok(html.includes('No se guardan ni se envían datos'));
  assert.ok(html.includes('Transformamos'));
  assert.ok(html.includes('ideas en soluciones'));
  assert.ok(!html.includes('Menos tareas manuales.'));
});

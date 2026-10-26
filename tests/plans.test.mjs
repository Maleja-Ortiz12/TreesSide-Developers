import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const PLANS = [
  { id: 'impulso-web', name: 'Impulso Web', price: '$500.000', items: ['Hasta 5 páginas', 'Dos rondas de ajustes', 'Dominio .com', 'primer año', 'No incluye'] },
  { id: 'catalogo-administrable', name: 'Catálogo Administrable', price: '$900.000', items: ['Impulso Web', 'panel administrativo', 'agregar', 'quitar', 'precios', 'categorías', 'existencias', 'acceso de administrador'] },
  { id: 'vende-online', name: 'Vende Online', price: '$1.490.000', items: ['Catálogo Administrable', 'código a medida', 'cantidad de productos', 'pasarela externa', 'Capacitación', 'facturación electrónica'] },
  { id: 'automatiza-tu-negocio', name: 'Negocio Integral', price: '$3.490.000', items: ['Vende Online', 'n8n', 'hasta dos herramientas', 'API disponible', 'Documentación', 'licencias', 'UiPath'] },
];
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/<!--.*?-->/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

function planCards(html) {
  return [...html.matchAll(/<article[^>]*data-plan="([^"]+)"[\s\S]*?<\/article>/g)].map(m => ({ id: m[1], html: m[0] }));
}

test('plans page publishes exactly the four approved starting prices with complete scope', async () => {
  const html = await get('/planes');
  assert.match(html, /<h1[^>]*>[^<]*Planes[^<]*<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/treesside-developers\.malejawork12\.workers\.dev\/planes"/);
  const cards = planCards(html);
  assert.deepEqual(cards.map(card => card.id), PLANS.map(plan => plan.id));
  for (const plan of PLANS) {
    const card = cards.find(card => card.id === plan.id).html;
    const content = text(card);
    assert.ok(content.includes(plan.name), plan.name);
    assert.ok(content.includes(plan.price), `${plan.name} price`);
    assert.ok(content.includes('Desde') && content.includes('COP'), `${plan.name} starting price and currency`);
    assert.ok(content.includes('Implementación · pago único'), `${plan.name} not a monthly fee`);
    for (const item of plan.items) assert.ok(content.toLowerCase().includes(item.toLowerCase()), `${plan.name}: ${item}`);
    for (const section of ['Qué incluye', 'No incluye', 'Costos recurrentes', 'Qué necesitamos de ti', 'Entrega y alcance']) {
      assert.ok(content.includes(section), `${plan.name}: ${section}`);
    }
    const links = [...card.matchAll(/href="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'));
    const contact = links.find(link => link.startsWith('https://wa.me/'));
    assert.ok(contact, `${plan.name} WhatsApp link`);
    const url = new URL(contact);
    assert.equal(url.pathname, '/573057173986');
    assert.ok(url.searchParams.get('text').includes(plan.name), `${plan.name} selected in message`);
    assert.ok(url.searchParams.get('text').includes(plan.price), `${plan.name} indicative price in message`);
    assert.ok(links.includes('/contacto'), `${plan.name} email/form alternative`);
  }
  const content = text(html);
  assert.ok(content.includes('antes de impuestos si aplican'));
  assert.ok(content.includes('El precio final se confirma por escrito'));
  assert.ok(content.includes('No incluyen comisiones de pasarelas de pago'));
  assert.ok(!/mejor precio del mercado|más barato del mercado|ventas garantizadas|primero en Google/i.test(content));
});

test('home and services show the same four approved offers and link their full details', async () => {
  for (const path of ['/', '/servicios']) {
    const html = await get(path);
    const section = html.match(/<section id="planes-resumen"[\s\S]*?<\/section>/)?.[0];
    assert.ok(section, `${path} plans summary`);
    for (const plan of PLANS) {
      assert.ok(text(section).includes(plan.price), `${path} ${plan.price}`);
      assert.ok(section.includes(`href="/planes#${plan.id}"`), `${path} ${plan.name} full details`);
    }
  }
});

test('custom commerce has no fixed product cap or WordPress dependency, and each upgrade names the included plan', async () => {
  const cards = planCards(await get('/planes'));
  const relationships = [
    ['catalogo-administrable', 'impulso-web', 'Impulso Web'],
    ['vende-online', 'catalogo-administrable', 'Catálogo Administrable'],
    ['automatiza-tu-negocio', 'vende-online', 'Vende Online'],
  ];
  for (const [id, previousId, previousName] of relationships) {
    const card = cards.find(item => item.id === id).html;
    assert.ok(text(card).includes(`Incluye todo lo de ${previousName}`), `${id} explicit cumulative scope`);
    assert.ok(card.includes(`href="#${previousId}"`), `${id} links included package`);
  }
  const store = text(cards.find(item => item.id === 'vende-online').html);
  assert.doesNotMatch(store, /WordPress|WooCommerce|hasta\s+10\s+productos|plugins/i);
  assert.ok(store.includes('El precio varía según la cantidad de productos'));
  const catalog = text(cards.find(item => item.id === 'catalogo-administrable').html);
  assert.ok(catalog.includes('pagos en línea'), 'catalog clearly distinguishes missing checkout');
  const integral = text(cards.find(item => item.id === 'automatiza-tu-negocio').html);
  assert.ok(integral.includes('tienda') && integral.includes('automatización'));
  assert.ok(integral.includes('primer año'), 'website hosting stays included');
  assert.ok(integral.includes('servidor de automatización'), 'automation infrastructure is separately priced');
});

test('plans are discoverable in navigation, footer and sitemap without losing existing links', async () => {
  const html = await get('/planes');
  const header = html.match(/<header\b[\s\S]*?<\/header>/)[0];
  const current = (header.match(/<a\b[^>]*>/g) || []).find(tag => tag.includes('aria-current="page"'));
  assert.ok(current?.includes('href="/planes"'), 'plans is the current navigation entry');
  assert.equal((header.match(/aria-current="page"/g) || []).length, 1);
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto']) assert.ok(header.includes(`href="${path}"`), path);
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)[0];
  assert.ok(footer.includes('href="/planes"'));
  assert.ok(footer.includes('href="/politica-de-datos"'));
  assert.ok((await get('/sitemap.xml')).includes('<loc>https://treesside-developers.malejawork12.workers.dev/planes</loc>'));
});

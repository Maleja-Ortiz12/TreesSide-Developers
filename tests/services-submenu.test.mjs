import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SLUGS = ['ecommerce', 'sistemas-de-gestion', 'datos-y-analitica', 'logistica', 'restaurantes', 'streaming', 'videojuegos', 'automatizacion', 'inteligencia-artificial', 'reservas-y-citas', 'agropecuario', 'soporte-tecnico', 'marketplaces', 'infraestructura', 'sitios-web'];

test('the Servicios menu item opens a submenu with every category', async () => {
  const html = await (await fetch(`${base}/`)).text();
  const trigger = (html.match(/<a\b[^>]*>/g) || []).find(tag => tag.includes('href="/servicios"') && tag.includes('aria-haspopup="true"'));
  assert.ok(trigger, 'Servicios rail link announces its submenu');
  assert.match(trigger, /aria-expanded="false"/);
  assert.match(trigger, /aria-controls="services-submenu"/);
  const panel = html.match(/<nav[^>]*id="services-submenu"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(panel, 'submenu panel is rendered for crawlers and no-JS');
  assert.ok(panel.includes('href="/servicios"') && panel.includes('Todos los servicios'));
  for (const slug of SLUGS) assert.equal((panel.match(new RegExp(`href="/servicios/${slug}"`, 'g')) || []).length, 1, slug);
  assert.ok(!panel.includes('href="/servicios/streaming-y-redes"'), 'combined legacy category is not listed');
  assert.equal(SLUGS.length, 15, 'dedicated streaming replaces the visible combined category');
});

test('Servicios stays highlighted on a category page; other rail links are unchanged', async () => {
  const html = await (await fetch(`${base}/servicios/restaurantes`)).text();
  const header = html.match(/<header\b[\s\S]*?<\/header>/)[0];
  const trigger = (header.match(/<a\b[^>]*>/g) || []).find(tag => tag.includes('aria-controls="services-submenu"'));
  assert.match(trigger, /is-active/);
  for (const href of ['/', '/planes', '/proyectos', '/nosotros', '/equipo', '/contacto']) {
    const link = (header.match(/<a\b[^>]*>/g) || []).find(tag => tag.includes(`href="${href}"`) && tag.includes('rail-link'));
    assert.ok(link && !link.includes('aria-haspopup'), href);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const site = 'https://treesside-developers.malejawork12.workers.dev';
const get = async path => {
  const response = await fetch(`${base}${path}`);
  return { status: response.status, html: await response.text() };
};
// slug → [breadcrumb label, fragment of the mockup headline, first plan name]
const CATEGORIES = {
  ecommerce: ['E-commerce', 'Tu tienda, conectada', 'Catálogo digital'],
  'sistemas-de-gestion': ['Sistemas de gestión', 'Una operación conectada.', 'Módulo esencial'],
  'datos-y-analitica': ['Datos y analítica', 'Tus datos tienen', 'Diagnóstico de datos'],
  logistica: ['Logística empresarial', 'Control para cada', 'Herramienta puntual'],
  restaurantes: ['Restaurantes', 'Tu restaurante,', 'Presencia digital'],
  'streaming-y-redes': ['Streaming y redes sociales', 'Tu contenido', 'Streaming web'],
  videojuegos: ['Videojuegos', 'Ideas que se juegan.', 'Prototipo jugable'],
  automatizacion: ['Automatización empresarial', 'Menos tareas repetitivas.', 'Flujo puntual'],
  'inteligencia-artificial': ['Inteligencia artificial y APIs', 'Conecta tus sistemas.', 'API a medida'],
  'reservas-y-citas': ['Reservas y citas', 'Cada cita en', 'Agenda digital'],
  agropecuario: ['Soluciones agropecuarias', 'Tecnología que entiende', 'Registro de campo'],
  'soporte-tecnico': ['Servicio técnico', 'Tu tecnología merece', 'Diagnóstico y solución puntual'],
  marketplaces: ['Marketplaces', 'Conecta una comunidad', 'Directorio especializado'],
  infraestructura: ['Infraestructura', 'La base tecnológica', 'Puesta en marcha'],
  'sitios-web': ['Webs corporativas e institucionales', 'Una presencia digital', 'Web informativa'],
};

for (const [slug, [label, headline, firstPlan]] of Object.entries(CATEGORIES)) {
  test(`service category ${slug} is its own page following its mockup`, async () => {
    const { status, html } = await get(`/servicios/${slug}`);
    assert.equal(status, 200);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const h1 = html.match(/<h1\b[\s\S]*?<\/h1>/)[0].replace(/<[^>]+>/g, '');
    assert.ok(h1.includes(headline), `headline: ${h1}`);
    const crumbs = html.match(/<nav[^>]*aria-label="Ruta de navegación"[\s\S]*?<\/nav>/)?.[0] ?? '';
    assert.ok(crumbs.includes('href="/"') && crumbs.includes('href="/servicios"') && crumbs.includes(label), 'breadcrumb');
    const back = (html.match(/<a\b[^>]*href="\/servicios#categorias"[^>]*>[\s\S]*?<\/a>/) || [''])[0];
    assert.ok(back.replace(/<[^>]+>/g, '').includes('Volver a servicios'), 'back link');
    assert.ok(html.includes(firstPlan), firstPlan);
    assert.ok((html.match(/Por cotizar/g) || []).length >= 3, 'three plans priced "Por cotizar"');
    assert.ok(html.includes('Vista conceptual'));
    for (const art of ['hero', 'concept']) assert.ok(html.includes(`src="/images/services/${slug}-${art}.webp"`), art);
    assert.ok(html.includes('href="/contacto"'));
    assert.ok(html.includes(`rel="canonical" href="${site}/servicios/${slug}"`));
    assert.ok(html.includes(`property="og:url" content="${site}/servicios/${slug}"`));
    assert.match(html, /<meta name="description" content="[^"]{60,}"/);
    assert.match(html, /data-closing-footer|id="closing-title"/);
  });
}

test('restaurantes combines both restaurant mockups and keeps La Lupe original', async () => {
  const { html } = await get('/servicios/restaurantes');
  assert.ok(html.includes('Del pedido al cierre'));
  for (const step of ['Meseros', 'Cocina y bar', 'Caja', 'Inventarios', 'Administración']) assert.ok(html.includes(step), step);
  for (const mode of ['Suscripción', 'Personalizado']) assert.ok(html.includes(mode), mode);
  assert.ok(html.includes('href="/proyectos#equipo-la-lupe"'));
  assert.ok(html.includes('La Lupe'));
});

test('/servicios lists every category and keeps its services', async () => {
  const { html } = await get('/servicios');
  const section = html.match(/<section[^>]*id="categorias"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(section, 'categorias section');
  for (const slug of Object.keys(CATEGORIES)) assert.ok(section.includes(`href="/servicios/${slug}"`), slug);
  assert.equal((html.match(/data-service="/g) || []).length, 9);
});

test('category pages are in the sitemap; unknown categories are 404', async () => {
  const { html: xml } = await get('/sitemap.xml');
  for (const slug of Object.keys(CATEGORIES)) assert.ok(xml.includes(`<loc>${site}/servicios/${slug}</loc>`), slug);
  assert.equal((await get('/servicios/no-existe')).status, 404);
});

test('Proyectos stays as it was: no sector pages or submenu', async () => {
  const { html } = await get('/proyectos');
  assert.ok(!html.includes('Subcategorías de proyectos'));
  assert.equal((await get('/proyectos/restaurantes')).status, 404);
  assert.equal((html.match(/data-project="/g) || []).length, 31);
});

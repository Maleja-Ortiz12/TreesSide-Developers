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
  'streaming-y-redes': ['Streaming y redes sociales', 'Tu contenido', 'Streaming web'],
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

test('category illustrations sit on tilting 3D stages', async () => {
  for (const slug of Object.keys(CATEGORIES)) {
    const { html } = await get(`/servicios/${slug}`);
    for (const art of ['hero', 'concept']) {
      const stage = html.match(new RegExp(`<div[^>]*data-art-3d="${art}"[^>]*>[\\s\\S]*?<\\/div>`))?.[0] ?? '';
      assert.match(stage, /data-tilt/, `${slug} ${art} tilts`);
      assert.ok(stage.includes(`src="/images/services/${slug}-${art}.webp"`), `${slug} ${art} inside its stage`);
    }
  }
});

const CUSTOM = {
  restaurantes: {
    label: 'Restaurantes',
    headline: 'Tu restaurante funciona mejor cuando todo está conectado.',
    texts: ['De la carta al cierre de caja, una experiencia para clientes y equipo.', 'Una mesa. Todo conectado.', 'Explorar soluciones', 'Ver sistema completo',
      'Elige el punto de partida', 'Presencia digital', 'Plan básico', 'Ventas en línea', 'Plan medio', 'Operación integral', 'Plan completo',
      'Del pedido al cierre', 'Meseros', 'Cocina y bar', 'Caja', 'Inventarios', 'Administración',
      'El sistema completo,', 'Suscripción', 'Desarrollo personalizado · pago único', 'Primero conocemos',
      'Escuchamos', 'Definimos', 'Configuramos', 'Probamos', 'La Lupe', 'Hablemos de cómo trabaja tu restaurante.'],
    links: ['/proyectos#equipo-la-lupe'],
    art: ['hero', 'pos'],
  },
  videojuegos: {
    label: 'Videojuegos',
    headline: 'Ideas que se juegan. Mundos que se exploran.',
    texts: ['Arte e interfaces conceptuales.', 'Cuéntanos tu juego', 'Explorar posibilidades', '¿Qué quieres crear?', 'Juegos web', 'Prototipos jugables', 'Experiencias interactivas',
      'De la mecánica a la experiencia.', 'Mecánicas', 'Interfaz y controles', 'Arte y sonido', 'Pruebas y ajustes',
      'Nuestro proceso de desarrollo.', 'Concepto', 'Prototipo', 'Desarrollo', 'Pruebas', 'Aventura en islas flotantes',
      'Definamos juntos el alcance de tu juego.', 'Diseñemos la experiencia'],
    links: [],
    art: ['hero', 'gameplay'],
  },
};

for (const [slug, page] of Object.entries(CUSTOM)) {
  test(`${slug} follows its own mockup section by section`, async () => {
    const { status, html } = await get(`/servicios/${slug}`);
    assert.equal(status, 200);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    const h1 = html.match(/<h1\b[\s\S]*?<\/h1>/)[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.equal(h1, page.headline);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    for (const expected of page.texts) assert.ok(text.includes(expected), expected);
    const crumbs = html.match(/<nav[^>]*aria-label="Ruta de navegación"[\s\S]*?<\/nav>/)?.[0] ?? '';
    assert.ok(crumbs.includes('href="/servicios"') && crumbs.includes(page.label), 'breadcrumb');
    assert.ok(!html.includes('aria-label="Otras categorías"'), 'no extra sector-category row');
    assert.ok(crumbs.includes('href="/"'), 'Inicio breadcrumb remains');
    assert.ok(crumbs.includes('aria-current="page"'), 'current breadcrumb remains');
    const back = (html.match(/<a\b[^>]*href="\/servicios#categorias"[^>]*>[\s\S]*?<\/a>/) || [''])[0];
    assert.ok(back.replace(/<[^>]+>/g, '').includes('Volver a categorías'), 'back link');
    assert.ok(html.includes('Vista conceptual'));
    for (const art of page.art) {
      const stage = html.match(new RegExp(`<div[^>]*data-art-3d="${art}"[^>]*>[\\s\\S]*?<\\/div>`))?.[0] ?? '';
      assert.match(stage, /data-tilt/, `${art} tilts`);
      const artPath = slug === 'restaurantes' ? `/images/services/restaurantes/${art}-ai.webp` : `/images/services/${slug}/${art}.webp`;
      assert.ok(stage.includes(`src="${artPath}"`), `${art} image`);
    }
    for (const href of [...page.links, '/contacto']) assert.ok(html.includes(`href="${href}"`), href);
    assert.ok(html.includes(`rel="canonical" href="${site}/servicios/${slug}"`));
    assert.equal((html.match(/id="closing-title"/g) || []).length, 1, 'one shared closing footer');
    assert.ok(html.includes(`property="og:url" content="${site}/servicios/${slug}"`));
    assert.match(html, /<meta name="description" content="[^"]{60,}"/);
    if (slug === 'videojuegos') {
      const renderedPlans = html.match(/<section[^>]*id="planes"[\s\S]*?<\/section>/)?.[0] ?? '';
      assert.equal((renderedPlans.match(/Por cotizar/g) || []).length, 3, 'three visible backup plans in games');
      for (const art of ['islas', 'cueva', 'portal']) assert.ok(html.includes(`/images/services/videojuegos/${art}.webp`), art);
    }
    const assets = [...new Set([...html.matchAll(/src="(\/images\/services\/[^"?]+\.webp)"/g)].map(match => match[1]))];
    for (const asset of assets) assert.equal((await get(asset)).status, 200, asset);
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
    for (const anchor of anchors) assert.ok(html.includes(`id="${anchor}"`), `anchor target ${anchor}`);
  });
}

test('restaurant preserves the updated mockup images with AI enhancement, not older art or icon replacements', async () => {
  const { html } = await get('/servicios/restaurantes');
  for (const old of ['restaurantes-hero.webp', 'restaurantes-concept.webp']) assert.ok(!html.includes(`src="/images/services/${old}"`), 'older mockup not substituted');
  assert.ok(!html.includes('data-service-preview='), 'no native icon/emoji preview substitutions');
  for (const art of ['hero', 'pos', 'web', 'ventas', 'operacion']) {
    const image = `/images/services/restaurantes/${art}-ai.webp`;
    assert.ok(html.includes(`src="${image}"`), `${art}: actual updated-mockup image rendered`);
    const response = await fetch(`${base}${image}`);
    assert.equal(response.status, 200, image);
    assert.match(response.headers.get('content-type'), /image\/webp/);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.ok(bytes.length > 2000, `${art}: nonempty enhanced image`);
    assert.equal(String.fromCharCode(...bytes.slice(8, 12)), 'WEBP');
  }
});

const BACKUP_PLANS = {
  restaurantes: {
    names: ['Presencia digital', 'Ventas en línea', 'Gestión integral'],
    billing: 'Implementación (pago único)',
    scope: ['Sitio web de tu restaurante.', 'Carta digital (platos, precios y categorías).', 'Información de sedes y horarios.', 'Botón de contacto por WhatsApp.', 'Todo lo del Plan 1.', 'Panel de productos y gestión de la carta.', 'Pedidos en línea (para domicilio o recoger).', 'Integración con pasarela de pagos.', 'Toma de pedidos (mesas, meseros o en línea).', 'Envío de pedidos a cocina y bar (comandas).', 'Caja y control de ventas.', 'Inventarios (insumos, existencias y consumo).', 'Administración (carta, usuarios, reportes operativos).', 'Uso continuo del sistema, con actualizaciones y soporte.', 'Implementación a la medida, según el alcance acordado.', 'Infraestructura, mantenimiento y servicios externos según alcance.'],
  },
  videojuegos: {
    names: ['Prototipo jugable', 'Juego web', 'Experiencia a medida'],
    billing: 'Implementación única',
    scope: ['Desarrollo de la mecánica principal.', 'Escenario de prueba (nivel o entorno básico).', 'Validación de la jugabilidad y la experiencia.', 'Desarrollo de la experiencia de juego.', 'Interfaz e interacción (UI) y controles.', 'Alcance definido según tus objetivos.', 'Diseño y desarrollo de mecánicas de juego.', 'Contenido (niveles, retos, progresión, etc.).', 'Arte y recursos visuales según el alcance.', 'Integraciones y funcionalidades adicionales.'],
  },
};
for (const [slug, expected] of Object.entries(BACKUP_PLANS)) {
  test(`${slug} includes all backup plans with their original scopes and billing`, async () => {
    const { status, html } = await get(`/servicios/${slug}`);
    assert.equal(status, 200);
    const section = html.match(/<section[^>]*id="planes"[\s\S]*?<\/section>/)?.[0] ?? '';
    const text = section.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    for (const value of [...expected.names, expected.billing, ...expected.scope, 'El alcance, los entregables y los costos externos se acuerdan antes de iniciar.']) assert.ok(text.includes(value), value);
    assert.equal((section.match(/Por cotizar/g) || []).length, 3);
    assert.equal((section.match(/data-tilt=""/g) || []).length, 3, 'three 3D plan cards');
    assert.equal((section.match(/href="\/contacto"/g) || []).length, 3, 'one contact link per plan');
  });
}

test('/servicios lists every category and keeps its services', async () => {
  const { html } = await get('/servicios');
  const section = html.match(/<section[^>]*id="categorias"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.ok(section, 'categorias section');
  for (const slug of [...Object.keys(CATEGORIES), ...Object.keys(CUSTOM)]) assert.ok(section.includes(`href="/servicios/${slug}"`), slug);
  assert.equal((html.match(/data-service="/g) || []).length, 9);
});

test('category pages are in the sitemap; unknown categories are 404', async () => {
  const { html: xml } = await get('/sitemap.xml');
  for (const slug of [...Object.keys(CATEGORIES), ...Object.keys(CUSTOM)]) assert.ok(xml.includes(`<loc>${site}/servicios/${slug}</loc>`), slug);
  assert.equal((await get('/servicios/no-existe')).status, 404);
});

test('Proyectos stays as it was: no sector pages or submenu', async () => {
  const { html } = await get('/proyectos');
  assert.ok(!html.includes('Subcategorías de proyectos'));
  assert.equal((await get('/proyectos/restaurantes')).status, 404);
  assert.equal((html.match(/data-project="/g) || []).length, 31);
});

import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const site = 'https://treesside-developers.malejawork12.workers.dev';
const path = '/servicios/redes-sociales';
// Rendered markup only: React Flight payloads in <script> tags repeat every string.
const page = async () => {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  return { status: response.status, html, rendered: html.replace(/<script\b[\s\S]*?<\/script>/g, '') };
};
const textOf = markup => markup.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
const section = (html, id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';
const h3s = markup => [...markup.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map(([, inner]) => textOf(inner));

// Copy from Images/Marca, fotografía y presencia digital-2 redes mockup actualizado.png.
const H1 = 'Haz que tu marca se vea, se entienda y conecte.';
const LEAD = 'Estrategia, contenido visual y presencia digital para mostrar mejor lo que hace tu negocio.';
const HEADINGS = ['¿Qué hacemos por tu marca?', 'Planes propuestos', 'Nuestro proceso', 'Démosle una presencia clara a tu marca.'];
const OFFERS = [
  ['Gestión de redes sociales', 'Estrategia, calendario, programación de contenido y manejo de comunidad dentro del alcance acordado.'],
  ['Marketing digital', 'Campañas con objetivos, configuración de publicidad y reporte de resultados.'],
  ['Fotografía y contenido', 'Sesiones planificadas, fotografía de productos o del negocio, edición y formatos adaptados.'],
  ['Identidad y mejora de marca', 'Diagnóstico visual, mejora de logo, paleta de color, tipografía y consistencia de la marca.'],
  ['Diseño de piezas', 'Diseño de posts, stories, anuncios y materiales de campaña.'],
];
const PLANS = [
  ['Identidad y fotografía', 'Proyecto / Sesión', 'Diagnóstico visual, mejora de identidad y sesión fotográfica con entregables acordados.'],
  ['Presencia en redes', 'Mensual recurrente', 'Estrategia, calendario, diseño de piezas, programación y seguimiento de canales acordados.'],
  ['Marca en crecimiento', 'Configuración inicial + Mensual', 'Identidad, contenido fotográfico, redes y campañas coordinadas según alcance.'],
];
const NOTE = 'Canales, cantidad de piezas y fotos, revisiones, sesiones y gestión de comunidad se acuerdan en la propuesta. Pauta publicitaria, desplazamientos y producción adicional se cotizan aparte.';
const STEPS = ['Conocemos tu marca', 'Definimos estrategia y estilo', 'Producimos y publicamos', 'Revisamos y mejoramos'];
const ART = { hero: ['hero-ai.webp', 1992, 1192], concept: ['concept-ai.webp', 4088, 1232] };
const CTA_ART = [['cta-left-ai.webp', 1080, 568], ['cta-right-ai.webp', 780, 412]];

test('social hero follows its mockup: breadcrumb, one h1, lead and no hero CTA', async () => {
  const { status, rendered } = await page();
  assert.equal(status, 200);
  assert.equal((rendered.match(/<h1\b/g) || []).length, 1);
  assert.equal(textOf(rendered.match(/<h1\b[\s\S]*?<\/h1>/)[0]), H1);
  const hero = rendered.match(/<header[^>]*aria-labelledby="social-title"[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.ok(hero.includes('id="social-title"'), 'hero labelled by its h1');
  assert.ok(textOf(hero).includes(LEAD), 'lead');
  assert.ok(!/<a\b/.test(hero) && !hero.includes('btn'), 'no hero CTA');
  const crumbs = rendered.match(/<nav[^>]*aria-label="Ruta de navegación"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.ok(crumbs.includes('href="/"') && crumbs.includes('href="/servicios"'), 'breadcrumb links');
  assert.match(crumbs, /aria-current="page"[^>]*>Redes sociales, marketing y marca</);
  assert.ok(!rendered.includes('aria-label="Otras categorías"'), 'no extra sector-category row');
});

test('social sections keep the mockup order and copy, with no invented concept heading', async () => {
  const { rendered } = await page();
  const h2s = [...rendered.matchAll(/<h2\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(([, id, inner]) => ({ id, text: textOf(inner) }));
  const own = h2s.filter(({ id }) => id !== 'closing-title');
  assert.deepEqual(own.map(({ text }) => text), HEADINGS, 'only the mockup headings, in order');
  for (const { id, text } of own) assert.match(rendered, new RegExp(`<section[^>]*aria-labelledby="${id}"`), `${text} labels its section`);
  const ids = ['social-title', 'que-hacemos', 'vista-conceptual', 'planes', 'proceso', 'contacto-redes', 'closing-title'];
  const order = ids.map(id => rendered.indexOf(`id="${id}"`));
  assert.ok(order.every(index => index >= 0), `all sections present: ${ids.filter((_, i) => order[i] < 0)}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'hero, offers, concept, plans, process, CTA, shared closing');

  const offers = section(rendered, 'que-hacemos');
  assert.equal((offers.match(/<li\b/g) || []).length, 5, 'five offer cards');
  assert.deepEqual(h3s(offers), OFFERS.map(([title]) => title));
  for (const [, text] of OFFERS) assert.ok(textOf(offers).includes(text), text);

  const concept = section(rendered, 'vista-conceptual');
  assert.ok(!/<h[1-6]\b/.test(concept), 'concept band has no heading');
  assert.match(concept, /<figcaption\b/, 'accessible concept caption');
  assert.ok(!h2s.some(({ text }) => text === 'Vista conceptual'), 'no invented "Vista conceptual" h2');

  const process = section(rendered, 'proceso');
  assert.deepEqual(h3s(process), STEPS);
  assert.ok(!/<p\b/.test(process.replace(/<h2\b[\s\S]*?<\/h2>/, '')), 'process titles without invented paragraphs');
  assert.equal(textOf(process.replace(/<h2\b[\s\S]*?<\/h2>/, '')), STEPS.join(' '), 'only the step titles');

  const cta = section(rendered, 'contacto-redes');
  assert.match(cta, /<a\b[^>]*href="\/contacto"[^>]*>[\s\S]*?Hablemos[\s\S]*?<\/a>/, 'Hablemos links to contact');
  for (const [file, width, height] of CTA_ART) {
    const img = cta.match(new RegExp(`<img\\b[^>]*src="/images/services/redes-sociales/${file}"[^>]*>`))?.[0] ?? '';
    assert.ok(img.includes(`width="${width}"`) && img.includes(`height="${height}"`), `${file} CTA side art`);
  }
  assert.equal((rendered.match(/id="closing-title"/g) || []).length, 1, 'one shared closing footer');
  assert.equal((rendered.match(/<footer\b/g) || []).length, 1, 'footer rendered once');
  for (const anchor of [...rendered.matchAll(/href="#([^"]+)"/g)].map(match => match[1])) assert.ok(rendered.includes(`id="${anchor}"`), anchor);
});

test('social plans: three cards with their billing badges, summaries, "Por cotizar" and the scope note', async () => {
  const { rendered } = await page();
  const plans = section(rendered, 'planes');
  assert.match(plans, /aria-labelledby="/, 'labelled plans section');
  assert.equal((plans.match(/<article\b/g) || []).length, 3, 'three rendered plan cards');
  assert.deepEqual(h3s(plans), PLANS.map(([name]) => name));
  const cards = [...plans.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(([card]) => textOf(card));
  PLANS.forEach(([name, badge, summary], index) => {
    for (const part of [name, badge, summary, 'Por cotizar']) assert.ok(cards[index].includes(part), `${name}: ${part}`);
  });
  assert.equal((plans.match(/Por cotizar/g) || []).length, 3);
  assert.equal((plans.match(/<a\b[^>]*href="\/contacto"/g) || []).length, 3, 'one contact link per plan');
  assert.equal((plans.match(/data-tilt=""/g) || []).length, 3, 'three 3D plan cards');
  assert.ok(!/<ul\b|Incluye/.test(plans.replace(/<p[^>]*class="[^"]*note[^"]*"[\s\S]*?<\/p>/, '')), 'no invented Includes bullets');
  assert.ok(textOf(plans).includes(NOTE), 'qualification note');
  assert.ok(!/\$\s?\d/.test(textOf(plans)), 'no invented prices');
});

test('social keeps the actual mockup art on tilting 3D stages', async () => {
  const { rendered } = await page();
  for (const [stage, [file, width, height]] of Object.entries(ART)) {
    const markup = rendered.match(new RegExp(`<div[^>]*data-art-3d="${stage}"[^>]*>[\\s\\S]*?<\\/div>`))?.[0] ?? '';
    assert.match(markup, /data-tilt/, `${stage} tilts`);
    const img = markup.match(/<img\b[^>]*>/)?.[0] ?? '';
    assert.ok(img.includes(`src="/images/services/redes-sociales/${file}"`), `${stage} image`);
    assert.ok(img.includes(`width="${width}"`) && img.includes(`height="${height}"`), `${stage} intrinsic size`);
  }
  for (const [file] of [...Object.values(ART), ...CTA_ART]) {
    const response = await fetch(`${base}/images/services/redes-sociales/${file}`);
    assert.equal(response.status, 200, file);
    assert.match(response.headers.get('content-type'), /image\/webp/);
  }
  assert.ok(!rendered.includes('streaming-y-redes-hero.webp') && !rendered.includes('streaming-y-redes-concept.webp'), 'combined page art not substituted');
});

test('social has its own metadata and canonical URL', async () => {
  const { html } = await page();
  assert.ok(html.includes('<title>Marca, fotografía y presencia digital | TreesSide Developers</title>'));
  assert.ok(html.includes(`rel="canonical" href="${site}${path}"`));
  assert.ok(html.includes(`property="og:url" content="${site}${path}"`));
  assert.match(html, /<meta name="description" content="Estrategia, contenido visual y presencia digital[^"]{60,}"/);
});

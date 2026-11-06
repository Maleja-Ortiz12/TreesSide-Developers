import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const site = 'https://treesside-developers.malejawork12.workers.dev';
const path = '/servicios/streaming';
// Rendered markup only: React Flight payloads in <script> tags repeat every string.
const page = async () => {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  return { status: response.status, html, rendered: html.replace(/<script\b[\s\S]*?<\/script>/g, '') };
};
// React's <!-- --> text separators and inline tags join text without a space; block tags separate it.
const textOf = markup => markup.replace(/<!--[\s\S]*?-->|<\/?(?:strong|em|b|span|small)\b[^>]*>/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const section = (html, id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0] ?? '';

// Copy from Images/Plataformas de streaming a tu medida-1 mockup actualizado.png.
const HEADINGS = ['Capacidades de nuestra solución de streaming', 'Vista conceptual', 'Planes propuestos', 'Nuestro proceso de trabajo', 'Demos una plataforma a tu contenido.'];
const CAPABILITIES = ['Reproductores web', 'Directorios y programación', 'Administración de contenido', 'Integraciones'];
const PLANS = [
  ['Reproductor esencial', 'Página de streaming y reproductor conectado a una fuente acordada.'],
  ['Plataforma administrable', 'Reproductor, directorio o programación y panel para gestionar contenidos según alcance.'],
  ['Streaming a medida', 'Roles, múltiples fuentes e integraciones adaptadas a tu operación.'],
];
const SUPPORT = 'Acompañamiento recurrente: mantenimiento, seguimiento y ajustes por cotizar.';
const EXTERNAL = 'Alojamiento, ancho de banda, proveedores y derechos de contenido se definen según contratación.';
const STEPS = [
  ['Fuente y objetivos', 'Definimos la fuente de streaming y los objetivos de la plataforma.'],
  ['Experiencia', 'Diseñamos la experiencia de reproducción, directorio y programación según el alcance.'],
  ['Desarrollo e integración', 'Construimos la plataforma e integramos los servicios requeridos.'],
  ['Pruebas de reproducción', 'Validamos la reproducción en vivo y bajo demanda antes de la entrega.'],
];
const CONCEPT = 'Ejemplo de portal de streaming con directorio de emisoras, reproductor en vivo, programación y contenido a la carta.';
const ART = { hero: ['hero-ai.webp', 2160, 992], concept: ['concept-ai.webp', 2772, 1328] };

test('streaming hero follows its mockup: one h1, lead and no hero CTA', async () => {
  const { status, rendered } = await page();
  assert.equal(status, 200);
  assert.equal((rendered.match(/<h1\b/g) || []).length, 1);
  assert.equal(textOf(rendered.match(/<h1\b[\s\S]*?<\/h1>/)[0]), 'Tu señal. Tu plataforma. Tu audiencia.');
  const hero = rendered.match(/<header[^>]*aria-labelledby="streaming-title"[\s\S]*?<\/header>/)?.[0] ?? '';
  assert.ok(hero.includes('id="streaming-title"'), 'hero labelled by its h1');
  assert.ok(textOf(hero).includes('Creamos plataformas web para emisoras, audio y video en vivo o bajo demanda, según el alcance.'), 'lead');
  assert.ok(!/<a\b/.test(hero) && !hero.includes('btn'), 'no hero CTA');
  const crumbs = rendered.match(/<nav[^>]*aria-label="Ruta de navegación"[\s\S]*?<\/nav>/)?.[0] ?? '';
  assert.ok(crumbs.includes('href="/"') && crumbs.includes('href="/servicios"'), 'breadcrumb links');
  assert.match(crumbs, /aria-current="page"[^>]*>Streaming</);
  assert.ok(!rendered.includes('aria-label="Otras categorías"'), 'no extra sector-category row');
});

test('streaming sections keep the mockup order, labels and copy', async () => {
  const { rendered } = await page();
  const h2s = [...rendered.matchAll(/<h2\b[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map(([, id, inner]) => ({ id, text: textOf(inner) }));
  assert.deepEqual(h2s.map(({ text }) => text).filter(text => HEADINGS.includes(text)), HEADINGS, 'headings in mockup order');
  for (const { id, text } of h2s.filter(({ text }) => HEADINGS.includes(text))) {
    assert.match(rendered, new RegExp(`<section[^>]*aria-labelledby="${id}"`), `${text} labels its section`);
  }
  const order = ['streaming-title', ...h2s.filter(({ text }) => HEADINGS.includes(text)).map(({ id }) => id), 'closing-title'].map(id => rendered.indexOf(`id="${id}"`));
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'hero, sections, then the shared closing');
  const capabilities = section(rendered, 'capacidades');
  assert.deepEqual([...capabilities.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map(([, inner]) => textOf(inner)), CAPABILITIES);
  assert.ok(textOf(section(rendered, 'vista-conceptual')).includes(CONCEPT), 'concept description');
  const process = section(rendered, 'proceso');
  assert.deepEqual([...process.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map(([, inner]) => textOf(inner)), STEPS.map(([title]) => title));
  for (const [, text] of STEPS) assert.ok(textOf(process).includes(text), text);
  const cta = section(rendered, 'contacto-streaming');
  assert.match(cta, /<a\b[^>]*href="\/contacto"/, 'CTA links to contact');
  assert.equal((rendered.match(/id="closing-title"/g) || []).length, 1, 'one shared closing footer');
  for (const anchor of [...rendered.matchAll(/href="#([^"]+)"/g)].map(match => match[1])) assert.ok(rendered.includes(`id="${anchor}"`), anchor);
});

test('streaming plans: three one-time plans priced "Por cotizar" with support and external-cost notes', async () => {
  const { rendered } = await page();
  const plans = section(rendered, 'planes');
  assert.match(plans, /aria-labelledby="/, 'labelled plans section');
  const text = textOf(plans);
  for (const [name, summary] of PLANS) assert.ok(text.includes(name) && text.includes(summary), name);
  assert.equal((plans.match(/<article\b/g) || []).length, 3);
  assert.equal((plans.match(/Pago único/g) || []).length, 3);
  assert.equal((plans.match(/Por cotizar/g) || []).length, 3);
  assert.equal((plans.match(/<a\b[^>]*href="\/contacto"/g) || []).length, 3, 'one contact link per plan');
  assert.equal((plans.match(/data-tilt=""/g) || []).length, 3, 'three 3D plan cards');
  assert.ok(text.includes(SUPPORT), 'recurring support bar');
  assert.ok(text.includes(EXTERNAL), 'external-cost note');
  assert.ok(!/\$\s?\d/.test(text), 'no invented prices');
});

test('streaming keeps the actual mockup art on tilting 3D stages', async () => {
  const { rendered } = await page();
  for (const [stage, [file, width, height]] of Object.entries(ART)) {
    const markup = rendered.match(new RegExp(`<div[^>]*data-art-3d="${stage}"[^>]*>[\\s\\S]*?<\\/div>`))?.[0] ?? '';
    assert.match(markup, /data-tilt/, `${stage} tilts`);
    const img = markup.match(/<img\b[^>]*>/)?.[0] ?? '';
    assert.ok(img.includes(`src="/images/services/streaming/${file}"`), `${stage} image`);
    assert.ok(img.includes(`width="${width}"`) && img.includes(`height="${height}"`), `${stage} intrinsic size`);
    const response = await fetch(`${base}/images/services/streaming/${file}`);
    assert.equal(response.status, 200, file);
    assert.match(response.headers.get('content-type'), /image\/webp/);
  }
  assert.ok(!rendered.includes('streaming-y-redes-hero.webp') && !rendered.includes('streaming-y-redes-concept.webp'), 'combined page art not substituted');
});

test('streaming has its own metadata and canonical URL', async () => {
  const { html } = await page();
  assert.ok(html.includes('<title>Plataformas de streaming a tu medida | TreesSide Developers</title>'));
  assert.ok(html.includes(`rel="canonical" href="${site}${path}"`));
  assert.ok(html.includes(`property="og:url" content="${site}${path}"`));
  assert.match(html, /<meta name="description" content="Creamos plataformas web para emisoras[^"]{60,}"/);
});

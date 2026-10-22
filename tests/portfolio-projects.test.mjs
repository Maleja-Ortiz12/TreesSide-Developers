import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response;
}
async function projectsSection() {
  const html = await (await get('/proyectos')).text();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  return section;
}
function cardFor(section, title) {
  const cards = section.split(/(?=<div[^>]*data-project=)/);
  return cards.find(card => card.includes(`>${title}</h3>`));
}

const WITH_IMAGES = {
  Ocho80: 'ocho80', Luhos: 'luhos', Gudfy: 'gudfy', Tanku: 'tanku',
  'Floraltech E-Commerce': 'floraltech', 'Atherium 3D Game': 'atherium', 'Otaku Portal': 'otaku-portal',
  'Portfolio CMS': 'portfolio-cms', 'Dashboard BI · Superstore': 'dashboard-superstore',
  'EDA · Renta Ciudadana': 'eda-renta-ciudadana', 'Análisis de Ventas de Cafetería': 'ventas-cafeteria',
  'Dimension Shift': 'dimension-shift', UptownHair: 'uptownhair', 'Emisoras Latinas': 'emisoras-latinas',
  'Entre Lanas y Fragancias': 'entre-lanas-y-fragancias',
};
const WITHOUT_IMAGES = ['Radio Navidad', 'Calculadora de contenedores', 'Libres en Cristo Jesús', 'Sistema de gestión de inventarios', 'Aplicación de gestión agropecuaria'];

test('every portfolio project is listed with the image its portfolio publishes', async () => {
  const section = await projectsSection();
  for (const [title, slug] of Object.entries(WITH_IMAGES)) {
    const card = cardFor(section, title);
    assert.ok(card, `missing project: ${title}`);
    assert.ok(card.includes(`%2Fimages%2Fprojects%2F${slug}.webp`) || card.includes(`/images/projects/${slug}.webp`), `image: ${title}`);
    assert.ok(!card.includes('Imagen de marca'), `brand placeholder on ${title}`);
  }
  for (const title of WITHOUT_IMAGES) {
    const card = cardFor(section, title);
    assert.ok(card, `missing project: ${title}`);
    assert.ok(card.includes('Imagen de marca'), `placeholder note: ${title}`);
  }
  assert.equal((section.match(/data-project=/g) || []).length, Object.keys(WITH_IMAGES).length + WITHOUT_IMAGES.length);
});

test('project images are served locally as nonempty WebP files', async () => {
  for (const slug of Object.values(WITH_IMAGES)) {
    const response = await get(`/images/projects/${slug}.webp`);
    assert.match(response.headers.get('content-type') || '', /image\/webp/);
    assert.ok((await response.arrayBuffer()).byteLength > 1000, slug);
  }
});

test('employer projects are shown as member work experience, never as TreesSide projects', async () => {
  const section = await projectsSection();
  for (const title of ['Luhos', 'Gudfy', 'Tanku']) {
    const card = cardFor(section, title);
    assert.ok(card.includes('Experiencia laboral · Ronaldo Delgado Correa'), title);
    assert.ok(!card.includes('Proyecto del equipo'), title);
  }
  const chips = [...section.matchAll(/<button[^>]*aria-pressed="(?:true|false)"[^>]*>([^<]*)</g)].map(m => m[1]);
  assert.ok(chips.includes('Experiencia laboral'));
  assert.ok(!/Cliente|encargo/.test(section));
});

test('template demo projects are removed', async () => {
  const section = await projectsSection();
  for (const title of ['Spacerolloph VR', 'Business Analytics', 'Corporación Financiera Andina', 'Arquitectura &amp; Diseño Studio']) {
    assert.ok(!section.includes(title), title);
  }
});

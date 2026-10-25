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
  Ocho80: 'ocho80', 'Radio Navidad': 'radio-navidad', Luhos: 'luhos', Gudfy: 'gudfy', Tanku: 'tanku',
  'Floraltech E-Commerce': 'floraltech', 'Atherium 3D Game': 'atherium', 'Otaku Portal': 'otaku-portal',
  'Portfolio CMS': 'portfolio-cms', 'Dashboard BI · Superstore': 'dashboard-superstore',
  'EDA · Renta Ciudadana': 'eda-renta-ciudadana', 'Análisis de Ventas de Cafetería': 'ventas-cafeteria',
  'Dimension Shift': 'dimension-shift', UptownHair: 'uptownhair', 'Emisoras Latinas': 'emisoras-latinas-cover',
  'Entre Lanas y Fragancias': 'entre-lanas-y-fragancias',
  TengoYa: 'tengoya', CarWeb: 'carweb', Histech: 'histech', 'Robot Alejo 2.0': 'robot-alejo',
  'La Lupe': 'la-lupe',
  'Calculadora de contenedores': 'calculadora-contenedores',
  'Libres en Cristo Jesús': 'libres-en-cristo',
  'API de Tienda + Asistente IA': 'tienda-api',
  'Sistema de gestión de inventarios': 'gestion-inventarios',
  'Aplicación de gestión agropecuaria': 'gestion-agropecuaria',
  'Migración Pega → UiPath': 'migracion-pega-uipath',
};

test('every portfolio project is listed with its local project image or labeled conceptual cover', async () => {
  const section = await projectsSection();
  for (const [title, slug] of Object.entries(WITH_IMAGES)) {
    const card = cardFor(section, title);
    assert.ok(card, `missing project: ${title}`);
    assert.ok(card.includes(`%2Fimages%2Fprojects%2F${slug}.webp`) || card.includes(`/images/projects/${slug}.webp`), `image: ${title}`);
    assert.ok(!card.includes('Imagen de marca'), `brand placeholder on ${title}`);
  }
  assert.equal((section.match(/data-project=/g) || []).length, Object.keys(WITH_IMAGES).length);
});

test('La Lupe is a single card crediting both authors', async () => {
  const section = await projectsSection();
  const card = cardFor(section, 'La Lupe');
  assert.ok(card, 'missing project: La Lupe');
  assert.equal(section.split(/(?=<div[^>]*data-project=)/).filter(item => item.includes('>La Lupe</h3>')).length, 1);
  assert.ok(card.replace(/<[^>]+>/g, ' ').includes('María Alejandra Ortiz Páez y Ronaldo Delgado Correa'));
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

test('project ids are clean slugs and Jorge store API links to its repository', async () => {
  const section = await projectsSection();
  const ids = [...section.matchAll(/data-project="([^"]+)"/g)].map(m => m[1]);
  for (const id of ids) assert.match(id, /^equipo-[a-z0-9]+(?:-[a-z0-9]+)*$/, id);
  assert.ok(ids.includes('equipo-libres-en-cristo-jesus'));
  const { readFile } = await import('node:fs/promises');
  const team = await readFile('src/data/team.ts', 'utf8');
  assert.ok(team.includes("link: 'https://github.com/jorge-puentes-b/tienda-api-efcore'"));
});

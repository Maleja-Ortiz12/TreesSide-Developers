import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response;
}
const page = async path => (await get(path)).text();
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const NAME = 'Jorge Luis Ramírez Trochez';
const PORTFOLIO = 'https://www.jorgeramirez.site/';

async function projectCards() {
  const html = await page('/proyectos');
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  return section.split(/(?=<div[^>]*data-project=)/).slice(1);
}
const cardFor = (cards, title) => cards.filter(card => card.includes(`>${title}</h3>`));

test('S1 Jorge Ramírez has a full profile on /equipo with his portfolio portrait', async () => {
  const html = await page('/equipo');
  const article = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(([a]) => a).find(a => a.includes(NAME));
  assert.ok(article, 'profile');
  const image = article.match(/<img[^>]*src="\/images\/team\/jorge-ramirez\.webp"[^>]*>/)?.[0];
  assert.ok(image, 'portrait');
  assert.ok(image.includes(`alt="${NAME}"`));
  const content = text(article);
  for (const t of ['Automation Engineer', 'UiPath', 'Python', 'Bogotá']) assert.ok(content.includes(t), t);
  assert.ok(article.includes(`href="${PORTFOLIO}"`));
  const response = await get('/images/team/jorge-ramirez.webp');
  assert.match(response.headers.get('content-type') || '', /image\/webp/);
});

test('S1 Jorge Ramírez shares his passion on /nosotros', async () => {
  const html = await page('/nosotros');
  const block = html.match(/<div[^>]*id="lo-que-nos-apasiona"[\s\S]*?<\/ul>/)?.[0];
  assert.ok(text(block).includes(NAME));
});

test('S2 his portfolio projects are listed with local cover images', async () => {
  const cards = await projectCards();
  for (const [title, slug] of [['TengoYa', 'tengoya'], ['CarWeb', 'carweb'], ['Histech', 'histech'], ['Robot Alejo 2.0', 'robot-alejo']]) {
    const [card] = cardFor(cards, title);
    assert.ok(card, title);
    assert.ok(card.includes(`%2Fimages%2Fprojects%2F${slug}.webp`) || card.includes(`/images/projects/${slug}.webp`), `image ${title}`);
    assert.ok(text(card).includes(NAME), `author ${title}`);
  }
  const [pega] = cardFor(cards, 'Migración Pega → UiPath');
  assert.ok(pega, 'Pega migration');
  assert.ok(pega.includes('migracion-pega-uipath.webp'));
  assert.ok(pega.includes('Ilustración conceptual'));
  assert.ok(pega.includes('No es una captura real'));
});

test('S3 shared projects are a single card crediting both members', async () => {
  const cards = await projectCards();
  const emisoras = cardFor(cards, 'Emisoras Latinas');
  assert.equal(emisoras.length, 1);
  assert.ok(text(emisoras[0]).includes('María Alejandra Ortiz Páez y Jorge Luis Ramírez Trochez'));
  assert.ok(emisoras[0].includes('emisoras-latinas-cover.webp'));
  const radio = cardFor(cards, 'Radio Navidad');
  assert.equal(radio.length, 1);
  assert.ok(text(radio[0]).includes('Ronaldo Delgado Correa y Jorge Luis Ramírez Trochez'));
  assert.ok(radio[0].includes("radio-navidad.webp"));
  assert.ok(!radio[0].includes('Imagen de marca'));
  assert.ok(!cards.some(card => card.includes('>Christmas Radio Navidad</h3>')));
  for (const card of [emisoras[0], radio[0]]) {
    assert.equal((card.match(/aria-label="Ver portafolio de /g) || []).length, 2);
    assert.ok(card.includes(`href="${PORTFOLIO}"`));
  }
});

test('S4 his employer work is marked as work experience', async () => {
  const cards = await projectCards();
  for (const title of ['Robot Alejo 2.0', 'Migración Pega → UiPath']) {
    const [card] = cardFor(cards, title);
    assert.ok(text(card).includes(`Experiencia laboral · ${NAME}`), title);
  }
});

test('S5 his technologies render with their own logo', async () => {
  const html = await page('/servicios');
  for (const name of ['UiPath', 'Bizagi', 'SAP', 'NumPy', 'OpenAI']) {
    const card = html.match(new RegExp(`<div[^>]*data-tech="${name}"[\\s\\S]*?</svg>`))?.[0];
    assert.ok(card, name);
    assert.ok(!card.includes('data-tech-fallback'), name);
  }
  const content = text(html);
  for (const t of ['RPA con UiPath', 'Modelado de procesos con Bizagi', 'SEO técnico']) assert.ok(content.includes(t), t);
});

test('S6 home brand card counts four developers', async () => {
  assert.ok(text(await page('/')).includes('4 desarrolladores'));
});

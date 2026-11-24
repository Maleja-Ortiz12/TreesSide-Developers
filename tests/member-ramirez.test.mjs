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

// The team (and each member's passion) moved off /nosotros; members are presented on /equipo.
test('S1 Jorge Ramírez is presented on /equipo, not on /nosotros', async () => {
  assert.ok(!text(await page('/nosotros')).includes(NAME));
  assert.ok(text(await page('/equipo')).includes(NAME));
});

test('S3-S6 his exclusive portfolio projects are no longer published', async () => {
  const cards = await projectCards();
  const team = text(await page('/equipo'));
  for (const title of ['TengoYa', 'CarWeb', 'Histech', 'Gametroz', 'Fundación Propósito Posible', 'ALTiora Inmobiliaria', 'CV Automatic']) {
    assert.equal(cardFor(cards, title).length, 0, title);
    assert.ok(!team.includes(title), title);
  }
});

test('S3 shared projects are a single card crediting both members', async () => {
  const cards = await projectCards();
  const emisoras = cardFor(cards, 'Emisoras Latinas');
  assert.equal(emisoras.length, 1);
  // Compact cards (odd/tasks/rediseno-mockup.md S8): authors and portfolios are shown in the detail modal.
  assert.ok(emisoras[0].includes('projects%2Femisoras-latinas-cover.webp') || emisoras[0].includes('/images/projects/emisoras-latinas-cover.webp'));
  const radio = cardFor(cards, 'Radio Navidad');
  assert.equal(radio.length, 1);
  assert.ok(radio[0].includes("radio-navidad.webp"));
  assert.ok(!radio[0].includes('Imagen de marca'));
  assert.ok(!cards.some(card => card.includes('>Christmas Radio Navidad</h3>')));
});

test('S3-S6 his exclusive employer work is no longer published', async () => {
  const cards = await projectCards();
  const team = text(await page('/equipo'));
  for (const title of ['Robot Alejo 2.0', 'Migración Pega → UiPath']) {
    assert.equal(cardFor(cards, title).length, 0, title);
    assert.ok(!team.includes(title), title);
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

test('S6 home links to team evidence instead of counting contracts', async () => {
  assert.ok((await page('/')).includes('href="/equipo"'));
  assert.ok(text(await page('/equipo')).includes('Jorge'));
});

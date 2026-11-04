import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const projectsPage = () => page('/proyectos');
const servicesPage = () => page('/servicios');

test('catalog integrates team projects with attribution and portfolio sources without duplicating Floraltech', async () => {
  const html = await projectsPage();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  for (const title of ['Ocho80', 'Radio Navidad', 'Floraltech E-Commerce', 'Dimension Shift', 'UptownHair']) assert.ok(section.includes(title), title);
  assert.equal((section.match(/<h3[^>]*>Floraltech E-Commerce<\/h3>/g) || []).length, 1);
  assert.ok(section.includes('pasarela de pagos simulada'));
});

test('languages include every portfolio-declared language with Spanish categories', async () => {
  const html = await servicesPage();
  for (const lang of ['JavaScript', 'TypeScript', 'PHP', 'Python', 'C++', 'C#', 'Dart', 'SQL']) assert.ok(html.includes(`>${lang}<`), lang);
  for (const english of ['>Language<', '>Database<', '>Analytics<', '>Tools<', '>System<']) assert.ok(!html.includes(english), english);
});

test('project filter chips are unique and project actions name their project', async () => {
  const html = await projectsPage();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0];
  const chips = [...section.matchAll(/<button[^>]*aria-pressed="(?:true|false)"[^>]*>([^<]*)</g)].map(m => m[1]);
  // Filters requested in odd/tasks/rediseno-mockup.md S4 (L9).
  assert.deepEqual(chips, ['Todos', 'Restaurantes', 'Juegos', 'Datos', 'E-commerce']);
  assert.ok(section.includes('aria-label="Ver proyecto Ocho80"'));
  assert.ok(!/Cliente|encargo/.test(section));
});

test('team project categories never collide with the team filter', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile('src/data/content.ts', 'utf8');
  assert.ok(!/\?\?\s*'Proyectos del equipo'/.test(source), 'Fallback category must differ from the team filter');
});

test('technologies and buildable solutions reflect verified portfolio skills', async () => {
  const html = (await servicesPage()) + (await projectsPage());
  for (const name of ['JavaScript', 'TypeScript', 'Dart', 'PHP', 'PostgreSQL', 'NestJS', 'Next.js', 'Flutter', 'Unity', 'n8n', 'Azure']) assert.ok(html.includes(name), name);
  for (const text of ['Aplicaciones de reservas', 'Radio web', 'Videojuegos con Unity', 'Automatización con n8n']) assert.ok(html.includes(text), text);
  assert.ok(!html.includes('Frontend (React, Vue, Angular)'));
  assert.ok(!html.includes('Power BI / Tableau'));
});

test('S4 each card names its filter group next to its real category', async () => {
  const html = await projectsPage();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0] ?? '';
  const card = title => section.split(/(?=<div[^>]*data-project=)/).find(item => item.includes(`>${title}</h3>`)) ?? '';
  const text = value => value.replace(/<!-- -->/g, '');
  const group = title => text(card(title)).match(/class="[^"]*card-group[^"]*">([^<]*)</)?.[1]?.replace(/&amp;/g, '&');
  assert.equal(group('La Lupe'), 'Restaurantes · Sitios web');
  assert.equal(group('Atherium 3D Game'), 'Juegos · Videojuegos');
  assert.equal(group('Gametroz'), 'Juegos · Sitios web');
  assert.equal(group('Ocho80'), 'Juegos · Tiempo real');
  assert.equal(group('Dashboard BI · Superstore'), 'Datos · Análisis de datos');
  assert.equal(group('Floraltech E-Commerce'), 'E-commerce · Web & E-Commerce');
  assert.equal(group('Gudfy'), 'E-commerce · Web & E-Commerce');
  // Projects outside the four groups appear only under Todos and show just their category.
  assert.equal(group('Luhos'), 'Sistemas de gestión');
  assert.equal(group('TengoYa'), 'Marketplaces');
});

test('S8 cards stay compact while the detail modal keeps every author, portfolio and experience note', async () => {
  const html = await projectsPage();
  const section = html.match(/<section id="proyectos"[\s\S]*?<\/section>/)?.[0] ?? '';
  const cards = section.split(/(?=<div[^>]*data-project=)/).slice(1);
  assert.equal(cards.length, 31);
  for (const card of cards) assert.ok(!card.includes('Ver portafolio de '), 'portfolio links live in the modal');
  // The modal reads the catalog shipped to the browser, so its data must be in the served bundles.
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match => match[1]);
  const bundles = (await Promise.all(scripts.map(async src => (await fetch(new URL(src.replace(/&amp;/g, '&'), base))).text()))).join('\n');
  // Minifiers write accented letters as \xNN or \uNNNN escapes.
  const served = bundles.replace(/\\x([0-9a-f]{2})|\\u([0-9a-f]{4})/gi, (_, x, u) => String.fromCharCode(parseInt(x ?? u, 16)));
  for (const value of ['Ronaldo Delgado Correa', 'Jorge Luis Puentes Brochero', 'María Alejandra Ortiz Páez', 'Jorge Luis Ramírez Trochez',
    'https://ronaldo-delgado.vercel.app/', 'https://portafolio-xi-liart-92.vercel.app/', 'https://portafolio-bay-tau.vercel.app/', 'https://www.jorgeramirez.site/']) {
    assert.ok(served.includes(value), value);
  }
  const { readFile } = await import('node:fs/promises');
  const modal = await readFile('src/components/ProjectModal.tsx', 'utf8');
  for (const token of ['project.authors.map', 'author.portfolio', 'Experiencia laboral · ${project.owner}']) assert.ok(modal.includes(token), token);
});

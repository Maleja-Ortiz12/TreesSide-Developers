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
  for (const name of ['Ronaldo Delgado Correa', 'Jorge Luis Puentes Brochero', 'María Alejandra Ortiz Páez']) assert.ok(section.includes(name), name);
  assert.equal((section.match(/<h3[^>]*>Floraltech E-Commerce<\/h3>/g) || []).length, 1);
  assert.ok(section.includes('Proyectos del equipo'));
  assert.ok(section.includes('pasarela de pagos simulada'));
  for (const url of ['https://ronaldo-delgado.vercel.app/', 'https://portafolio-xi-liart-92.vercel.app/', 'https://portafolio-bay-tau.vercel.app/']) {
    assert.ok(section.includes(`href="${url}"`));
  }
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
  assert.ok(chips.includes('Proyectos del equipo'));
  assert.equal(chips.length, new Set(chips).size, `duplicate chips: ${chips}`);
  assert.ok(section.includes('aria-label="Ver proyecto Ocho80"'));
  assert.ok(section.includes('aria-label="Ver portafolio de Ronaldo Delgado Correa (abre en otra pestaña)"'));
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

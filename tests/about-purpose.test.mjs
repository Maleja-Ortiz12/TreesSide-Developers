import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('about page no longer repeats the team section, which lives on /equipo', async () => {
  const html = await page('/nosotros');
  assert.ok(!/<section[^>]*id="equipo"/.test(html));
  assert.ok(!html.includes('/images/team/'), 'no team portraits on /nosotros');
  assert.ok(html.includes('href="/equipo"'), 'still links to the team page');
  const team = await page('/equipo');
  assert.ok(/<section[^>]*id="equipo"/.test(team));
});

test('about page states the team objective', async () => {
  const content = text(await page('/nosotros'));
  for (const phrase of [
    'Software al alcance de todos',
    'procesos manuales repetitivos',
    'Innovar',
    'microempresas y pequeños emprendimientos hasta grandes empresas',
    'Colombia sea un país más tecnológico y productivo',
    'la tecnología y la innovación son herramientas para crecer como país',
  ]) assert.ok(content.includes(phrase), phrase);
});

test('about page shares what each member is passionate about', async () => {
  const html = await page('/nosotros');
  const block = html.match(/<div[^>]*id="lo-que-nos-apasiona"[\s\S]*?<\/ul>/)?.[0];
  assert.ok(block, 'passions block');
  const content = text(block);
  assert.ok(content.includes('Lo que nos apasiona'));
  for (const name of ['Ronaldo Delgado Correa', 'Jorge Luis Puentes Brochero', 'María Alejandra Ortiz Páez']) {
    assert.ok(content.includes(name), name);
  }
  assert.equal((block.match(/<li\b/g) || []).length, 3);
});

test('about page shows the current brand only', async () => {
  const content = text(await page('/nosotros')).replace(/\s/g, '');
  assert.ok(!content.includes('SoftZenkodoDevs'));
});

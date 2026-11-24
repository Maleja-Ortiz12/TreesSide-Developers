import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

// Nosotros no longer shows the team (it has its own page); see tests/about-mission-vision.test.mjs.
test('about page links to the team page without showing team portraits', async () => {
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

test('member passions moved off Nosotros with the team', async () => {
  const html = await page('/nosotros');
  assert.ok(!html.includes('id="lo-que-nos-apasiona"'));
});

test('about page shows the current brand only', async () => {
  const content = text(await page('/nosotros')).replace(/\s/g, '');
  assert.ok(!content.includes('SoftZenkodoDevs'));
});

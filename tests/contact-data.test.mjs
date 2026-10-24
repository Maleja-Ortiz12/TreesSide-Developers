import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const footer = html => html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
const WHATSAPP = 'https://wa.me/573057173986';

test('S1 contact page shows the real phone and WhatsApp, never the placeholder', async () => {
  const html = await page('/contacto');
  assert.ok(html.includes('+57 305 717 3986'));
  assert.ok(html.includes(`href="${WHATSAPP}`));
  assert.ok(html.includes('correo@softzenkododevs.com'));
  assert.ok(!html.includes('300 123 4567') && !html.includes('573001234567'));
});

test('S1 no page links to placeholder social profiles; the footer offers email and WhatsApp instead', async () => {
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/contacto']) {
    const html = await page(path);
    assert.doesNotMatch(html, /href="https:\/\/(github|linkedin|youtube|x)\.com\/?"/, `${path} placeholder social link`);
    const foot = footer(html);
    assert.ok(!foot.includes('Síguenos'), `${path} social column removed`);
    assert.ok(foot.includes('href="mailto:correo@softzenkododevs.com"'), `${path} footer email`);
    assert.ok(foot.includes(`href="${WHATSAPP}`), `${path} footer WhatsApp`);
  }
  const content = await readFile('src/data/content.ts', 'utf8');
  assert.ok(!content.includes('socials'), 'no social placeholders in data');
});

test('S1 brand is TreesSide in titles; the real domain stays as the site URL', async () => {
  const html = await page('/');
  assert.match(html, /<title>[^<]*TreesSide[^<]*<\/title>/);
  assert.ok(!/<title>[^<]*SoftZenkodo/i.test(html));
});

import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ');

test('S3 the personal data policy page carries the minimum content of Ley 1581 de 2012', async () => {
  const html = await page('/politica-de-datos');
  assert.match(html, /<h1[^>]*>Política de tratamiento de datos personales<\/h1>/);
  assert.match(html, /<title>[^<]*Política de tratamiento de datos[^<]*TreesSide[^<]*<\/title>/);
  const text = plain(html);
  for (const required of [
    'Ley 1581 de 2012', 'Decreto 1377 de 2013', 'TreesSide Developers',
    'correo@softzenkododevs.com', '+57 305 717 3986',
    'Finalidad', 'conocer, actualizar y rectificar', 'revocar la autorización', 'solicitar la supresión',
    'diez (10) días hábiles', 'quince (15) días hábiles', 'Superintendencia de Industria y Comercio',
    'Formspree', 'Estados Unidos', 'Fecha de entrada en vigencia: 24 de octubre de 2026',
  ]) {
    assert.ok(text.toLowerCase().includes(required.toLowerCase()), `missing: ${required}`);
  }
});

test('S3 every page footer links to the data policy', async () => {
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/contacto', '/politica-de-datos']) {
    const footer = (await page(path)).match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
    assert.ok(footer.includes('href="/politica-de-datos"'), path);
  }
});

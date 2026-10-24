import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}

test('S4 every page has one floating WhatsApp button to the real number', async () => {
  for (const path of ['/', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto', '/politica-de-datos']) {
    const buttons = (await page(path)).match(/<a[^>]*data-whatsapp-float[^>]*>/g) ?? [];
    assert.equal(buttons.length, 1, `${path} buttons`);
    const [button] = buttons;
    assert.ok(button.includes('href="https://wa.me/573057173986'), `${path} number`);
    assert.ok(button.includes('aria-label="Escríbenos por WhatsApp"'), `${path} label`);
    assert.ok(button.includes('target="_blank"') && button.includes('rel="noopener noreferrer"'), `${path} new tab`);
  }
});

test('S4 the button floats above the page and calms down for reduced motion', async () => {
  const css = await readFile('src/components/WhatsAppButton.module.css', 'utf8');
  assert.match(css, /\.button\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*animation:\s*none/);
});

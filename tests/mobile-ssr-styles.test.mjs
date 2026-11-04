import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const styles = html => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]).join('\n');

test('S2 component responsive rules are in the server HTML, so phones get the mobile layout before JavaScript loads', async () => {
  // S9 uses a CSS module for the home instead of an inline styled-jsx hero grid.
  const html = await page('/');
  const urls = [...html.matchAll(/<link[^>]*href="([^"]+\.css[^"]*)"[^>]*>/g)].map(m => m[1]);
  const css = (await Promise.all(urls.map(async url => (await fetch(new URL(url.replace(/&amp;/g, '&'), base))).text()))).join(String.fromCharCode(10));
  assert.match(css, /@media\s*\(max-width:\s*760px\)/, 'home responsive CSS linked before hydration');
  const cases = [

    ['/servicios', /\.tech-grid\.jsx-[0-9a-f]+\{grid-template-columns:repeat\(2,1fr\)!important/],
  ];
  for (const [path, rule] of cases) {
    const css = styles(await page(path));
    assert.match(css, rule, `${path} ships its scoped media query in the HTML`);
  }
});

test('S2 each scoped style block is sent once per page', async () => {
  const html = await page('/');
  const ids = [...html.matchAll(/<style id="(__jsx-[^"]+)"/g)].map(match => match[1]);
  assert.ok(ids.length > 0, 'styled-jsx blocks present');
  assert.equal(new Set(ids).size, ids.length, 'no duplicated style block');
});

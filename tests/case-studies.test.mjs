import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function get(path) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
}
async function page(path) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  return response.text();
}
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ');
const CASES = [
  { slug: 'la-lupe', title: 'La Lupe', authors: 'María Alejandra Ortiz Páez y Ronaldo Delgado Correa', image: 'la-lupe', facts: ['menú', 'WhatsApp', 'catering'], live: 'https://lalupe.co/' },
  { slug: 'emisoras-latinas', title: 'Emisoras Latinas', authors: 'María Alejandra Ortiz Páez y Jorge Luis Ramírez Trochez', image: 'emisoras-latinas-cover', facts: ['15.000 emisoras', 'miles de visitas diarias'] },
  { slug: 'tengoya', title: 'TengoYa', authors: 'Jorge Luis Ramírez Trochez', image: 'tengoya', facts: ['1.122 municipios', 'WhatsApp'] },
];

test('S2 each case study tells context, challenge, solution, technologies and results with the real authors', async () => {
  for (const item of CASES) {
    const html = await page(`/casos/${item.slug}`);
    assert.match(html, new RegExp(`<h1[^>]*>[^<]*${item.title}[^<]*</h1>`), `${item.slug} h1`);
    const text = plain(html);
    for (const heading of ['Contexto', 'El reto', 'La solución', 'Tecnologías', 'Resultados']) {
      assert.match(html, new RegExp(`<h2[^>]*>${heading}</h2>`), `${item.slug} ${heading}`);
    }
    assert.ok(text.includes(item.authors), `${item.slug} authors`);
    for (const fact of item.facts) assert.ok(text.includes(fact), `${item.slug} fact ${fact}`);
    assert.ok(html.includes(`%2Fimages%2Fprojects%2F${item.image}.webp`) || html.includes(`/images/projects/${item.image}.webp`), `${item.slug} image`);
    assert.ok(html.includes('href="/contacto"'), `${item.slug} call to action`);
    if (item.live) assert.ok(html.includes(`href="${item.live}"`), `${item.slug} live site`);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://softzenkododevs.com/casos/${item.slug}"`), `${item.slug} canonical`);
  }
});

test('S2 case studies make no unpublished claims: every number comes from the project catalog', async () => {
  const cases = await readFile('src/data/cases.ts', 'utf8');
  const team = await readFile('src/data/team.ts', 'utf8');
  const numbers = cases.match(/\d[\d.]*\s*%|\d{1,3}(?:\.\d{3})+|\b\d{2,}\b/g) ?? [];
  for (const number of numbers) assert.ok(team.includes(number), `number ${number} is not in the catalog`);
});

test('S2 the case index lists the three cases, unknown slugs are 404, and the sitemap includes them', async () => {
  const index = await page('/casos');
  for (const item of CASES) assert.ok(index.includes(`href="/casos/${item.slug}"`), `index ${item.slug}`);
  assert.equal((await get('/casos/no-existe')).status, 404);
  const sitemap = await page('/sitemap.xml');
  for (const path of ['/casos', ...CASES.map(item => `/casos/${item.slug}`)]) {
    assert.ok(sitemap.includes(`<loc>https://softzenkododevs.com${path}</loc>`), `sitemap ${path}`);
  }
});

test('S2 cases are reachable from the footer, the home carousel and the demo cards', async () => {
  const home = await page('/');
  const footer = home.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
  assert.ok(footer.includes('href="/casos"'), 'footer link');
  const carousel = home.match(/<section id="carrusel"[\s\S]*?<\/section>/)?.[0] ?? '';
  for (const item of CASES) {
    const card = [...carousel.matchAll(/<a[^>]*data-carousel-item[^>]*>[\s\S]*?<\/a>/g)].map(m => m[0])
      .find(entry => !entry.includes('tabindex="-1"') && entry.includes(`<strong>${item.title}</strong>`));
    assert.ok(card?.includes(`href="/casos/${item.slug}"`), `carousel ${item.slug}`);
  }
  const demo = home.match(/<article[^>]*data-demo="la-lupe"[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.ok(demo.includes('href="/casos/la-lupe"'), 'La Lupe demo links its case study');
  const modal = await readFile('src/components/ProjectModal.tsx', 'utf8');
  assert.ok(modal.includes('Ver caso de éxito'), 'project modal links the case study');
});

test('S2 case claims borrowed from another project are not published', async () => {
  const cases = await readFile('src/data/cases.ts', 'utf8');
  const emisoras = cases.slice(cases.indexOf("slug: 'emisoras-latinas'"), cases.indexOf("slug: 'tengoya'"));
  assert.doesNotMatch(emisoras, /sin registro|cualquier dispositivo/i, 'only Radio Navidad is published as "sin registro" and "cualquier dispositivo"');
});

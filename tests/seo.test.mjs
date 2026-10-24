import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SITE = 'https://softzenkododevs.com';
const ROUTES = ['', '/servicios', '/proyectos', '/nosotros', '/equipo', '/contacto', '/politica-de-datos'];
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, path);
  return response;
}

test('S4 sitemap.xml lists every public page on the real domain', async () => {
  const xml = await (await get('/sitemap.xml')).text();
  for (const route of ROUTES) assert.ok(xml.includes(`<loc>${SITE}${route}</loc>`), `sitemap ${route || '/'}`);
});

test('S4 robots.txt allows crawling and points to the sitemap', async () => {
  const robots = await (await get('/robots.txt')).text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//);
  assert.ok(robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
});

test('S4 the home page publishes Organization structured data with the real contact and no social profiles', async () => {
  const html = await (await get('/')).text();
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(raw, 'JSON-LD script');
  const data = JSON.parse(raw);
  assert.equal(data['@context'], 'https://schema.org');
  assert.equal(data['@type'], 'Organization');
  assert.equal(data.name, 'TreesSide Developers');
  assert.equal(data.url, SITE);
  assert.equal(data.email, 'correo@softzenkododevs.com');
  assert.equal(data.telephone, '+57 305 717 3986');
  assert.equal(data.address.addressCountry, 'CO');
  assert.ok(!('sameAs' in data), 'no social profiles yet');
});

test('S4 pages share a large Open Graph image served as PNG', async () => {
  const html = await (await get('/')).text();
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  // next dev resolves file-based images against the dev server; production builds use metadataBase (the real domain).
  assert.ok([SITE, new URL(base).origin].some(origin => image?.startsWith(`${origin}/opengraph-image`)), `og:image ${image}`);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  const png = await get(new URL(image).pathname + new URL(image).search);
  assert.equal(png.headers.get('content-type'), 'image/png');
  assert.ok((await png.arrayBuffer()).byteLength > 5000, 'non-trivial image');
});

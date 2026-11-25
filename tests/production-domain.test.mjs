import test from 'node:test';
import assert from 'node:assert/strict';

// Production SEO uses the definitive domain; the temporary workers.dev host must not leak into public metadata.
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const DOMAIN = 'https://treesset.com';
const get = async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, path);
  return response.text();
};
const head = html => html.match(/<head[\s\S]*?<\/head>/)?.[0] ?? '';

test('sitemap lists every public page on https://treesset.com, keeping its route', async () => {
  const sitemap = await get('/sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.ok(locs.length >= 20, `sitemap has ${locs.length} pages`);
  for (const loc of locs) assert.ok(loc === DOMAIN || loc.startsWith(`${DOMAIN}/`), loc);
  assert.ok(locs.includes(DOMAIN) && locs.includes(`${DOMAIN}/planes`) && locs.includes(`${DOMAIN}/servicios/restaurantes`));
  assert.doesNotMatch(sitemap, /malejawork12|workers\.dev/);
});

test('robots.txt allows public pages and points to the production sitemap', async () => {
  const robots = await get('/robots.txt');
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \/\s*$/m);
  assert.match(robots, /Sitemap: https:\/\/treesset\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /malejawork12|workers\.dev/);
});

test('every sitemap page has its own canonical, Open Graph URL and structured data on the production domain', async () => {
  const sitemap = await get('/sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const canonicals = new Set();
  for (const url of urls) {
    const route = url.slice(DOMAIN.length) || '/';
    const html = await get(route);
    const metadata = head(html);
    const canonical = metadata.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(canonical, url, `${route} canonical`);
    assert.equal(metadata.match(/<meta property="og:url" content="([^"]+)"/)?.[1], url, `${route} og:url`);
    assert.match(metadata.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? '', /^https:\/\/treesset\.com\//, `${route} og:image`);
    assert.doesNotMatch(metadata, /malejawork12|treesside-developers\.malejawork12/, `${route} metadata`);
    canonicals.add(canonical);
  }
  assert.equal(canonicals.size, urls.length, 'each page has its own canonical');
  const home = await get('/');
  const jsonLd = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(jsonLd.url, DOMAIN);
  assert.ok(jsonLd.logo.startsWith(`${DOMAIN}/`), jsonLd.logo);
});

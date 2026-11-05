import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SITE = 'https://treesside-developers.malejawork12.workers.dev';
const SHARE_IMAGE = '/images/treesside-share.png';
async function get(path, headers = {}) {
  const response = await fetch(new URL(path, base), { headers, signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, path);
  return response;
}

test('the shared link preview serves a 1200 by 630 homepage screenshot', async () => {
  const html = await (await get('/')).text();
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(image, 'og:image');
  const url = new URL(image);
  const png = Buffer.from(await (await get(url.pathname + url.search)).arrayBuffer());
  const { width, height, format } = await sharp(png).metadata();
  assert.deepEqual({ width, height, format }, { width: 1200, height: 630, format: 'png' });
  // The actual desktop header sits at the top left, not the old centered logo card.
  const header = await sharp(png).extract({ left: 20, top: 5, width: 180, height: 55 }).stats();
  assert.ok(header.channels.slice(0, 3).every(channel => channel.max > 200), 'visible white header wordmark');
  const hero = await sharp(png).extract({ left: 580, top: 80, width: 580, height: 380 }).stats();
  assert.ok(hero.entropy > 4, 'detailed homepage hero image');
});

const meta = (head, attr, name) => head.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];

for (const userAgent of ['WhatsApp/2.24.7.81 A', 'facebookexternalhit/1.1']) {
  test(`S5 ${userAgent} finds the share image in <head> and downloads the published PNG`, async () => {
    const html = await (await get('/', { 'User-Agent': userAgent })).text();
    const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
    assert.ok(head, '<head>');
    assert.equal(meta(head, 'property', 'og:image'), `${SITE}${SHARE_IMAGE}`);
    assert.equal(meta(head, 'property', 'og:image:type'), 'image/png');
    assert.equal(meta(head, 'property', 'og:image:width'), '1200');
    assert.equal(meta(head, 'property', 'og:image:height'), '630');
    assert.equal(meta(head, 'name', 'twitter:image'), `${SITE}${SHARE_IMAGE}`);

    const response = await get(SHARE_IMAGE, { 'User-Agent': userAgent });
    assert.equal(response.headers.get('content-type'), 'image/png');
    // The card is a published file, not generated per request.
    const served = Buffer.from(await response.arrayBuffer());
    assert.ok(served.equals(await readFile(`public${SHARE_IMAGE}`)), 'served bytes equal the tracked PNG');
  });
}

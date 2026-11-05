import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const SITE = 'https://treesside-developers.malejawork12.workers.dev';
const SHARE_IMAGE = '/images/treesside-share.png';
// Where public/images/treesside-share.png shows the company logo inside the 1200×630 card.
const LOGO = { left: 780, top: 145, size: 340 };
// Compare only the inner part so rounded corners and the border do not count.
const INSET = 30;

async function get(path, headers = {}) {
  const response = await fetch(new URL(path, base), { headers, signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, 200, path);
  return response;
}

async function region(input, size) {
  const inner = size - INSET * 2;
  return sharp(input)
    .extract({ left: INSET, top: INSET, width: inner, height: inner })
    .removeAlpha()
    .raw()
    .toBuffer();
}

test('S5 the shared link preview shows the TreesSide Developers logo', async () => {
  const html = await (await get('/')).text();
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(image, 'og:image');
  const url = new URL(image);
  const png = Buffer.from(await (await get(url.pathname + url.search)).arrayBuffer());
  const { width, height, format } = await sharp(png).metadata();
  assert.deepEqual({ width, height, format }, { width: 1200, height: 630, format: 'png' });

  const crop = await sharp(png).extract({ left: LOGO.left, top: LOGO.top, width: LOGO.size, height: LOGO.size }).png().toBuffer();
  const logo = await sharp('public/images/treesside-logo.jpg').resize(LOGO.size, LOGO.size).png().toBuffer();
  const [served, expected] = await Promise.all([region(crop, LOGO.size), region(logo, LOGO.size)]);
  let difference = 0;
  for (let i = 0; i < served.length; i++) difference += Math.abs(served[i] - expected[i]);
  const average = difference / served.length;
  assert.ok(average < 12, `logo region differs from public/images/treesside-logo.jpg by ${average.toFixed(1)} per channel`);
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

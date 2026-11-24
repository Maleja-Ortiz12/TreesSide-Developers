// node scripts/render-admin-concepts.mjs — isolated, offline, additive render only.
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { composition } from './admin-concepts/template.mjs';
import { openBrowser, ready } from './admin-concepts/browser.mjs';
const scratch = await mkdtemp(join(tmpdir(), 'admin-concepts-render-'));
const browser = await openBrowser();
try {
  await browser.cdp('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });
  for (const id of ['salon-admin', 'restaurant-admin']) {
    const file = join(scratch, `${id}.html`);
    await writeFile(file, composition(id));
    await browser.cdp('Page.navigate', { url: pathToFileURL(file).href });
    await browser.evaluate(ready);
    const clipped = await browser.evaluate(`[...document.querySelectorAll('.desktop,.mobile')].some(e=>e.scrollHeight>e.clientHeight || e.scrollWidth>e.clientWidth)`);
    if (clipped) throw Error(`${id}: artwork content clipped`);
    const { data } = await browser.cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const bytes = await sharp(Buffer.from(data, 'base64')).webp({ quality: 88, effort: 6 }).toBuffer();
    await writeFile(new URL(`../public/images/home-concepts/${id}.webp`, import.meta.url), bytes);
    console.log(`${id}.webp: 1600x1200; ${bytes.length} bytes`);
  }
} finally { await browser.close(); await rm(scratch, { recursive: true, force: true }); }

// Production compositions: node scripts/render-home-concepts.mjs [--concept shop|salon] [--download-only]
import { mkdir, readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import { composition } from './home-concepts/template.mjs';

const root = resolve(import.meta.dirname, '..');
const assets = join(root, 'public/images/home-concepts');
const inputs = join(root, 'scripts/home-concepts');
const selectionIndex = process.argv.indexOf('--concept');
const selected = selectionIndex < 0 ? null : process.argv[selectionIndex + 1];
if (selectionIndex >= 0 && !['salon', 'shop'].includes(selected)) throw new Error('--concept requires shop or salon');
const concepts = selected ? [selected] : ['salon', 'shop'];
await mkdir(assets, { recursive: true });
const sourceUrls = {
  salon: 'https://images.unsplash.com/photo-1637777277435-3c44f82fd0c9?w=1600&q=85&fit=max&fm=jpg',
  tech: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85&fit=max&fm=jpg',
};
const sources = Object.fromEntries(concepts.flatMap(name => name === 'salon' ? ['salon'] : ['tech'])
  .map(name => [name, sourceUrls[name]]));
for (const [name, url] of Object.entries(sources)) {
  const file = join(assets, `${name}-stock.webp`);
  if (!existsSync(file)) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download ${name}: ${response.status}`);
    await sharp(Buffer.from(await response.arrayBuffer())).rotate().webp({ quality: 85 }).toFile(file);
  }
}
if (process.argv.includes('--download-only')) process.exit(0);
const photos = Object.fromEntries(await Promise.all(Object.keys(sources).map(async name => [name,
  `data:image/webp;base64,${(await readFile(join(assets, `${name}-stock.webp`))).toString('base64')}`])));
for (const name of concepts) await writeFile(join(inputs, `${name}.html`), composition(name, photos));
const edge = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
if (!existsSync(edge)) throw new Error('Set EDGE_PATH to the installed Edge executable');
const profile = await mkdtemp(join(tmpdir(), 'home-concepts-edge-'));
console.log(`Temporary browser profile: ${profile}`);
const browser = spawn(edge, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
let socket;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  if (!port) throw new Error('Edge did not expose CDP within 10 seconds');
  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { socket.onopen = ok; socket.onerror = fail; });
  let next = 0;
  const pending = new Map();
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (pending.has(message.id)) {
      const { ok, fail, timer } = pending.get(message.id); clearTimeout(timer); pending.delete(message.id);
      message.error ? fail(new Error(JSON.stringify(message.error))) : ok(message.result);
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((ok, fail) => {
    const id = ++next;
    const timer = setTimeout(() => { pending.delete(id); fail(new Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { ok, fail, timer }); socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
  for (const name of concepts) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send('Page.navigate', { url: pathToFileURL(join(inputs, `${name}.html`)).href }, sessionId);
    await send('Runtime.evaluate', { expression: 'new Promise(r => { const check = () => document.readyState === "complete" ? Promise.all([...document.images].map(i => i.decode())).then(() => document.fonts.ready).then(() => r(true)) : setTimeout(check, 50); check(); })', awaitPromise: true }, sessionId);
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
    const bytes = await sharp(Buffer.from(result.data, 'base64')).webp({ quality: 88, effort: 6 }).toBuffer();
    await writeFile(join(assets, `${name}.webp`), bytes);
    console.log(`${name}.webp: 1600 × 1200, ${bytes.length} bytes`);
    await send('Target.closeTarget', { targetId });
  }
} finally { socket?.close(); browser.kill(); }

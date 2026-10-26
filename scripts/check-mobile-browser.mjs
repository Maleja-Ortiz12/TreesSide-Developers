import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Optional local public-UI check: every page fits a phone screen (no sideways scroll), using an installed Chromium/Edge.
const browserPath = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const ROUTES = ['/', '/servicios', '/proyectos', '/casos', '/casos/la-lupe', '/planes', '/nosotros', '/equipo', '/contacto', '/politica-de-datos'];
const WIDTHS = [360, 390];
const output = path.resolve('.git/mobile-browser');
await mkdir(output, { recursive: true });
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
  `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const deadline = setTimeout(() => { console.error('BROWSER_CHECK_TIMEOUT'); browser.kill(); process.exit(1); }, 180000);
let ws;
const failures = [];
try {
  const address = await new Promise((resolve, reject) => {
    let text = '';
    browser.stderr.on('data', data => {
      text += data;
      const found = text.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (found) resolve(found[1]);
    });
    browser.once('error', reject);
    browser.once('exit', code => reject(new Error(`Browser exited before DevTools was ready: ${code}`)));
  });
  ws = new WebSocket(address);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let sequence = 0;
  const pending = new Map(), events = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error))); else resolve(message.result);
    }
    const key = `${message.sessionId || ''}:${message.method}`;
    if (events.has(key)) { events.get(key)(message.params); events.delete(key); }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sessionId);
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  // Widest element that sticks out of the screen, ignoring ones inside an ancestor that already sticks out.
  const measure = `(() => {
    const vw = document.documentElement.clientWidth;
    // Fixed layers (background, header, floating button) never widen the page, so they are not culprits.
    const fixed = el => { for (let node = el; node && node !== document.body; node = node.parentElement) if (getComputedStyle(node).position === 'fixed') return true; return false; };
    const out = el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !fixed(el); };
    const culprits = [...document.querySelectorAll('body *')].filter(el => out(el) && !(el.parentElement && out(el.parentElement)))
      .slice(0, 3).map(el => el.tagName + '.' + String(el.className).slice(0, 50));
    return { viewport: innerWidth, client: vw, scroll: document.documentElement.scrollWidth, culprits };
  })()`;
  for (const width of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 2, mobile: true }, sessionId);
    for (const route of ROUTES) {
      const loaded = new Promise(resolve => events.set(`${sessionId}:Page.loadEventFired`, resolve));
      await send('Page.navigate', { url: `${base}${route}` }, sessionId);
      await loaded;
      await new Promise(resolve => setTimeout(resolve, 600));
      // Sideways scroll shows up before scroll reveals finish, so check at the top and again after scrolling through.
      const top = await evaluate(measure);
      await evaluate(`new Promise(resolve => { let y = 0; const step = () => { y += innerHeight; scrollTo(0, y); y < document.documentElement.scrollHeight ? setTimeout(step, 60) : setTimeout(resolve, 1200); }; step(); })`);
      const bottom = await evaluate(measure);
      console.log(`MOBILE_${width} ${route} ${JSON.stringify({ top, bottom })}`);
      for (const [phase, metrics] of [['top', top], ['bottom', bottom]]) {
        if (metrics.scroll > metrics.client) failures.push(`${width}px ${route} (${phase}): page is ${metrics.scroll}px wide, screen ${metrics.client}px; ${metrics.culprits.join(', ')}`);
      }
      if (route === '/') {
        const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
        await writeFile(path.join(output, `home-${width}.png`), Buffer.from(shot.data, 'base64'));
      }
    }
  }
  assert.deepEqual(failures, [], 'no page scrolls sideways on phones');
  console.log('MOBILE_BROWSER_CHECK_PASS');
  await send('Browser.close');
} finally {
  clearTimeout(deadline);
  ws?.close();
  browser.kill();
}

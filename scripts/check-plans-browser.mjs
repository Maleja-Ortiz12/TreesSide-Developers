import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Optional local public-UI check: uses an installed Chromium/Edge, not an extra package.
const browserPath = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const output = path.resolve('.git/plans-browser');
await mkdir(output, { recursive: true });
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
  `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const deadline = setTimeout(() => { console.error('BROWSER_CHECK_TIMEOUT'); browser.kill(); process.exit(1); }, 90000);
let ws;
try {
  const address = await new Promise((resolve, reject) => {
    let output = '';
    browser.stderr.on('data', data => {
      output += data;
      const found = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
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
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  for (const width of [390, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
    const loaded = new Promise(resolve => events.set(`${sessionId}:Page.loadEventFired`, resolve));
    await send('Page.navigate', { url: `${base}/planes` }, sessionId);
    await loaded;
    await evaluate(`document.fonts.ready.then(() => Promise.all(document.getAnimations().filter(a => Number.isFinite(a.effect.getComputedTiming().endTime)).map(a => a.finished.catch(() => {})))).then(() => true)`);
    const metrics = await evaluate(`(() => {
      const main = document.querySelector('main');
      const rect = el => { const r=el.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width}; };
      return {
        width: innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
        main: rect(main), desktop: getComputedStyle(document.querySelector('.desktop-nav')).display,
        menu: getComputedStyle(document.querySelector('.mobile-toggle')).display,
        overflowing: [...main.querySelectorAll('*')].filter(el => {const r=el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);}).slice(0,12).map(el=>({tag:el.tagName,class:el.className,...rect(el)})),
        plans: [...document.querySelectorAll('[data-plan]')].map(el=>el.dataset.plan),
      };
    })()`);
    console.log(`LAYOUT_${width} ${JSON.stringify(metrics)}`);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    await writeFile(path.join(output, `${width}.png`), Buffer.from(screenshot.data, 'base64'));
    assert.equal(metrics.width, width, 'real viewport width');
    assert.equal(metrics.overflowing.length, 0, 'plan content fits viewport');
    assert.deepEqual(metrics.plans, ['impulso-web', 'catalogo-administrable', 'vende-online', 'automatiza-tu-negocio']);
    if (width < 600) {
      assert.equal(metrics.desktop, 'none', 'desktop links hidden on mobile');
      assert.notEqual(metrics.menu, 'none', 'mobile menu toggle visible');
      assert.equal(await evaluate(`(() => {document.querySelector('.mobile-toggle').click(); return true;})()`), true);
      const mobileLinks = await evaluate(`new Promise(resolve => requestAnimationFrame(() => resolve([...document.querySelectorAll('header a')].filter(el=>getComputedStyle(el).display!=='none' && el.getBoundingClientRect().width>0).map(el=>el.getAttribute('href')))))`);
      assert.ok(mobileLinks.includes('/planes') && mobileLinks.includes('/contacto'), 'mobile drawer preserves navigation');
    }
  }
  console.log('BROWSER_CHECK_PASS');
  await send('Browser.close');
} finally {
  clearTimeout(deadline);
  ws?.close();
  browser.kill();
}

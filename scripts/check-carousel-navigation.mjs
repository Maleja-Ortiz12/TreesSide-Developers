import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Optional local public-UI check: a click or Enter on a home carousel card lands on that project's catalog card.
// Uses an installed Chromium/Edge, not an extra package. WIDTHS=390,1440 picks the viewports.
const browserPath = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const widths = (process.env.WIDTHS || '390,1440').split(',').map(Number);
const scenarios = (process.env.SCENARIOS || 'click,enter,direct').split(',');
const started = Date.now();
const output = path.resolve('.git/carousel-navigation');
await mkdir(output, { recursive: true });
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
  `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const deadline = setTimeout(() => { console.error('BROWSER_CHECK_TIMEOUT'); browser.kill(); process.exit(1); }, Number(process.env.CHECK_MS || 26000));
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
  const open = async url => {
    // A hash change on the same page fires no load event, so every visit starts from a blank page.
    const blank = new Promise(resolve => events.set(`${sessionId}:Page.loadEventFired`, resolve));
    await send('Page.navigate', { url: 'about:blank' }, sessionId);
    await blank;
    const loaded = new Promise(resolve => events.set(`${sessionId}:Page.loadEventFired`, resolve));
    await send('Page.navigate', { url }, sessionId);
    await loaded;
  };
  // Waits (bounded) until React has hydrated the carousel links, so the click goes through client navigation.
  const hydrated = () => evaluate(`new Promise((resolve, reject) => {
    const until = Date.now() + 8000;
    (function poll() {
      const link = document.querySelector('[data-carousel-item]');
      if (link && Object.keys(link).some(key => key.startsWith('__reactProps'))) return resolve(true);
      if (Date.now() > until) return reject(new Error('carousel not hydrated'));
      setTimeout(poll, 50);
    })();
  })`);
  // Waits (bounded) for the URL, the target card, and the smooth hash scroll to settle, then measures.
  const landing = id => evaluate(`new Promise((resolve, reject) => {
    const until = Date.now() + 8000;
    let last = null, still = 0;
    (function frame() {
      const card = document.getElementById(${JSON.stringify(id)});
      if (location.pathname === '/proyectos' && location.hash === '#${id}' && card) {
        // Settled means neither the page scroll nor the card's own position (layout, entry animation) still moves.
        const now = scrollY + ':' + Math.round(card.getBoundingClientRect().top);
        still = last === now ? still + 1 : 0;
        last = now;
      }
      if (still >= 20) {
        const rect = card.getBoundingClientRect();
        return resolve({
          url: location.pathname + location.hash, title: card.querySelector('h3')?.textContent,
          top: Math.round(rect.top), bottom: Math.round(rect.bottom), viewport: innerHeight,
          header: Math.round(document.querySelector('header').getBoundingClientRect().bottom),
          modal: [...document.querySelectorAll('div')].some(el => { const s = getComputedStyle(el); return s.position === 'fixed' && s.zIndex === '200'; }),
        });
      }
      if (Date.now() > until) return reject(new Error('no settled landing on #${id}: ' + location.href));
      requestAnimationFrame(frame);
    })();
  })`);
  // Carousel cards are plain anchors: following one must be a full document load (bounded wait), not a client route.
  const pageLoad = () => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('no full page load after following the card')), 8000);
    events.set(`${sessionId}:Page.loadEventFired`, () => { clearTimeout(timer); resolve(); });
  });
  const markHome = () => evaluate('(window.__fromHome = true)');
  const verify = async (label, width, id, title) => {
    const result = await landing(id);
    result.fullLoad = await evaluate('window.__fromHome !== true');
    console.log(`${label}_${width} ${JSON.stringify(result)} at ${Date.now() - started}ms`);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    await writeFile(path.join(output, `${label}-${width}.png`), Buffer.from(screenshot.data, 'base64'));
    assert.equal(result.url, `/proyectos#${id}`, `${label} url`);
    assert.equal(result.title, title, `${label} card title`);
    assert.ok(result.top >= result.header, `${label} card starts below the fixed header`);
    // scroll-margin-top is 100px, so the card lands just under the header, never far below or past it.
    assert.ok(result.top <= result.header + 40, `${label} card lands right under the header`);
    assert.equal(result.fullLoad, true, `${label} is a native document navigation`);
    assert.ok(result.top < result.viewport, `${label} card is in the viewport`);
    assert.equal(result.modal, false, `${label} opens no modal`);
  };
  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
    // Reduced motion keeps the strip still, so the clicked card does not move under the pointer.
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);

    // Mouse click on a card that used to open its case study.
    if (scenarios.includes('click')) {
    await open(`${base}/`);
    await hydrated();
    // Finds a fully clickable card for the title: the pointer must hit the card itself at its center.
    const locate = (titles, reach) => evaluate(`(() => {
      document.getElementById('carrusel').scrollIntoView({ block: 'center', behavior: 'instant' });
      const links = [...document.querySelectorAll('#carrusel [data-carousel-item]')];
      for (const title of ${JSON.stringify(titles)}) {
        const first = links.find(link => link.tabIndex !== -1 && link.querySelector('strong').textContent === title);
        // Brings a far card into view by scrolling its row sideways; the strip itself keeps its own offset.
        const row = first?.closest('[class*="viewport"]');
        if (${reach} && row) row.scrollLeft = first.offsetLeft - (row.clientWidth - first.offsetWidth) / 2;
        const shown = links.filter(link => link.querySelector('strong').textContent === title)
          .sort((a, b) => Number(a.tabIndex === -1) - Number(b.tabIndex === -1))
          .find(link => { const r = link.getBoundingClientRect(); return link.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)); });
        if (shown) { const r = shown.getBoundingClientRect(); return { title, href: shown.getAttribute('href'), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; }
      }
      return {};
    })()`);
    const aimed = await locate(['La Lupe', 'TengoYa'], true);
    assert.ok(aimed.href, 'a former case-study card can be reached');
    // Hovering pauses the strip (existing behavior); wait for its spring to settle before measuring again.
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: aimed.x, y: aimed.y }, sessionId);
    await evaluate('new Promise(resolve => setTimeout(() => resolve(true), 1200))');
    const target = await locate([aimed.title], false);
    assert.ok(target.href, `${aimed.title} card is clickable`);
    console.log(`CLICK_TARGET_${width} ${JSON.stringify(target)}`);
    await markHome();
    const clickLoad = pageLoad();
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
      await send('Input.dispatchMouseEvent', { type, x: target.x, y: target.y, button: 'left', clickCount: 1 }, sessionId);
    }
    await clickLoad;
    await verify('click', width, target.href.split('#')[1], target.title);
    }

    // Keyboard Enter on the real anchor of an ordinary project, right after the click (the sequence that once
    // landed past the card), with normal motion so the catalog entry animation runs. Focus pauses the strip.
    if (scenarios.includes('enter')) {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] }, sessionId);
    await open(`${base}/`);
    await hydrated();
    await evaluate(`(() => {
      const link = [...document.querySelectorAll('#carrusel [data-carousel-item]:not([tabindex="-1"])')].find(item => item.querySelector('strong').textContent === 'Ocho80');
      link.focus();
      return document.activeElement === link;
    })()`).then(focused => assert.ok(focused, 'Ocho80 card takes focus'));
    await markHome();
    const enterLoad = pageLoad();
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' }, sessionId);
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }, sessionId);
    await enterLoad;
    await verify('enter', width, 'equipo-ocho80', 'Ocho80');
    }

    // Direct load of a catalog hash.
    if (scenarios.includes('direct')) {
    await open(`${base}/proyectos#equipo-tengoya`);
    await verify('direct', width, 'equipo-tengoya', 'TengoYa');
    }
  }
  console.log('BROWSER_CHECK_PASS');
  await send('Browser.close');
} finally {
  clearTimeout(deadline);
  ws?.close();
  browser.kill();
}

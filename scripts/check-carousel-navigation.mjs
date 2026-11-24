import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Optional local public-UI check: a click or Enter on a /proyectos carousel card opens that project's modal in place
// (no document load, no scroll); Escape and Back close it, and direct `/proyectos#<id>` links open it.
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
const deadline = setTimeout(() => { console.error('BROWSER_CHECK_TIMEOUT'); browser.kill(); process.exit(1); }, Number(process.env.CHECK_MS || 45000));
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
  // Waits (bounded) until React has hydrated the carousel links, so the click reaches the in-place handler.
  const hydrated = () => evaluate(`new Promise((resolve, reject) => {
    const until = Date.now() + 8000;
    (function poll() {
      const link = document.querySelector('[data-carousel-item]');
      if (link && Object.keys(link).some(key => key.startsWith('__reactProps'))) return resolve(true);
      if (Date.now() > until) return reject(new Error('carousel not hydrated'));
      setTimeout(poll, 50);
    })();
  })`);
  // Waits (bounded) until a browser-side condition holds.
  const until = (condition, label) => evaluate(`new Promise((resolve, reject) => {
    const end = Date.now() + 8000;
    (function poll() {
      if (${condition}) return resolve(true);
      if (Date.now() > end) return reject(new Error(${JSON.stringify(label)} + ': ' + location.href));
      requestAnimationFrame(poll);
    })();
  })`);
  const dialogOpen = `!!document.querySelector('[role=dialog]')`;
  // Opening must stay in the same document: a full load would drop this marker.
  const markPage = () => evaluate('(window.__sameDocument = true)');
  const state = () => evaluate(`(() => {
    const dialog = document.querySelector('[role=dialog]');
    return {
      open: !!dialog, url: location.pathname + location.hash,
      title: dialog ? document.getElementById(dialog.getAttribute('aria-labelledby'))?.textContent ?? null : null,
      focused: !!dialog && dialog.contains(document.activeElement),
      sameDocument: window.__sameDocument === true, scrollY: Math.round(scrollY),
    };
  })()`);
  const capture = async (label, width) => {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    await writeFile(path.join(output, `${label}-${width}.png`), Buffer.from(screenshot.data, 'base64'));
  };
  // The project modal is open over /proyectos, named by the project title, with that project's URL fragment.
  const verifyOpen = async (label, width, id, title, scrollBefore) => {
    await until(dialogOpen, `${label}: no project dialog`);
    const result = await state();
    console.log(`${label}_${width} ${JSON.stringify(result)} at ${Date.now() - started}ms`);
    await capture(label, width);
    assert.equal(result.url, `/proyectos#${id}`, `${label} url`);
    assert.equal(result.title, title, `${label} dialog is named by the project title`);
    assert.equal(result.focused, true, `${label} focus moves into the dialog`);
    if (scrollBefore !== undefined) {
      assert.equal(result.sameDocument, true, `${label} opens in place, without a document load`);
      assert.ok(Math.abs(result.scrollY - scrollBefore) <= 1, `${label} page scroll stays at ${scrollBefore} (got ${result.scrollY})`);
    }
  };
  const verifyClosed = async (label, width, scrollBefore) => {
    await until(`!${dialogOpen}`, `${label}: dialog still open`);
    const result = await state();
    console.log(`${label}_${width} ${JSON.stringify(result)}`);
    assert.equal(result.url, '/proyectos', `${label} removes the project fragment`);
    assert.equal(result.sameDocument, true, `${label} stays in the same document`);
    if (scrollBefore !== undefined) assert.ok(Math.abs(result.scrollY - scrollBefore) <= 1, `${label} keeps the page scroll`);
  };
  const key = async (name, code, keyCode, text) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code, windowsVirtualKeyCode: keyCode, ...(text ? { text } : {}) }, sessionId);
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code, windowsVirtualKeyCode: keyCode }, sessionId);
  };
  for (const width of widths) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
    // Reduced motion keeps the strip still, so the clicked card does not move under the pointer.
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);

    // Mouse click on a carousel card opens its modal in place; Escape closes it and drops the fragment.
    if (scenarios.includes('click')) {
    await open(`${base}/proyectos`);
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
    const aimed = await locate(['La Lupe', 'Ocho80'], true);
    assert.ok(aimed.href, 'a published carousel card can be reached');
    // Hovering pauses the strip (existing behavior); wait for its spring to settle before measuring again.
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: aimed.x, y: aimed.y }, sessionId);
    await evaluate('new Promise(resolve => setTimeout(() => resolve(true), 1200))');
    const target = await locate([aimed.title], false);
    assert.ok(target.href, `${aimed.title} card is clickable`);
    console.log(`CLICK_TARGET_${width} ${JSON.stringify(target)}`);
    await markPage();
    const before = (await state()).scrollY;
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) {
      await send('Input.dispatchMouseEvent', { type, x: target.x, y: target.y, button: 'left', clickCount: 1 }, sessionId);
    }
    await verifyOpen('click', width, target.href.split('#')[1], target.title, before);
    await key('Escape', 'Escape', 27);
    await verifyClosed('click-escape', width, before);
    }

    // Keyboard Enter on the real anchor of an ordinary project, with normal motion; browser Back closes the modal.
    if (scenarios.includes('enter')) {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] }, sessionId);
    await open(`${base}/proyectos`);
    await hydrated();
    await evaluate(`(() => {
      const link = [...document.querySelectorAll('#carrusel [data-carousel-item]:not([tabindex="-1"])')].find(item => item.querySelector('strong').textContent === 'Ocho80');
      link.focus();
      return document.activeElement === link;
    })()`).then(focused => assert.ok(focused, 'Ocho80 card takes focus'));
    await markPage();
    const before = (await state()).scrollY;
    await key('Enter', 'Enter', 13, '\r');
    await verifyOpen('enter', width, 'equipo-ocho80', 'Ocho80', before);
    await evaluate('history.back()');
    await verifyClosed('enter-back', width);
    }

    // Direct load of a catalog fragment (Home and service links) opens that project's modal; unpublished ids do not.
    if (scenarios.includes('direct')) {
    await open(`${base}/proyectos#equipo-la-lupe`);
    await verifyOpen('direct', width, 'equipo-la-lupe', 'La Lupe');
    await open(`${base}/proyectos#equipo-tengoya`);
    await hydrated();
    await evaluate('new Promise(resolve => setTimeout(() => resolve(true), 800))');
    const unpublished = await state();
    console.log(`direct-unpublished_${width} ${JSON.stringify(unpublished)}`);
    assert.equal(unpublished.open, false, 'an unpublished project fragment opens no dialog');
    }
  }
  console.log('BROWSER_CHECK_PASS');
  await send('Browser.close');
} finally {
  clearTimeout(deadline);
  ws?.close();
  browser.kill();
}

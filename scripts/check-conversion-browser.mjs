import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Optional local public-UI check: uses an installed Chromium/Edge, not an extra package.
const browserPath = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const output = path.resolve('.git/conversion-browser');
await mkdir(output, { recursive: true });
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
  `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
const deadline = setTimeout(() => { console.error('BROWSER_CHECK_TIMEOUT'); browser.kill(); process.exit(1); }, 180000);
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

  await send('Network.enable', {}, sessionId);
  // Defense in depth: even an accidentally activated control cannot send a real enquiry.
  await send('Network.setBlockedURLs', { urls: ['*formspree.io*', '*wa.me*', '*api.whatsapp.com*'] }, sessionId);
  async function navigate(route) {
    const loaded = new Promise(resolve => events.set(`${sessionId}:Page.loadEventFired`, resolve));
    await send('Page.navigate', { url: `${base}${route}` }, sessionId); await loaded;
    await evaluate(`document.fonts.ready.then(() => true)`);
    await evaluate(`new Promise((resolve,reject) => { const end=Date.now()+10000; const id=setInterval(() => { if(document.querySelector('main h1')){clearInterval(id);resolve(true);} else if(Date.now()>end){clearInterval(id);reject(Error('missing h1'));}},50); })`);
  }
  for (const width of [390, 768, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
    for (const route of ['/', '/servicios', '/servicios/restaurantes', '/servicios/ecommerce', '/servicios/automatizacion', '/nosotros', '/equipo', '/proyectos', '/planes', '/contacto?plan=vende-online', '/casos/la-lupe']) {
      await navigate(route);
      const metrics = await evaluate(`(() => ({ width:innerWidth, client:document.documentElement.clientWidth, scroll:document.documentElement.scrollWidth,
        h1:document.querySelectorAll('main h1').length,
        overflow:[...document.querySelectorAll('main a, main button, main input, main select, main textarea')].filter(el=>{const r=el.getBoundingClientRect();return !el.closest('#carrusel a, [aria-hidden="true"]') && r.width>0 && el.getClientRects().length && (r.right>innerWidth+2 || r.left < -2);}).slice(0,8).map(el=>({tag:el.tagName,text:el.textContent.slice(0,60),left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})),
        broken:[...document.querySelectorAll('main img')].filter(el=>el.complete && !el.naturalWidth).map(el=>el.src),
        title:document.title,
      }))()`);
      console.log(`LAYOUT ${width} ${route} ${JSON.stringify(metrics)}`);
      assert.equal(metrics.scroll, metrics.client, `${width} ${route}: no page overflow`);
      assert.equal(metrics.h1, 1, `${width} ${route}: one primary heading`);
      assert.equal(metrics.overflow.length, 0, `${width} ${route}: visible controls fit`);
      assert.equal(metrics.broken.length, 0, `${width} ${route}: images loaded`);
      assert.match(metrics.title, /TreesSide Developers/);
      if (['/', '/nosotros', '/planes'].includes(route)) {
        // Full-page screenshots do not scroll: explicitly decode lazy images for honest visual evidence.
        await evaluate(`Promise.all([...document.querySelectorAll('main img')].map(img => { img.loading='eager'; return img.decode().catch(()=>{}); })).then(()=>true)`);
        const shot = await send('Page.captureScreenshot', { format:'png', captureBeyondViewport:true }, sessionId);
        await writeFile(path.join(output, `${width}-${route === '/' ? 'home' : route.slice(1)}.png`), Buffer.from(shot.data,'base64'));
      }
      if (route.startsWith('/contacto')) {
        const form = await evaluate(`new Promise((resolve,reject)=>{const end=Date.now()+10000;const id=setInterval(()=>{const copy=document.querySelector('main').textContent;if(copy.includes('Plan: Vende Online')){clearInterval(id); const form=document.querySelector('form'); const box=form.querySelector('[type=checkbox]'); resolve({context:true,valid:form.checkValidity(),checked:box.checked, options:[...form.querySelector('select').options].map(o=>o.textContent),notice:copy.includes('Esta selección no implica una contratación.')});}else if(Date.now()>end){clearInterval(id);reject(Error('context missing'));}},50);})`);
        assert.equal(form.context,true); assert.equal(form.valid,false); assert.equal(form.checked,false); assert.equal(form.options.length,6); assert.equal(form.notice,true);
        const invalid = await evaluate(`(() => {const email=document.getElementById('contact-email');email.value='invalid-address';return email.checkValidity();})()`);
        assert.equal(invalid,false,'invalid email rejected without submitting');
      }
      if (route === '/') {
        // S10: the Home no longer renders the interactive demos section.
        const demos = await evaluate(`({section:!!document.getElementById('demos'),tabs:document.querySelectorAll('[data-demo-tab],[data-demo]').length,label:document.querySelector('main').textContent.includes('Demo interactiva')})`);
        assert.deepEqual(demos,{section:false,tabs:0,label:false});
      }
      if (route === '/planes') {
        const selected = await evaluate(`[...document.querySelectorAll('[data-plan-preview]')].map(card=>({id:card.dataset.planPreview,href:card.querySelector('a[href^="/contacto?"]').getAttribute('href')}))`);
        assert.equal(selected.length,4); for(const plan of selected)assert.equal(plan.href,`/contacto?plan=${plan.id}`);
      }
      if (route === '/proyectos') {
        await evaluate(`document.querySelector('.card-action').focus(); document.querySelector('.card-action').click()`);
        const modal = await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>{const dialog=document.querySelector('[role=dialog]');const r=dialog?.getBoundingClientRect();resolve({open:!!dialog,focused:dialog?.contains(document.activeElement),named:!!document.getElementById(dialog?.getAttribute('aria-labelledby')),inViewport:!!r&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth});})))`);
        assert.deepEqual(modal,{open:true,focused:true,named:true,inViewport:true});
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'},sessionId);
        await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape'},sessionId);
        assert.equal(await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(!document.querySelector('[role=dialog]')))))`),true);
      }
    }
  }
  console.log('CONVERSION_BROWSER_PASS: navigation, responsive, plan context, validation, no Home demos and dialog; zero real enquiries');
} finally { clearTimeout(deadline); ws?.close(); browser.kill(); }

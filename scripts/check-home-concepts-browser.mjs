// Run ONLY after parent confirms a fresh preview. Does not start a server or submit/click enquiries.
// TEST_BASE_URL=http://127.0.0.1:PORT node scripts/check-home-concepts-browser.mjs
// Screenshots and measurements remain in the printed OS-temp evidence directory.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = new URL(process.env.TEST_BASE_URL || 'about:blank');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname) && base.protocol === 'http:', 'Set TEST_BASE_URL to the fresh parent-owned local HTTP preview');
const executable = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const scratch = await mkdtemp(path.join(tmpdir(), 'home-concepts-check-'));
const profile = path.join(scratch, 'browser-profile');
await mkdir(profile);
console.log(`EVIDENCE_DIR ${scratch}`);
const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let ws;
const failures = [], measurements = [], blocked = [], safetyErrors = [];
const canceledRequests = new Set();
let checks = 0;
const check = (name, passed) => {
  checks++;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  if (!passed) failures.push(name);
};
const watchdog = setTimeout(() => { console.error('Browser check exceeded 120 seconds'); process.exitCode = 1; browser.kill(); ws?.close(); }, 120000);
try {
  const address = await new Promise((resolve, reject) => {
    let stderr = '';
    browser.stderr.on('data', data => {
      stderr += data;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) resolve(match[1]);
    });
    browser.once('error', reject);
    browser.once('exit', code => reject(Error(`Browser exited before CDP readiness: ${code}`)));
  });
  ws = new WebSocket(address);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timer });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  ws.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    if (message.method === 'Network.loadingFailed' && message.params.canceled) {
      canceledRequests.add(message.params.requestId);
      return;
    }
    if (message.method === 'Fetch.requestPaused') {
      const { request, requestId, networkId } = message.params;
      const safe = new URL(request.url).origin === base.origin && ['GET', 'HEAD'].includes(request.method);
      if (!safe) blocked.push({ url: request.url, method: request.method });
      send(safe ? 'Fetch.continueRequest' : 'Fetch.failRequest', safe ? { requestId } : { requestId, errorReason: 'BlockedByClient' }, message.sessionId).catch(error => safetyErrors.push({ error: error.message, url: request.url, networkId, safe }));
      return;
    }
    const task = pending.get(message.id);
    if (!task) return;
    clearTimeout(task.timer); pending.delete(message.id);
    if (message.error) task.reject(Error(JSON.stringify(message.error))); else task.resolve(message.result);
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params = {}) => send(method, params, sessionId);
  const evaluate = async expression => {
    const value = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (value.exceptionDetails) throw Error(JSON.stringify(value.exceptionDetails));
    return value.result.value;
  };
  await cdp('Page.enable');
  await cdp('Network.enable');
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('submit', event => event.preventDefault(), true);` });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const screenshot = async name => {
    // Viewport capture avoids Edge's blank extended/full-page screenshot issue.
    const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: true });
    const file = path.join(scratch, `${name}.png`);
    await writeFile(file, Buffer.from(data, 'base64'));
    console.log(`SCREENSHOT ${file}`);
  };
  const settle = `new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`;
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1000]]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await cdp('Page.navigate', { url: new URL('/', base).href });
    await evaluate(`new Promise((resolve,reject)=>{const end=performance.now()+15000;function tick(){if(document.readyState==='complete' && document.querySelectorAll('[data-home-concept]').length===2)resolve(true);else if(performance.now()>end)reject(Error('Concept showcase load timeout'));else setTimeout(tick,50);}tick();})`);
    await evaluate(`document.fonts.ready.then(()=>true)`);
    const real = await evaluate(`(()=>{const card=document.querySelector('[data-project-card="equipo-la-lupe"]');return card && {
      title:card.querySelector('h3')?.textContent, description:card.querySelector('p')?.textContent,
      caption:card.querySelector('figcaption')?.textContent,
      image:card.querySelector('img')?.getAttribute('src'), alt:card.querySelector('img')?.alt,
      features:[...card.querySelectorAll('li')].map(el=>el.textContent),
      actions:[...card.querySelectorAll('a')].map(el=>[el.textContent.trim(),el.getAttribute('href')])};})()`);
    check(`${width} La Lupe image/copy/features/actions unchanged`, !!real && real.title === 'La Lupe'
      && real.description === 'La Lupe es un restaurante mexicano. Su web acerca la identidad del restaurante y su cocina a quienes quieren conocerlo.'
      && real.caption === 'Captura real de la web de La Lupe'
      && decodeURIComponent(real.image).includes('/images/projects/la-lupe.webp')
      && real.alt === 'Web real de La Lupe, restaurante mexicano: presentación y platos destacados'
      && JSON.stringify(real.features) === JSON.stringify(['Presentación del restaurante', 'Menú', 'Platos destacados', 'Contacto por WhatsApp'])
      && JSON.stringify(real.actions) === JSON.stringify([['Ver proyectos', '/proyectos'], ['Quiero una web para mi negocio', '/contacto?servicio=restaurantes']]));
    await evaluate(`scrollTo({top:scrollY+document.querySelector('#propuestas').getBoundingClientRect().top-90,behavior:'instant'});${settle}`);
    await screenshot(`concepts-${width}-section`);
    for (const [id, action, service] of [['salon', 'Quiero algo similar', 'sitios-web'], ['shop', 'Quiero una tienda virtual', 'marketplaces']]) {
      const m = await evaluate(`(async()=>{
        const card=document.querySelector('[data-home-concept="${id}"]'),img=card.querySelector('img');
        // Decode before positioning, then use one explicit instant scroll. Numeric scrollBy
        // inherits global smooth scrolling and previously sampled a moving viewport.
        await img.decode();
        const original=new Image();original.src='/images/home-concepts/${id}.webp';await original.decode();
        scrollTo({top:scrollY+card.getBoundingClientRect().top-90,behavior:'instant'});
        await ${settle};
        const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,left:r.left,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
        const label=card.querySelector('figcaption'),link=card.querySelector('a'),style=getComputedStyle(img),labelStyle=getComputedStyle(label);
        return {id:'${id}',width:innerWidth,height:innerHeight,card:rect(card),image:rect(img),figure:rect(img.parentElement),label:rect(label),
          original:[original.naturalWidth,original.naturalHeight],natural:[img.naturalWidth,img.naturalHeight],decoded:img.complete,
          labelText:label.textContent,labelDisplay:labelStyle.display,labelVisibility:labelStyle.visibility,labelOpacity:labelStyle.opacity,
          imageFit:style.objectFit,objectPosition:style.objectPosition,action:link.textContent.trim(),href:link.getAttribute('href'),
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      })()`);
      measurements.push(m);
      const within = (inner, outer) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
      check(`${width} ${id} decoded original 1600x1200 and displayed image 4:3`, m.decoded && m.natural[0] > 0 && m.natural[1] > 0 && m.original[0] === 1600 && m.original[1] === 1200 && Math.abs(m.image.width / m.image.height - 4 / 3) < .01);
      check(`${width} ${id} card/image bounds without crop or horizontal overflow`, m.overflow === 0 && m.card.left >= 0 && m.card.right <= width + 1 && within(m.image, m.figure) && within(m.figure, m.card) && m.image.top >= 76 && m.image.bottom <= height);
      check(`${width} ${id} conceptual label visible with fictional disclosure`, m.labelText.includes('Diseño conceptual') && m.labelText.includes('Propuesta ficticia') && m.labelDisplay !== 'none' && m.labelVisibility === 'visible' && Number(m.labelOpacity) > 0 && m.label.top >= 76 && m.label.bottom <= height && m.label.left >= 0 && m.label.right <= width);
      check(`${width} ${id} CTA text and service destination`, m.action === action && m.href === `/servicios/${service}`);
      await screenshot(`concepts-${width}-${id}-composition`);
    }
  }
  // Hydration/srcset changes can cancel a paused request before CDP continues it.
  // Accept only same-origin read requests independently confirmed canceled by Network;
  // every unsafe or uncorrelated interception error still fails the original safety check.
  const confirmedCancellations = safetyErrors.filter(item => item.safe && item.error.includes('Invalid InterceptionId') && canceledRequests.has(item.networkId));
  const unhandledSafetyErrors = safetyErrors.filter(item => !confirmedCancellations.includes(item));
  check('request interception completed without errors', unhandledSafetyErrors.length === 0);
  console.log(`CANCELED_INTERCEPTIONS ${JSON.stringify(confirmedCancellations)}`);
  await writeFile(path.join(scratch, 'measurements.json'), JSON.stringify({ measurements, blocked, safetyErrors, confirmedCancellations, unhandledSafetyErrors, failures }, null, 2));
  console.log(`HOME_CONCEPTS_BROWSER ${checks - failures.length}/${checks} checks passed; no clicks/submits; ${blocked.length} unsafe/external requests blocked`);
  if (failures.length) process.exitCode = 1;
  await send('Target.closeTarget', { targetId });
} finally {
  clearTimeout(watchdog);
  ws?.close();
  const exited = new Promise(resolve => { if (browser.exitCode !== null || browser.signalCode !== null) resolve(); else browser.once('exit', resolve); });
  browser.kill();
  await exited;
  console.log(`SCRATCH_REMAINS ${scratch} (screenshots, measurements and isolated browser profile; parent-owned cleanup)`);
}

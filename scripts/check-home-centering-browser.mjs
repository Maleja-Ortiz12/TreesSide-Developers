// Read-only CDP geometry check against a parent-owned fresh preview. No server or enquiries.
// TEST_BASE_URL=http://127.0.0.1:PORT node scripts/check-home-centering-browser.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const base = process.env.TEST_BASE_URL;
assert.ok(base, 'Set TEST_BASE_URL to the fresh parent-owned preview, not an old snapshot');
const executable = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const scratch = await mkdtemp(path.join(tmpdir(), 'home-centering-'));
const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run',
  '--remote-debugging-port=0', `--user-data-dir=${scratch}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let ws;
const timeout = setTimeout(() => { browser.kill(); process.exitCode = 1; }, 90000);
const failures = [];
let checks = 0;
function check(name, passed) {
  checks++;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  if (!passed) failures.push(name);
}
try {
  const address = await new Promise((resolve, reject) => {
    let stderr = '';
    browser.stderr.on('data', data => {
      stderr += data;
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) resolve(match[1]);
    });
    browser.once('error', reject);
    browser.once('exit', code => reject(Error(`Browser exited before ready: ${code}`)));
  });
  ws = new WebSocket(address);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let sequence = 0;
  const pending = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(String(event.data)), task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error) task.reject(Error(JSON.stringify(message.error))); else task.resolve(message.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params = {}) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  await cdp('Page.enable');
  await cdp('Network.enable');
  await cdp('Network.setBlockedURLs', { urls: ['*formspree.io*', '*wa.me*', '*api.whatsapp.com*'] });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 900], [1440, 768], [1440, 600]]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await cdp('Page.navigate', { url: new URL('/', base).href });
    await evaluate(`new Promise((resolve,reject)=>{const end=performance.now()+15000;function tick(){if(document.readyState==='complete' && document.querySelector('#home-title'))resolve(true);else if(performance.now()>end)reject(Error('Home load timeout'));else requestAnimationFrame(tick);}tick();})`);
    await evaluate(`document.fonts.ready.then(()=>Promise.all([...document.querySelectorAll('#inicio img')].map(img=>img.decode()))).then(()=>true)`);
    await evaluate(`Promise.all([...document.querySelectorAll('[data-reveal="first"]')].flatMap(el=>el.getAnimations()).map(a=>a.finished.catch(()=>{}))).then(()=>true)`);
    const m = await evaluate(`(()=>{
      scrollTo({top:0,left:0,behavior:'instant'});
      const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height};};
      const hero=document.querySelector('#inicio'),grid=hero.firstElementChild,copy=document.querySelector('#home-title').parentElement;
      return {hero:rect(hero),grid:rect(grid),copy:rect(copy),title:rect(document.querySelector('#home-title')),
        actions:rect(copy.querySelector('a').parentElement),cards:[...hero.querySelectorAll('figure')].map(rect),
        controls:rect(hero.querySelector('button[aria-label="Siguiente composición"]').parentElement),
        signature:rect(grid.lastElementChild),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
        padding:Number.parseFloat(getComputedStyle(hero).paddingTop),rail:Number.parseFloat(getComputedStyle(document.body).paddingLeft)};
    })()`);
    console.log(`MEASURE ${width}x${height} ${JSON.stringify(m)}`);
    check(`${width}x${height} no horizontal overflow`, m.overflow === 0);
    check(`${width}x${height} header accounted once`, Math.abs(m.hero.top - 76) <= 1);
    check(`${width}x${height} title visible early`, m.title.top >= 76 && m.title.bottom < height);
    check(`${width}x${height} all three cards retained and inside hero`, m.cards.length === 3 && m.cards.every(r => r.top >= m.hero.top && r.bottom <= m.signature.top && r.left >= 0 && r.right <= width));
    check(`${width}x${height} cards clear controls and controls clear signature`, m.cards.every(r => r.bottom <= m.controls.top) && m.controls.bottom <= m.signature.top);
    if (width > 1060) {
      check(`${width}x${height} rail accounted once`, m.rail === 116 && m.grid.left >= 116);
      if (height >= 768) {
        check(`${width}x${height} full composition fits`, m.hero.bottom <= height + 1);
        check(`${width}x${height} complete grid vertically balanced`, Math.abs((m.grid.top - 76) - (height - m.grid.bottom)) <= 2);
        check(`${width}x${height} actions in first viewport`, m.actions.bottom <= height);
      }
    } else {
      check(`${width}x${height} no large top gap`, m.copy.top - 76 <= 48);
      check(`${width}x${height} actions visible early`, m.actions.bottom <= height);
      check(`${width}x${height} cards scroll naturally`, m.hero.bottom > height);
    }
  }
  console.log(`HOME_CENTERING_BROWSER ${checks - failures.length}/${checks} checks passed; zero real enquiries`);
  if (failures.length) process.exitCode = 1;
} finally {
  clearTimeout(timeout);
  ws?.close();
  const exited = new Promise(resolve => { if (browser.exitCode !== null) resolve(); else browser.once('exit', resolve); });
  browser.kill();
  await exited;
  try { await rm(scratch, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
  catch { console.error(`SCRATCH_REMAINS ${scratch}`); process.exitCode = 1; }
}

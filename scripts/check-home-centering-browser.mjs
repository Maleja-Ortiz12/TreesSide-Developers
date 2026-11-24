// Read-only CDP geometry check against a parent-owned fresh preview. No server or enquiries.
// TEST_BASE_URL=http://127.0.0.1:PORT node scripts/check-home-centering-browser.mjs
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Conservative transformed bounding-box intersections: even overlapping rotated
// corners count as occlusion, independent of off-viewport painting. S9 cascade: the
// right card intentionally sits over the large card's lower-right corner, so only
// figures painted above (higher z-index, or later in DOM at equal z) count as covering.
function occlusionProbe() {
  const figures = [...document.querySelectorAll('#hero-collage figure')];
  const z = figures.map(f => Number.parseInt(getComputedStyle(f).zIndex, 10) || 0);
  const intersection = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
    * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return figures.map((figure, index) => {
    const image = figure.querySelector('img').getBoundingClientRect();
    const caption = figure.querySelector('figcaption').getBoundingClientRect();
    const others = figures.filter((f, j) => j !== index && (z[j] > z[index] || (z[j] === z[index] && j > index)))
      .map(f => f.getBoundingClientRect());
    const area = image.width * image.height;
    return { index, imageUncovered: area > 0 ? Math.max(0, 1 - others.reduce((sum, r) => sum + intersection(image, r), 0) / area) : 0,
      captionUncovered: caption.width > 0 && caption.height > 0 && others.every(r => intersection(caption, r) === 0) };
  });
}
const base = process.env.TEST_BASE_URL;
assert.ok(base, 'Set TEST_BASE_URL to the fresh parent-owned preview, not an old snapshot');
const executable = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const scratch = await mkdtemp(path.join(tmpdir(), 'home-centering-'));
const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run',
  '--remote-debugging-port=0', `--user-data-dir=${scratch}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
let ws;
const timeout = setTimeout(() => { browser.kill(); process.exitCode = 1; }, 180000);
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
  // S8/S9 common laptop/desktop viewports: 1366x768, 1536x864 and 1920x1080 must fit.
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 900], [1440, 768], [1440, 600], [1366, 768], [1536, 864], [1920, 1080]]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await cdp('Page.navigate', { url: new URL('/', base).href });
    await evaluate(`new Promise((resolve,reject)=>{const end=performance.now()+15000;function tick(){if(document.readyState==='complete' && document.querySelector('#home-title'))resolve(true);else if(performance.now()>end)reject(Error('Home load timeout'));else requestAnimationFrame(tick);}tick();})`);
    await evaluate(`document.fonts.ready.then(()=>Promise.all([...document.querySelectorAll('#inicio img')].map(img=>img.decode()))).then(()=>true)`);
    await evaluate(`Promise.all([...document.querySelectorAll('[data-reveal="first"]')].flatMap(el=>el.getAnimations()).map(a=>a.finished.catch(()=>{}))).then(()=>true)`);
    await evaluate(`document.querySelector('button[aria-controls="hero-collage"]').click()`);
    const firstFrame = await evaluate(`document.querySelector('#hero-collage').dataset.frame`);
    let wrapped = false;
    // S7 promotion cycle: one frame per eligible project plus four concepts.
    for (let step = 0; step < 40; step++) {
      await evaluate(`Promise.all([...document.querySelectorAll('#hero-collage img')].map(img=>img.decode())).then(()=>true)`);
      const index = await evaluate(`document.querySelector('#hero-collage').dataset.frame`);
      const coverage = await evaluate(`(${occlusionProbe.toString()})()`);
      console.log(`OCCLUSION ${width}x${height} frame ${index} ${JSON.stringify(coverage)}`);
      check(`${width}x${height} frame ${index} primary >=80%, others >=70%, captions uncovered`,
        coverage.length === 3 && coverage.every((c, i) => c.imageUncovered >= (i === 0 ? .8 : .7) && c.captionUncovered));
      if (width > 600) {
        // S9 reference cascade (desktop and tablet): large card on top, next item
        // right-middle over its lower-right corner, following item below-left.
        const compact = await evaluate(`(()=>{
          const rect=r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});
          const figures=[...document.querySelectorAll('#hero-collage figure')].map(f=>rect(f.getBoundingClientRect()));
          const hero=document.querySelector('#inicio').getBoundingClientRect();
          const scene=document.querySelector('#hero-collage').parentElement.getBoundingClientRect();
          return {height:hero.height,heroTop:hero.top,heroBottom:hero.bottom,client:document.documentElement.clientWidth,figures,
            imageWidths:[...document.querySelectorAll('#hero-collage figure img')].map(img=>img.getBoundingClientRect().width),
            sceneTop:scene.top,sceneBottom:scene.bottom};
        })()`);
        console.log(`COMPACT ${width}x${height} frame ${index} ${JSON.stringify(compact)}`);
        const [large, right, belowLeft] = compact.figures;
        check(`${width}x${height} frame ${index} right card starts right of the large card's centre, inside its lower half`,
          right.left > (large.left + large.right) / 2 && right.top >= large.top + large.height / 2 && right.top < large.bottom);
        check(`${width}x${height} frame ${index} below-left card starts at or below 90% of the large card`,
          belowLeft.top >= large.top + large.height * .9 && belowLeft.left < right.left);
        check(`${width}x${height} frame ${index} cascade inside hero and viewport bounds`,
          compact.figures.every(r => r.left >= 0 && r.right <= compact.client && r.top >= compact.heroTop && r.bottom <= compact.heroBottom));
        if (width > 1060) {
          check(`${width}x${height} frame ${index} desktop hero <=1100px`, compact.height <= 1100);
          check(`${width}x${height} frame ${index} primary is the widest card and at least 340px wide`,
            compact.imageWidths[0] >= 340 && compact.imageWidths.slice(1).every(w => w < compact.imageWidths[0]));
        }
      }
      await evaluate(`document.querySelector('button[aria-label="Siguiente composición"]').click()`);
      await evaluate(`new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`);
      if (await evaluate(`document.querySelector('#hero-collage').dataset.frame`) === firstFrame) { wrapped = true; break; }
    }
    check(`${width}x${height} all frames checked`, wrapped);
    const m = await evaluate(`(()=>{
      scrollTo({top:0,left:0,behavior:'instant'});
      const rect=el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,height:r.height};};
      const hero=document.querySelector('#inicio'),grid=hero.firstElementChild,copy=document.querySelector('#home-title').parentElement;
      return {hero:rect(hero),grid:rect(grid),copy:rect(copy),scene:rect(document.querySelector('#hero-collage').parentElement),title:rect(document.querySelector('#home-title')),
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
      check(`${width}x${height} actions in first viewport`, m.actions.bottom <= height);
      // S8/S9: copy and collage scene (incl. controls) read as centred in the first view.
      const centreGap = Math.abs((m.copy.top + m.copy.bottom) / 2 - (m.scene.top + m.scene.bottom) / 2);
      console.log(`S8_FIT ${width}x${height} copy/scene centre gap ${centreGap}; scene ${m.scene.top}…${m.scene.bottom}; overflow ${Math.max(0, m.scene.bottom - height)}; signature bottom ${m.signature.bottom}`);
      if ((width === 1366 && height === 768) || (width === 1536 && height === 864) || (width === 1920 && height === 1080)) {
        check(`${width}x${height} copy centred against the collage scene within 40px`, centreGap <= 40);
        check(`${width}x${height} collage scene incl. controls inside first viewport`, m.scene.top >= 76 && m.scene.bottom <= height);
      }
      if (height >= 768) {
        // S3 supersedes strict all-controls-fit: preserve the enlarged image,
        // report the tradeoff explicitly, and require balanced natural flow.
        console.log(`VIEWPORT_FIT ${width}x${height} ${m.hero.bottom <= height + 1}; hero bottom ${m.hero.bottom}`);
        check(`${width}x${height} complete grid balanced within natural hero`, Math.abs((m.grid.top - m.hero.top) - (m.hero.bottom - m.grid.bottom)) <= 2);
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

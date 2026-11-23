import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Standalone CDP check: installed Edge, no packages, build or real enquiries.
// All browser state/evidence lives outside the repository. Keep screenshots for visual review.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3117';
const executable = process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const output = await mkdtemp(path.join(tmpdir(), 'home-motion-browser-'));
console.log(`ARTIFACTS ${output}`);
const browser = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${path.join(output, 'profile')}`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const deadline = setTimeout(() => { console.error('HOME_MOTION_TIMEOUT'); browser.kill(); process.exit(1); }, 180000);
let ws;
const failures = [];
let checks = 0;
function check(name, actual, expected) {
  checks++;
  try { assert.deepEqual(actual, expected); console.log(`PASS ${name} ${JSON.stringify(actual)}`); }
  catch { failures.push({ name, actual, expected }); console.error(`FAIL ${name} ${JSON.stringify({ actual, expected })}`); }
}
try {
  const address = await new Promise((resolve, reject) => {
    let stderr = '';
    browser.stderr.on('data', data => { stderr += data; const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) resolve(match[1]); });
    browser.once('error', reject);
    browser.once('exit', code => reject(Error(`Browser exited before ready: ${code}`)));
  });
  ws = new WebSocket(address);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let sequence = 0;
  const pending = new Map(), events = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(String(event.data));
    const eventKey = `${message.sessionId || ''}:${message.method}`;
    if (events.has(eventKey)) { events.get(eventKey)(message.params); events.delete(eventKey); }
    if (!pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id); pending.delete(message.id);
    if (message.error) reject(Error(JSON.stringify(message.error))); else resolve(message.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params = {}) => send(method, params, sessionId);
  await cdp('Page.enable'); await cdp('Network.enable');
  await cdp('Network.setBlockedURLs', { urls: ['*formspree.io*', '*wa.me*', '*api.whatsapp.com*'] });
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  // Bounded condition polling, not fixed sleeps for hydration/navigation.
  const wait = predicate => evaluate(`new Promise((resolve,reject)=>{const end=performance.now()+10000;function tick(){if(${predicate})resolve(true);else if(performance.now()>end)reject(Error('Condition timed out: '+${JSON.stringify(predicate)}));else requestAnimationFrame(tick);}tick();})`);
  async function navigate(route) {
    // Subscribe before navigation: pathname/readyState alone can briefly describe the old document.
    const loaded = new Promise(resolve => events.set(`${sessionId}:Page.loadEventFired`, resolve));
    await cdp('Page.navigate', { url: new URL(route, base).href });
    await loaded;
    await wait(`location.pathname===${JSON.stringify(route)} && document.readyState==='complete' && !!document.querySelector('main h1')`);
    await evaluate('document.fonts.ready.then(()=>true)');
    // Let the existing finite page entrance finish before measuring/capturing its children.
    await evaluate(`Promise.all([...document.querySelectorAll('[data-reveal="first"]')].flatMap(el=>el.getAnimations()).map(a=>a.finished.catch(()=>{}))).then(()=>true)`);
  }
  const frames = `new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))`;
  async function layout(width, route) {
    const metrics = await evaluate(`({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('main h1').length})`);
    console.log(`LAYOUT ${width} ${route} ${JSON.stringify(metrics)}`);
    check(`${width} ${route} no overflow`, metrics.scroll, metrics.client);
    check(`${width} ${route} one h1`, metrics.h1, 1);
  }
  for (const width of [390, 768, 1440]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await navigate('/');
    await wait(`document.querySelectorAll('#hero-collage figure').length===3 && document.querySelector('#hero-collage figure').getAnimations().length>0`);
    await evaluate(`Promise.all([...document.querySelectorAll('#inicio img')].map(img=>img.decode())).then(()=>true)`);
    await layout(width, '/');
    const scene = await evaluate(`(()=>{const c=document.querySelector('#hero-collage'),tree=c.querySelector('img[aria-hidden="true"]'),figures=[...c.querySelectorAll('figure')];return {perspective:getComputedStyle(c).perspective,relative:getComputedStyle(c).position,treeInside:!!tree,treeZ:Number(getComputedStyle(tree).zIndex),treeOpacity:Number(getComputedStyle(tree).opacity),figures:figures.map(f=>({z:Number(getComputedStyle(f).zIndex),delay:getComputedStyle(f).animationDelay,transform:getComputedStyle(f).transform})),carousel:!!document.querySelector('#carrusel')};})()`);
    console.log(`SCENE ${width} ${JSON.stringify(scene)}`);
    check(`${width} tree behind all figures`, scene.treeInside && scene.figures.every(f => f.z > scene.treeZ) && scene.treeOpacity >= .7 && scene.relative === 'relative', true);
    check(`${width} perspective`, scene.perspective, '1200px');
    check(`${width} intended stagger delays`, scene.figures.map(f => f.delay), ['-2s', '-6s', '-10s']);
    check(`${width} intended figure stacking`, scene.figures.map(f => f.z), [1, 2, 3]);
    check(`${width} 3D transforms`, scene.figures.every(f => f.transform.startsWith('matrix3d(')), true);
    check(`${width} carousel absent Home`, scene.carousel, false);
    check(`${width} cards stay inside hero bounds`, await evaluate(`(()=>{const hero=document.querySelector('#inicio').getBoundingClientRect();return [...document.querySelectorAll('#hero-collage figure')].every(f=>{const r=f.getBoundingClientRect();return r.left>=0 && r.right<=document.documentElement.clientWidth && r.top>=hero.top && r.bottom<=hero.bottom;});})()`), true);
    const movement = await evaluate(`(async()=>{const figures=[...document.querySelectorAll('#hero-collage figure')];const animations=figures.map(f=>f.getAnimations()[0]);animations.forEach(a=>a.currentTime=1000);await ${frames};const before=figures.map(f=>getComputedStyle(f).transform);animations.forEach(a=>a.currentTime=1200);await ${frames};return figures.map((f,i)=>getComputedStyle(f).transform!==before[i]);})()`);
    check(`${width} all cards move over 200ms seek`, movement, [true, true, true]);
    await evaluate(`document.querySelector('button[aria-controls="hero-collage"]').click()`);
    await wait(`document.querySelector('#hero-collage').dataset.motion==='paused'`);
    const paused = await evaluate(`(async()=>{const a=document.querySelector('#hero-collage').getAnimations({subtree:true});await Promise.all(a.map(x=>x.ready));const before=a.map(x=>x.currentTime);await ${frames};return {states:a.map(x=>x.playState),stable:a.every((x,i)=>x.currentTime===before[i]),pressed:document.querySelector('button[aria-controls="hero-collage"]').getAttribute('aria-pressed')};})()`);
    check(`${width} pause freezes every animation`, paused, { states: ['paused', 'paused', 'paused'], stable: true, pressed: 'true' });
    const visibilityProbe = `(()=>{const title=document.querySelector('#home-title'),r=title.getBoundingClientRect();const ancestors=[];for(let el=title;el;el=el.parentElement){const s=getComputedStyle(el);ancestors.push({tag:el.tagName,class:el.className,opacity:s.opacity,visibility:s.visibility,display:s.display,transform:s.transform});}return {scrollX,scrollY,title:{left:r.left,top:r.top,width:r.width,height:r.height},ancestors};})()`;
    console.log(`CAPTURE_BEFORE ${width} ${JSON.stringify(await evaluate(visibilityProbe))}`);
    // Off-viewport composited content is not guaranteed to be painted by captureBeyondViewport.
    // Put the actual hero in view, never force its CSS opacity/transform or weaken the checks.
    await evaluate(`window.scrollTo({left:0,top:0,behavior:'instant'})`);
    await evaluate(frames);
    const visible = await evaluate(visibilityProbe);
    console.log(`CAPTURE_VISIBLE ${width} ${JSON.stringify(visible)}`);
    check(`${width} main visible before capture`, visible.ancestors.every(a=>Number(a.opacity)>=.99 && a.visibility==='visible' && a.display!=='none') && visible.title.top>=0 && visible.title.top+visible.title.height<=1000 && visible.scrollY===0, true);
    const heroRect = await evaluate(`(()=>{const r=document.querySelector('#inicio').getBoundingClientRect();return {x:0,y:scrollY+r.top,width:innerWidth,height:r.height,scale:1};})()`);
    // Edge differential: beyond-viewport capture loses the desktop composited main layer,
    // with both default GPU and --disable-gpu; viewport capture preserves it in both modes.
    // Desktop's entire collage/control fits the viewport; retain full-hero captures on mobile/tablet.
    const viewportCapture = width > 1060;
    if (viewportCapture) check(`${width} viewport capture includes every card and motion control`, await evaluate(`(()=>{const elements=[...document.querySelectorAll('#hero-collage figure'),document.querySelector('button[aria-controls="hero-collage"]')];return elements.every(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight;});})()`), true);
    const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: !viewportCapture, ...(!viewportCapture ? { clip: heroRect } : {}) });
    await writeFile(path.join(output, `${width}-home-hero.png`), Buffer.from(shot.data, 'base64'));
    // Verify the screenshot itself, not just the DOM: the title region must contain bright text.
    const titleCrop = { x: Math.floor(visible.title.left - heroRect.x), y: Math.floor(visible.title.top + visible.scrollY - heroRect.y), width: Math.ceil(visible.title.width), height: Math.ceil(visible.title.height) };
    const brightTitlePixels = await evaluate(`new Promise((resolve,reject)=>{const img=new Image();img.onerror=()=>reject(Error('Screenshot decode failed'));img.onload=()=>{const crop=${JSON.stringify(titleCrop)},canvas=document.createElement('canvas');canvas.width=crop.width;canvas.height=crop.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,crop.x,crop.y,crop.width,crop.height,0,0,crop.width,crop.height);const data=ctx.getImageData(0,0,crop.width,crop.height).data;let bright=0;for(let i=0;i<data.length;i+=4)if(data[i]>60 && data[i+1]>190 && data[i+2]>90)bright++;resolve(bright);};img.src='data:image/png;base64,'+${JSON.stringify(shot.data)};})`);
    console.log(`CAPTURE_TITLE_PIXELS ${width} ${brightTitlePixels}`);
    check(`${width} screenshot actually contains visible title`, brightTitlePixels > 100, true);
    await evaluate(`document.querySelector('button[aria-controls="hero-collage"]').click()`);
    await wait(`document.querySelector('#hero-collage').dataset.motion==='running'`);
    check(`${width} resume running`, await evaluate(`document.querySelector('#hero-collage').getAnimations({subtree:true}).every(a=>a.playState==='running')`), true);
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await evaluate(frames);
    check(`${width} reduced-motion disables all hero animation`, await evaluate(`[...document.querySelectorAll('#hero-collage figure')].map(f=>getComputedStyle(f).animationName)`), ['none', 'none', 'none']);
    check(`${width} reduced-motion hides redundant control`, await evaluate(`getComputedStyle(document.querySelector('button[aria-controls="hero-collage"]')).display`), 'none');
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    check(`${width} work CTA destination`, await evaluate(`[...document.querySelectorAll('#inicio a')].find(a=>a.textContent.trim()==='Ver nuestro trabajo').getAttribute('href')`), '/proyectos');
    await evaluate(`[...document.querySelectorAll('#inicio a')].find(a=>a.textContent.trim()==='Ver nuestro trabajo').click()`);
    await wait(`location.pathname==='/proyectos' && !!document.querySelector('#carrusel')`);
    check(`${width} actual CTA navigation`, await evaluate('location.pathname'), '/proyectos');
    await layout(width, '/proyectos');
    check(`${width} catalog before strip`, await evaluate(`!!(document.querySelector('#proyectos').compareDocumentPosition(document.querySelector('#carrusel')) & Node.DOCUMENT_POSITION_FOLLOWING)`), true);
    await evaluate(`document.querySelector('#carrusel').scrollIntoView();document.querySelector('#carrusel button').click()`);
    await wait(`document.querySelector('#carrusel button').getAttribute('aria-pressed')==='true'`);
    check(`${width} strip pause control`, await evaluate(`document.querySelector('#carrusel button').textContent.trim()`), 'Reanudar carrusel');
    // Wait for the existing spring to settle by observing transform stability across frames.
    check(`${width} paused strip settles`, await evaluate(`new Promise(resolve=>{let previous='',stable=0,count=0;function tick(){const now=[...document.querySelectorAll('#carrusel [style]')].map(el=>el.style.transform).join('|');stable=now===previous?stable+1:0;previous=now;if(stable>=5)resolve(true);else if(++count>180)resolve(false);else requestAnimationFrame(tick);}tick();})`), true);
    await evaluate(`document.querySelector('#carrusel button').click()`);
    await wait(`document.querySelector('#carrusel button').getAttribute('aria-pressed')==='false'`);
    check(`${width} strip resume control`, await evaluate(`document.querySelector('#carrusel button').textContent.trim()`), 'Pausar carrusel');
    const href = await evaluate(`document.querySelector('#carrusel a[data-carousel-item]:not([aria-hidden="true"])').getAttribute('href')`);
    await evaluate(`document.querySelector('#carrusel a[data-carousel-item]:not([aria-hidden="true"])').click()`);
    await wait(`location.pathname+location.hash===${JSON.stringify(href)} && !!document.getElementById(location.hash.slice(1))`);
    check(`${width} actual strip catalog anchor`, await evaluate(`({destination:location.pathname+location.hash,unique:document.querySelectorAll('[id="'+location.hash.slice(1)+'"]').length})`), { destination: href, unique: 1 });
    await layout(width, '/proyectos#catalog-card');
  }
  console.log(`HOME_MOTION_BROWSER ${checks - failures.length}/${checks} checks passed; zero real enquiries`);
  if (failures.length) { console.error(`FAILURES ${JSON.stringify(failures)}`); process.exitCode = 1; }
} finally { clearTimeout(deadline); ws?.close(); browser.kill(); }

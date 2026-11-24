import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Conservative rotated bounding boxes deliberately count corner overlap too.
// S8: the small cards intentionally sit over the primary's bottom, so only
// figures painted above (higher z-index, or later in DOM at equal z) cover.
// No viewport hit-testing of scrolled-off cards.
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
// Read the same source catalog as the server, independently of rendered frame contents.
function loadCatalog(file) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { module, exports: module.exports, require: name => {
    assert.equal(name, './team');
    return loadCatalog('src/data/team.ts');
  } });
  return module.exports;
}
const expectedProjects = Array.from(loadCatalog('src/data/content.ts').FEATURED_PROJECTS)
  .filter(p => !p.experience && p.image !== '/images/treesside-logo.jpg' && p.id !== 'equipo-uptownhair');
// Discover the rendered domain through public manual controls. Portfolio
// batching does not count appended conceptual frames (such as administration).
async function walkPublicFrames({ readIndex, next, visit }, maxFrames = 32) {
  const first = await readIndex();
  const seen = new Set();
  let index = first;
  for (let step = 0; step < maxFrames; step++) {
    assert.ok(!seen.has(index), `Public composition repeated before wrapping: ${index}`);
    seen.add(index);
    await visit(index);
    await next(index);
    index = await readIndex();
    if (index === first) return seen.size;
  }
  throw Error(`Public composition cycle did not wrap within ${maxFrames} frames`);
}

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
    const frameBefore = await evaluate(`document.querySelector('#hero-collage').dataset.frame`);
    await wait(`document.querySelector('#hero-collage').dataset.frame!==${JSON.stringify(frameBefore)}`);
    check(`${width} artwork advances automatically`, await evaluate(`document.querySelector('#hero-collage').dataset.frame!==${JSON.stringify(frameBefore)}`), true);
    check(`${width} every rotating card has truthful visible label`, await evaluate(`(()=>{const c=document.querySelector('#hero-collage'),labels=[...c.querySelectorAll('figcaption')];return labels.length===3 && labels.every(el=>{const r=el.getBoundingClientRect();return r.width>0 && r.height>0 && (el.textContent.includes('Diseño conceptual') || el.textContent.includes('Portafolio del equipo'));});})()`), true);
    const scene = await evaluate(`(()=>{const c=document.querySelector('#hero-collage'),tree=c.querySelector('img[aria-hidden="true"]'),figures=[...c.querySelectorAll('figure')];return {perspective:getComputedStyle(c).perspective,relative:getComputedStyle(c).position,treeInside:!!tree,treeZ:Number(getComputedStyle(tree).zIndex),treeOpacity:Number(getComputedStyle(tree).opacity),figures:figures.map(f=>({z:Number(getComputedStyle(f).zIndex),delay:getComputedStyle(f).animationDelay,transform:getComputedStyle(f).transform})),carousel:!!document.querySelector('#carrusel')};})()`);
    console.log(`SCENE ${width} ${JSON.stringify(scene)}`);
    check(`${width} tree behind all figures`, scene.treeInside && scene.figures.every(f => f.z > scene.treeZ) && scene.treeOpacity >= .7 && scene.relative === 'relative', true);
    check(`${width} perspective`, scene.perspective, '1200px');
    // DOM order is large (captureFrame), left small (shopFrame), right small (salonFrame).
    check(`${width} intended stagger delays`, scene.figures.map(f => f.delay), ['-2s', '-10s', '-6s']);
    check(`${width} intended figure stacking`, scene.figures.map(f => f.z), [1, 3, 2]);
    check(`${width} 3D transforms`, scene.figures.every(f => f.transform.startsWith('matrix3d(')), true);
    check(`${width} carousel absent Home`, scene.carousel, false);
    check(`${width} cards stay inside hero bounds`, await evaluate(`(()=>{const hero=document.querySelector('#inicio').getBoundingClientRect();return [...document.querySelectorAll('#hero-collage figure')].every(f=>{const r=f.getBoundingClientRect();return r.left>=0 && r.right<=document.documentElement.clientWidth && r.top>=hero.top && r.bottom<=hero.bottom;});})()`), true);
    const movement = await evaluate(`(async()=>{const figures=[...document.querySelectorAll('#hero-collage figure')];const animations=figures.map(f=>f.getAnimations()[0]);animations.forEach(a=>a.currentTime=1000);await ${frames};const before=figures.map(f=>getComputedStyle(f).transform);animations.forEach(a=>a.currentTime=1200);await ${frames};return figures.map((f,i)=>getComputedStyle(f).transform!==before[i]);})()`);
    check(`${width} all cards move over 200ms seek`, movement, [true, true, true]);
    await evaluate(`document.querySelector('button[aria-controls="hero-collage"]').click()`);
    await wait(`document.querySelector('#hero-collage').dataset.motion==='paused'`);
    const paused = await evaluate(`(async()=>{const a=document.querySelector('#hero-collage').getAnimations({subtree:true});await Promise.all(a.map(x=>x.ready));const before=a.map(x=>x.currentTime);await ${frames};return {states:a.map(x=>x.playState),stable:a.every((x,i)=>x.currentTime===before[i]),pressed:document.querySelector('button[aria-controls="hero-collage"]').getAttribute('aria-pressed')};})()`);
    check(`${width} pause freezes every animation`, paused, { states: ['paused', 'paused', 'paused'], stable: true, pressed: 'true' });
    const pausedFrame = await evaluate(`document.querySelector('#hero-collage').dataset.frame`);
    await evaluate(`new Promise(resolve=>setTimeout(resolve,6200))`);
    check(`${width} pause freezes content beyond one cadence`, await evaluate(`document.querySelector('#hero-collage').dataset.frame`), pausedFrame);
    await evaluate(`document.querySelector('button[aria-label="Siguiente composición"]').click()`);
    await wait(`document.querySelector('#hero-collage').dataset.frame!==${JSON.stringify(pausedFrame)}`);
    await evaluate(`document.querySelector('button[aria-label="Composición anterior"]').click()`);
    await wait(`document.querySelector('#hero-collage').dataset.frame===${JSON.stringify(pausedFrame)}`);
    check(`${width} manual access preserves pause`, await evaluate(`document.querySelector('#hero-collage').dataset.motion`), 'paused');
    // Exhaust the cycle while paused via public controls, not six-second sleeps per frame.
    // S7: count only the large-slot item per frame; each visited frame's large card
    // must be the previous visited frame's left small card (wrapping at the end).
    const seen = [], adminSeen = [], largeSeen = [];
    const cardKey = card => card.id || new URL(card.src, base).searchParams.get('url') || new URL(card.src, base).pathname;
    let firstLarge = null, previousLeft = null, previousIndex = null;
    const cycleLength = await walkPublicFrames({
      readIndex: () => evaluate(`document.querySelector('#hero-collage').dataset.frame`),
      next: async previous => {
        await evaluate(`document.querySelector('button[aria-label="Siguiente composición"]').click()`);
        await wait(`document.querySelector('#hero-collage').dataset.frame!==${JSON.stringify(previous)}`);
      },
      visit: async frame => {
      const index = Number(frame);
      await evaluate(`Promise.all([...document.querySelectorAll('#hero-collage img')].map(img=>img.decode())).then(()=>true)`);
      // Seek the real staggered timeline, including 0/half-cycle and each
      // card's local extrema (negative delays are -2s/-6s/-10s). Do not
      // synchronize the cards: mixed up/down positions can overlap more.
      // Public pause is retained; restore times after measuring every frame.
      const savedTimes = await evaluate(`[...document.querySelectorAll('#hero-collage figure')].map(f=>f.getAnimations()[0].currentTime)`);
      for (const phase of [0, 2000, 4000, 6000, 8000, 10000]) {
        await evaluate(`[...document.querySelectorAll('#hero-collage figure')].forEach(f=>{f.getAnimations()[0].currentTime=${phase};})`);
        await evaluate(frames);
        const coverage = await evaluate(`(${occlusionProbe.toString()})()`);
        console.log(`OCCLUSION ${width} frame ${index} phase ${phase} ${JSON.stringify(coverage)}`);
        check(`${width} frame ${index} phase ${phase} primary >=80%, others >=70%, captions uncovered`,
          coverage.length===3 && coverage.every((c,i)=>c.imageUncovered >= (i===0 ? .8 : .7) && c.captionUncovered), true);
        check(`${width} frame ${index} phase ${phase} bounds and controls`, await evaluate(`(()=>{
          const hero=document.querySelector('#inicio').getBoundingClientRect(),controls=document.querySelector('button[aria-label="Siguiente composición"]').parentElement.getBoundingClientRect();
          return [...document.querySelectorAll('#hero-collage figure')].every(f=>{const r=f.getBoundingClientRect();return r.left>=0 && r.right<=document.documentElement.clientWidth && r.top>=hero.top && r.bottom<=hero.bottom && r.bottom<=controls.top;});
        })()`), true);
      }
      await evaluate(`[...document.querySelectorAll('#hero-collage figure')].forEach((f,i)=>f.getAnimations()[0].currentTime=${JSON.stringify(savedTimes)}[i])`);
      await evaluate(frames);
      const cards = await evaluate(`([...document.querySelectorAll('#hero-collage figure')].map(f=>{const img=f.querySelector('img'),label=f.querySelector('figcaption');return {id:img?.dataset.homeProject || null,src:img?.getAttribute('src'),alt:img?.alt,text:label.textContent,visible:label.getBoundingClientRect().height>0,loaded:!img || (img.complete && img.naturalWidth>0),fit:img && getComputedStyle(img).objectFit};}))`);
      check(`${width} frame ${index} three loaded visible labelled cards`, cards.length===3 && cards.every(c=>c.visible && c.loaded), true);
      const large = cardKey(cards[0]);
      largeSeen.push(large);
      if (previousLeft === null) firstLarge = large;
      else check(`${width} frame ${index} promotes frame ${previousIndex} left small card`, large, previousLeft);
      previousLeft = cardKey(cards[1]); previousIndex = index;
      // Job21 checked text/geometry only: mint-on-mint badges still passed all 394 checks.
      // Use computed colors after the cascade, not authored CSS tokens or screenshot presence.
      const contrast = await evaluate(`(()=>{
        const rgb = color => {
          if (!/^rgba?[(]/.test(color)) return null;
          const values = color.match(/[0-9.]+/g)?.map(Number);
          // Badges currently use opaque sRGB. Fail closed on unsupported/transparent colors.
          return values && (values.length===3 || (values.length===4 && values[3]===1))
            && values.slice(0,3).every(v=>Number.isFinite(v) && v>=0 && v<=255) ? values.slice(0,3) : null;
        };
        const luminance = channels => channels.map(v=>{const s=v/255;return s<=0.04045?s/12.92:((s+0.055)/1.055)**2.4;})
          .reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0);
        return [...document.querySelectorAll('#hero-collage figcaption span')]
          .filter(el=>el.textContent.includes('Diseño conceptual')).map(el=>{
            const style=getComputedStyle(el),fg=rgb(style.color),bg=rgb(style.backgroundColor);
            const a=fg && luminance(fg),b=bg && luminance(bg);
            return {text:el.textContent,color:style.color,background:style.backgroundColor,
              ratio:fg && bg ? (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05) : null};
          });
      })()`);
      console.log(`CONCEPT_CONTRAST ${width} frame ${index} ${JSON.stringify(contrast)}`);
      const expectedBadges = cards.filter(card=>card.text.includes('Diseño conceptual')).length;
      check(`${width} frame ${index} every conceptual badge contrast >=4.5:1`,
        contrast.length===expectedBadges && contrast.every(label=>Number.isFinite(label.ratio) && label.ratio>=4.5), true);
      if (cards[0].id) check(`${width} frame ${index} ordinary primary portfolio span stays mint`, await evaluate(`(()=>{
        const span=[...document.querySelector('#hero-collage figure').querySelectorAll('figcaption span')]
          .find(el=>el.textContent==='Portafolio del equipo');
        return !!span && getComputedStyle(span).color==='rgb(155, 255, 206)';
      })()`), true);
      for (const card of cards) {
        if (!card.id) {
          check(`${width} frame ${index} generic concept never claims portfolio delivery`,
            card.text.includes('Diseño conceptual') && !card.text.includes('Portafolio del equipo') && !card.alt.includes('Captura real'), true);
          const imagePath = new URL(card.src, base);
          const asset = imagePath.searchParams.get('url') || imagePath.pathname;
          if (['/images/home-concepts/salon-admin.webp', '/images/home-concepts/restaurant-admin.webp'].includes(asset)) {
            if (card === cards[0]) adminSeen.push(asset);
            const title = asset.includes('salon-admin') ? 'ALBA · Administración de empleados' : 'BRASA · Pedidos, caja, cocina y equipo';
            check(`${width} frame ${index} admin artwork is a sample-data proposal, not La Lupe delivery`, {
              title:card.text.includes(title), sample:card.text.includes('Datos de ejemplo'),
              alt:card.alt.includes('Propuesta ficticia:') && card.alt.includes('Datos de ejemplo, no corresponde a La Lupe.'),
              fit:card.fit,
            }, {title:true,sample:true,alt:true,fit:'contain'});
          }
          continue;
        }
        if (card === cards[0]) seen.push(card.id);
        const project = expectedProjects.find(p=>p.id===card.id);
        check(`${width} frame ${index} eligible ${card.id}`, !!project, true);
        if (!project) continue;
        const imagePath = new URL(card.src, base);
        check(`${width} ${card.id} title/image/label/fit`, {
          title:card.text.includes(project.title),image:imagePath.searchParams.get('url') || imagePath.pathname,
          portfolio:card.text.includes('Portafolio del equipo'),fit:card.fit,
          provenance:!project.imageLabel || (card.text.includes(project.imageLabel) && card.text.includes('Diseño conceptual') && !card.alt.includes('Captura real')),
          neutral:!card.text.includes('Web real'),
        }, {title:true,image:project.image,portfolio:true,fit:project.imageFit || 'cover',provenance:true,neutral:true});
      }
      await layout(width, `/ frame ${index}`);
      check(`${width} frame ${index} cards inside hero`, await evaluate(`(()=>{const h=document.querySelector('#inicio').getBoundingClientRect();return [...document.querySelectorAll('#hero-collage figure')].every(f=>{const r=f.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=h.top && r.bottom<=h.bottom;});})()`), true);
      const rect = await evaluate(`(()=>{const r=document.querySelector('#inicio').getBoundingClientRect();return {x:0,y:scrollY+r.top,width:innerWidth,height:r.height,scale:1};})()`);
      const shot = await cdp('Page.captureScreenshot', {format:'png',captureBeyondViewport:width<=1060,...(width<=1060?{clip:rect}:{})});
      await writeFile(path.join(output, `${width}-home-frame-${index}.png`), Buffer.from(shot.data,'base64'));
      },
    });
    console.log(`PUBLIC_FRAME_COUNT ${width} ${cycleLength}`);
    check(`${width} first frame promotes the last frame's left small card`, firstLarge, previousLeft);
    check(`${width} every item is large exactly once per cycle`, new Set(largeSeen).size === cycleLength && largeSeen.length === cycleLength, true);
    check(`${width} both administrative concepts exactly once`, adminSeen.sort(),
      ['/images/home-concepts/restaurant-admin.webp', '/images/home-concepts/salon-admin.webp']);
    check(`${width} every eligible project exactly once`, seen.sort(), expectedProjects.map(p=>p.id).sort());
    check(`${width} full cycle wraps and stays paused`, await evaluate(`({frame:document.querySelector('#hero-collage').dataset.frame,motion:document.querySelector('#hero-collage').dataset.motion})`), {frame:pausedFrame,motion:'paused'});
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
    // S3 now prioritizes unobscured enlarged artwork over first-viewport fit.
    // Keep the viewport title-pixel proof (Edge compositing limitation above),
    // plus full-hero evidence when natural flow extends below the viewport.
    const viewportCapture = width > 1060;
    console.log(`VIEWPORT_FIT ${width} ${await evaluate(`(()=>{const elements=[...document.querySelectorAll('#hero-collage figure'),document.querySelector('button[aria-controls="hero-collage"]')];return elements.every(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight;});})()`)}`);
    if (viewportCapture && heroRect.height > 1000) {
      const full = await cdp('Page.captureScreenshot', { format:'png', captureBeyondViewport:true, clip:heroRect });
      await writeFile(path.join(output, `${width}-home-hero-full.png`), Buffer.from(full.data,'base64'));
    }
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
    const reducedFrame = await evaluate(`document.querySelector('#hero-collage').dataset.frame`);
    await evaluate(`new Promise(resolve=>setTimeout(resolve,6200))`);
    check(`${width} reduced-motion freezes content`, await evaluate(`document.querySelector('#hero-collage').dataset.frame`), reducedFrame);
    check(`${width} reduced-motion hides redundant control`, await evaluate(`getComputedStyle(document.querySelector('button[aria-controls="hero-collage"]')).display`), 'none');
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    check(`${width} work CTA destination`, await evaluate(`[...document.querySelectorAll('#inicio a')].find(a=>a.textContent.trim()==='Ver nuestro trabajo').getAttribute('href')`), '/proyectos');
    await evaluate(`[...document.querySelectorAll('#inicio a')].find(a=>a.textContent.trim()==='Ver nuestro trabajo').click()`);
    await wait(`location.pathname==='/proyectos' && !!document.querySelector('#carrusel')`);
    check(`${width} actual CTA navigation`, await evaluate('location.pathname'), '/proyectos');
    await layout(width, '/proyectos');
    check(`${width} strip before catalog`, await evaluate(`!!(document.querySelector('#carrusel').compareDocumentPosition(document.querySelector('#proyectos')) & Node.DOCUMENT_POSITION_FOLLOWING)`), true);
    check(`${width} strip clears fixed header`, await evaluate(`document.querySelector('#carrusel').getBoundingClientRect().top>=76`), true);
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

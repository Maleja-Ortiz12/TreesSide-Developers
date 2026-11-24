// Parent only, AFTER fresh preview: TEST_BASE_URL=http://127.0.0.1:PORT node scripts/check-home-admin-browser.mjs
// Read-only DOM/screenshots; no clicks, submissions, server startup or external requests.
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openBrowser } from './admin-concepts/browser.mjs';
const base = new URL(process.env.TEST_BASE_URL || 'about:blank');
assert.ok(base.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'Set TEST_BASE_URL to the fresh parent preview');
const scratch = await mkdtemp(join(tmpdir(), 'home-admin-check-'));
console.log(`EVIDENCE_DIR ${scratch}`);
const browser = await openBrowser({ safeOrigin: base.origin });
const measurements = [], failures = [];
let checks = 0;
const check = (name, pass) => { checks++; console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); if (!pass) failures.push(name); };
const watchdog = setTimeout(() => { console.error('Browser check timed out'); process.exitCode = 1; browser.close(); }, 120000);
try {
  const { cdp, evaluate } = browser;
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('submit',e=>e.preventDefault(),true)` });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const [width, height] of [[390, 844], [768, 1024], [1440, 1100]]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await cdp('Page.navigate', { url: base.href });
    await evaluate(`new Promise((ok,fail)=>{const end=Date.now()+15000;const poll=()=>document.readyState==='complete'&&document.querySelectorAll('[data-home-admin-concept]').length===2?document.fonts.ready.then(()=>ok(true)):Date.now()>end?fail(Error('Admin concepts readiness timed out')):setTimeout(poll,50);poll()})`);
    check(`${width} two separate admin concepts after original concepts`, await evaluate(`(()=>{const s=document.querySelector('#propuestas');return s?.querySelectorAll('[data-home-admin-concept]').length===2 && !!s.querySelector('[data-home-concept="salon"]') && !!s.querySelector('[data-home-concept="shop"]') && !!(s.querySelector('[data-home-concept="shop"]').compareDocumentPosition(s.querySelector('[data-home-admin-concept]'))&Node.DOCUMENT_POSITION_FOLLOWING)})()`));
    check(`${width} La Lupe confirmed features only`, await evaluate(`JSON.stringify([...document.querySelectorAll('[data-project-card="equipo-la-lupe"] li')].map(e=>e.textContent))===JSON.stringify(['Presentación del restaurante','Menú','Platos destacados','Contacto por WhatsApp'])`));
    check(`${width} explicit non-client disclosure`, await evaluate(`document.querySelector('#propuestas').textContent.includes('No son funcionalidades entregadas a La Lupe')`));
    for (const [id, service] of [['salon-admin', 'sistemas-de-gestion'], ['restaurant-admin', 'restaurantes']]) {
      const m = await evaluate(`(async()=>{
        const card=document.querySelector('[data-home-admin-concept="${id}"]'), img=card.querySelector('img'), label=card.querySelector('figcaption');
        card.scrollIntoView({behavior:'instant',block:'start'});
        await img.decode();const original=new Image();original.src='/images/home-concepts/${id}.webp';await original.decode();
        scrollTo({top:scrollY+card.getBoundingClientRect().top-90,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
        const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
        const style=getComputedStyle(label),link=card.querySelector('a');
        return {id:'${id}',width:innerWidth,image:rect(img),figure:rect(img.parentElement),card:rect(card),label:rect(label),labelText:label.textContent,labelVisible:style.display!=='none'&&style.visibility==='visible'&&Number(style.opacity)>0,fit:getComputedStyle(img).objectFit,original:[original.naturalWidth,original.naturalHeight],href:link.getAttribute('href'),alt:img.alt,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      })()`);
      measurements.push(m);
      check(`${width} ${id} decoded original, contain, 4:3`, m.original[0] === 1600 && m.original[1] === 1200 && m.fit === 'contain' && Math.abs(m.image.width / m.image.height - 4 / 3) < .01);
      check(`${width} ${id} no horizontal overflow or artwork clipping`, m.overflow === 0 && m.card.left >= 0 && m.card.right <= width + 1 && m.image.left >= m.figure.left && m.image.right <= m.figure.right && m.image.bottom <= m.figure.bottom);
      check(`${width} ${id} persistent visible sample label`, m.labelVisible && m.labelText === 'Diseño conceptual · Datos de ejemplo' && m.label.top >= 76 && m.label.bottom <= height);
      check(`${width} ${id} service destination and descriptive alt`, m.href === `/servicios/${service}` && m.alt.includes('Datos de ejemplo'));
      const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(join(scratch, `${id}-${width}.png`), Buffer.from(data, 'base64'));
    }
  }
  check('request interception error-free', browser.unhandledInterceptionErrors().length === 0);
} finally {
  clearTimeout(watchdog); await browser.close();
  await writeFile(join(scratch, 'measurements.json'), JSON.stringify({ measurements, failures, blocked: browser.blocked, interceptionErrors: browser.interceptionErrors, unhandledInterceptionErrors: browser.unhandledInterceptionErrors() }, null, 2));
  console.log(`HOME_ADMIN_BROWSER ${checks - failures.length}/${checks}; SCRATCH_REMAINS ${scratch}`);
}
if (failures.length) process.exitCode = 1;

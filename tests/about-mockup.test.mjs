import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page() { const response=await fetch(`${base}/nosotros`);assert.equal(response.status,200);return response.text(); }
const text=html=>html.replace(/<!-- -->/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

test('S20 Nosotros has the leafy mockup hero, team link and real counts',async()=>{
  const html=await page();
  assert.equal(text(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0]||''),'Somos las raíces detrás de tu próxima gran idea.');
  assert.ok(html.includes('/images/mockup/about-branch.webp'));
  assert.match(html,/<a[^>]*href="\/equipo"[^>]*>[\s\S]*?Conocer al equipo/);
  const stats=text(html.match(/<ul[^>]*data-about-stats[\s\S]*?<\/ul>/)?.[0]||'');
  for(const value of ['31 proyectos','46 tecnologías','4 desarrolladores'])assert.ok(stats.includes(value),value);
});

test('S20 shows three approach cards while preserving original purpose and all member passions',async()=>{
  const html=await page();
  for(const heading of ['Entender antes de construir','Crear con propósito','Crecer contigo'])assert.ok(text(html).includes(heading));
  const details=html.match(/<details[^>]*data-about-purpose[\s\S]*?<\/details>/)?.[0]||'';
  assert.ok(details.includes('id="sobre-nosotros"'));
  assert.ok(details.includes('id="lo-que-nos-apasiona"'));
  for(const phrase of ['Software al alcance de todos','Automatizar lo repetitivo','Innovar con propósito','Para empresas de todo tamaño','Queremos llegar a mercados extranjeros'])assert.ok(text(details).includes(phrase),phrase);
  for(const name of ['Ronaldo Delgado Correa','Jorge Luis Puentes Brochero','María Alejandra Ortiz Páez','Jorge Luis Ramírez Trochez'])assert.ok(text(details).includes(name),name);
});

test('S20 connected process retains original steps and ends with capabilities and one integrated footer',async()=>{
  const html=await page();
  const process=html.match(/<section id="proceso"[\s\S]*?<\/section>/)?.[0]||'';
  assert.deepEqual([...process.matchAll(/<h3\b[^>]*>([^<]*)<\/h3>/g)].map(([,title])=>title),['Descubrimos','Diseñamos','Construimos','Lanzamos']);
  for(const original of ['Analizamos','Entendemos tus necesidades.','Planificamos la mejor solución.','Desarrollamos','Construimos con metodologías ágiles.','Entregamos','Soporte y mejora continua.'])assert.ok(text(process).includes(original),original);
  const capabilities=html.match(/<nav[^>]*aria-label="Nuestras capacidades"[\s\S]*?<\/nav>/)?.[0]||'';
  for(const label of ['Web','Datos','Cloud','Apps'])assert.ok(text(capabilities).includes(label));
  const footers=[...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(([footer])=>footer);
  assert.equal(footers.length,1);
  for(const copy of ['Lo que sigue,','Hablemos','Política de datos'])assert.ok(footers[0].includes(copy));
  assert.ok(!footers[0].includes('site-footer'));
});

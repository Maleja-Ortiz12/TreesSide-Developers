import test from 'node:test';
import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
async function page(){const response=await fetch(`${base}/equipo`);assert.equal(response.status,200);return response.text();}
const text=html=>html.replace(/<!-- -->/g,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();

test('S21 team uses the supplied central tree and mockup heading',async()=>{
  const html=await page();
  assert.equal(text(html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0]||''),'Distintas mentes. Un mismo propósito.');
  assert.ok(html.includes('data-team-stage'));
  assert.match(html,/<img[^>]*data-team-tree[^>]*src="\/images\/mockup\/team-tree.webp"|<img[^>]*src="\/images\/mockup\/team-tree.webp"[^>]*data-team-tree/);
  assert.match(html,/<a[^>]*href="\/proyectos"[^>]*>[\s\S]*?Ver proyectos/);
});

test('S21 four overview cards show each real photo and short summary, with complete accessible profiles',async()=>{
  const html=await page();const cards=[...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map(([card])=>card);
  assert.equal(cards.length,4);
  const initials=[];
  for(const card of cards){
    const avatar=card.match(/<div[^>]*data-team-avatar[^>]*>[\s\S]*?<\/div>/)?.[0]||'';
    assert.ok(avatar);initials.push(text(avatar));
    assert.match(avatar,/<img[^>]*src="\/images\/team\//,'real photo in the overview card');
    assert.match(card,/<p[^>]*description[^>]*>[^<]{40,}<\/p>/,'short member summary');
    assert.match(card,/<img[^>]*src="\/images\/team\//);
    assert.match(card,/<button[^>]*aria-expanded="false"[^>]*aria-controls="team-profile-[1-4]"/);
    for(const copy of ['Ver perfil','Ver portafolio','Tecnologías','Áreas de aporte','Formación','Proyectos del portafolio'])assert.ok(card.includes(copy),copy);
  }
  assert.deepEqual(initials,['RD','JP','MA','JR']);
});

test('S21 team keeps work attribution and ends with collaboration and one integrated closing',async()=>{
  const html=await page();
  for(const phrase of ['Distintas ideas.','Soluciones conectadas.','Trabajamos de forma colaborativa','Estos trabajos no se presentan como proyectos de TreesSide Developers.'])assert.ok(text(html).includes(phrase),phrase);
  const footers=[...html.matchAll(/<footer\b[\s\S]*?<\/footer>/g)].map(([footer])=>footer);
  assert.equal(footers.length,1);
  for(const copy of ['Lo que sigue,','Hablemos','Política de datos'])assert.ok(footers[0].includes(copy));
});

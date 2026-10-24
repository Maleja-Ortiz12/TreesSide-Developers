import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
async function page(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  return response.text();
}
const plain = html => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();

test('S3 the contact page answers the questions buyers ask before hiring, in an accessible accordion', async () => {
  const html = await page('/contacto');
  const section = html.match(/<section id="preguntas-frecuentes"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'FAQ section');
  assert.match(section, /<h2[^>]*>Preguntas frecuentes<\/h2>/);
  assert.match(html, /data-reveal[^>]*>\s*<section id="preguntas-frecuentes"/, 'scroll reveal like the other sections');
  const questions = [...section.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map(match => plain(match[1]));
  assert.ok(questions.length >= 6, `questions: ${questions.length}`);
  for (const topic of [/cuesta/i, /tarda|tiempo/i, /código/i, /entrega|soporte/i, /pag/i, /tecnolog/i]) {
    assert.ok(questions.some(question => topic.test(question)), `topic ${topic}`);
  }
  assert.equal((section.match(/<details/g) || []).length, questions.length, 'one details per question');
});

test('S3 FAQPage structured data mirrors the visible questions and answers', async () => {
  const html = await page('/contacto');
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const faq = scripts.find(data => data['@type'] === 'FAQPage');
  assert.ok(faq, 'FAQPage JSON-LD');
  const section = html.match(/<section id="preguntas-frecuentes"[\s\S]*?<\/section>/)[0];
  const questions = [...section.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map(match => plain(match[1]));
  assert.deepEqual(faq.mainEntity.map(entry => entry.name), questions);
  for (const entry of faq.mainEntity) {
    assert.equal(entry['@type'], 'Question');
    assert.equal(entry.acceptedAnswer['@type'], 'Answer');
    assert.ok(plain(section).includes(entry.acceptedAnswer.text), `answer visible: ${entry.name}`);
  }
});

test('S3 answers make no commercial commitment the team has not confirmed', async () => {
  const faq = await readFile('src/data/faq.ts', 'utf8');
  assert.doesNotMatch(faq, /\$|gratis|sin costo|garantiza|\d+\s*(horas|días|semanas|meses)/i);
  assert.match(faq, /propuesta/, 'terms are defined in the written proposal');
});

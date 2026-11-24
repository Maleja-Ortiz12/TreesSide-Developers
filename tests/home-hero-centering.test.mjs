import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/components/home/HomeRedesign.module.css', 'utf8');
const desktop = css.split('@media (max-width: 1060px)')[0];
const tablet = css.split('@media (max-width: 1060px)')[1].split('@media (max-width: 600px)')[0];
const mobile = css.split('@media (max-width: 600px)')[1].split('@media (prefers-reduced-motion: reduce)')[0];
const rule = (source, selector) => source.replace(/\/\*[\s\S]*?\*\//g, '').match(new RegExp(`\\.${selector.replaceAll('.', '\\.')} \\{([^}]+)\\}`))?.[1] || '';

test('S1 public Home disables the shared offset, so Home must reserve the header exactly once', () => {
  const page = readFileSync('src/app/page.tsx', 'utf8');
  assert.match(page, /<SitePage offsetHeader=\{false\}/);
  assert.match(page, /<HomeRedesign\s*\/>/);
  const homeOffset = Number(rule(desktop, 'home').match(/padding-top: (\d+)px/)?.[1] || 0);
  assert.equal(homeOffset, 76, 'Home starts below the header even with offsetHeader=false');
  assert.doesNotMatch(rule(desktop, 'hero'), /margin-top: 76px|padding-top: 76px/);
});

test('S1 desktop centers the whole grid in the viewport remaining below the existing header', () => {
  const hero = rule(desktop, 'hero');
  assert.match(hero, /min-height: calc\(100svh - 76px\)/);
  assert.match(hero, /display: grid/);
  assert.match(hero, /align-items: center/);
  assert.match(hero, /padding-block: clamp\(16px, 3svh, 32px\)/);
  assert.doesNotMatch(hero, /padding-top: 124px|116px|height: 100svh;/);
  assert.match(rule(desktop, 'heroCopy'), /padding-block: 12px/);
});

test('S9 desktop/tablet compose the reference cascade centred against the copy', () => {
  const collage = rule(desktop, 'collage');
  assert.match(collage, /grid-template-columns: repeat\(12, minmax\(0, 1fr\)\);/);
  assert.match(collage, /grid-template-rows: auto auto;/);
  // Cards overlap through their column spans (no column gap); the short row gap keeps
  // the below-left card right under the large one.
  assert.match(collage, /gap: 8px 0;/);
  assert.doesNotMatch(collage, /aspect-ratio:|grid-template-rows: repeat\(/);
  assert.match(collage, /padding-block: 12px 18px/);
  assert.match(rule(desktop, 'collageScene'), /padding: 12px 14px/);
  assert.match(rule(desktop, 'collageScene'), /width: min\(100%, 588px\)/);
  // Large screen on top (item i), next item right-middle over its lower-right corner
  // (item i+1), following item below-left (item i+2).
  const capture = rule(desktop, 'collage .captureFrame'), shop = rule(desktop, 'collage .shopFrame'), salon = rule(desktop, 'collage .salonFrame');
  assert.match(capture, /grid-column: 1 \/ 9; grid-row: 1;/);
  assert.match(shop, /grid-column: 7 \/ 13; grid-row: 2; margin-top: -44%;/);
  assert.match(salon, /grid-column: 1 \/ 8; grid-row: 2;/);
  assert.doesNotMatch(salon, /margin-top:/);
  assert.doesNotMatch(capture, /margin-top:|z-index:/);
  assert.doesNotMatch(tablet, /margin-top:|\.collage \.(captureFrame|shopFrame|salonFrame)/, 'tablet keeps the desktop cascade');
  // Every caption sits at its card top, so each later slot paints above the earlier one.
  assert.match(rule(desktop, 'collage figure'), /z-index: 1;/);
  assert.match(shop, /z-index: 2;/);
  assert.match(salon, /z-index: 3;/);
  // Uniform ~16:10 screen frames in every slot.
  assert.match(rule(desktop, 'collage figure > img'), /aspect-ratio: 16 \/ 10;/);
  // Centred signature between two thin rules, as in the reference.
  assert.match(rule(desktop, 'heroSignature'), /display: flex;/);
  assert.match(css, /\.heroSignature::before, \.heroSignature::after \{[^}]*height: 1px;/);
  assert.match(rule(desktop, 'heroGrid'), /align-items: center/);
  // Short desktop viewports (1440x600) keep the copy and CTAs in the first viewport.
  assert.match(css, /@media \(min-width: 1061px\) and \(height <= 720px\) \{\s*\.heroGrid \{ align-items: start; \}\s*\}/);
  assert.match(rule(mobile, 'collageScene .collage figure'), /margin-top: 0/);
});

test('S1 tablet/mobile start promptly and allow natural content height, including three mobile cards', () => {
  for (const source of [tablet, mobile]) {
    assert.doesNotMatch(source, /padding-top: 1\d\dpx/);
  }
  assert.match(rule(tablet, 'hero'), /min-height: auto/);
  assert.match(rule(tablet, 'hero'), /padding-block: 24px/);
  assert.doesNotMatch(tablet, /grid-template-rows: repeat\(20, 36px\)/);
  assert.match(rule(mobile, 'collage'), /grid-template-rows: auto auto auto/);
  assert.match(rule(mobile, 'collage'), /padding-top: 16px/);
  assert.doesNotMatch(css, /overflow-y: hidden|max-height:/);
});

test('S3/S4 motion checker visits the full public cycle including appended admin frames', async () => {
  const source = readFileSync('scripts/check-home-motion-browser.mjs', 'utf8');
  const helper = source.match(/async function walkPublicFrames\([\s\S]*?\n\}/)?.[0];
  assert.ok(helper, 'checker must discover public frames rather than infer a catalog-only count');
  const { runInNewContext } = await import('node:vm');
  const walk = runInNewContext(`(${helper})`, { assert });
  const rendered = ['portfolio0', 'portfolio1', 'portfolio2', 'portfolio3', 'portfolio4', 'portfolio5', 'portfolio6', 'admin'];
  let index = 3;
  const visited = [];
  const callbacks = {
    readIndex: async () => String(index),
    next: async () => { index = (index + 1) % rendered.length; },
    visit: async id => visited.push(rendered[Number(id)]),
  };
  assert.equal(await walk(callbacks), 8);
  assert.equal(index, 3, 'returns to the initial public composition');
  assert.deepEqual([...visited].sort(), [...rendered].sort());
  rendered.pop();
  visited.length = 0;
  index = 3;
  assert.equal(await walk(callbacks), 7, 'preserves the previous portfolio-only cycle');
  assert.deepEqual([...visited].sort(), [...rendered].sort());
  await assert.rejects(walk({ ...callbacks, readIndex: async () => String(index++), next: async () => {} }, 10), /did not wrap within 10 frames/);
  assert.doesNotMatch(source, /const frameCount =|% frameCount/);
});

test('S5 existing 3D, tree, pause, conceptual contrast and mobile card geometry remain intact', () => {
  assert.match(css, /perspective: 1200px/);
  assert.match(css, /\.artworkFrame \{ display: contents; \}/);
  assert.match(css, /\.treeAccent \{[\s\S]*?z-index: 0/);
  assert.match(css, /\[data-motion='paused'\] figure \{ animation-play-state: paused; \}/);
  assert.match(css, /color: #073526;\s+background: #a0f3cd/);
  for (const delay of ['-2s', '-6s', '-10s']) assert.ok(css.includes(`animation-delay: ${delay}`));
  assert.match(mobile, /\.collage \.captureFrame \{ grid-column: 1 \/ 13; grid-row: 1;/);
  // S7: mobile stacks in DOM order, so the next promoted (left) card follows the primary.
  assert.match(mobile, /\.collage \.shopFrame \{ grid-column: 1 \/ 11; grid-row: 2;/);
  assert.match(mobile, /\.collage \.salonFrame \{ grid-column: 3 \/ 13; grid-row: 3;/);
});

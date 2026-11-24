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

test('S1 collage height follows actual overlapping card extents, including wrapped captions', () => {
  const collage = rule(desktop, 'collage');
  assert.match(collage, /grid-template-rows: auto;/);
  assert.doesNotMatch(collage, /aspect-ratio:|grid-template-rows: repeat\(/);
  assert.match(collage, /padding-block: 20px 24px/);
  assert.match(rule(desktop, 'collageScene'), /width: min\(100%, calc\(100svh - 210px\)\)/);
  for (const frame of ['captureFrame', 'salonFrame', 'shopFrame']) {
    assert.match(rule(desktop, `collage .${frame}`), /grid-row: 1;/);
  }
  // Separate lower tracks keep both captions readable instead of stacking their heights.
  assert.match(rule(desktop, 'collage .salonFrame'), /grid-column: 7 \/ 13;.*margin-top: 45%/);
  assert.match(rule(desktop, 'collage .shopFrame'), /grid-column: 1 \/ 7;.*margin-top: 45%/);
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

test('S5 existing 3D, tree, pause, conceptual contrast and mobile card geometry remain intact', () => {
  assert.match(css, /perspective: 1200px/);
  assert.match(css, /\.artworkFrame \{ display: contents; \}/);
  assert.match(css, /\.treeAccent \{[\s\S]*?z-index: 0/);
  assert.match(css, /\[data-motion='paused'\] figure \{ animation-play-state: paused; \}/);
  assert.match(css, /color: #073526;\s+background: #a0f3cd/);
  for (const delay of ['-2s', '-6s', '-10s']) assert.ok(css.includes(`animation-delay: ${delay}`));
  assert.match(mobile, /\.collage \.captureFrame \{ grid-column: 1 \/ 13; grid-row: 1;/);
  assert.match(mobile, /\.collage \.salonFrame \{ grid-column: 3 \/ 13; grid-row: 2;/);
  assert.match(mobile, /\.collage \.shopFrame \{ grid-column: 1 \/ 11; grid-row: 3;/);
});

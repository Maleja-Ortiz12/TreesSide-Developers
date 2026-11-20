import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('reduced motion keeps all scroll sections visible and flat before they enter the viewport', () => {
  const css = readFileSync('src/components/motion/Reveal.module.css', 'utf8');
  const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
  assert.match(reduced, /\.scroll\s*\{[^}]*opacity:\s*1\s*!important/);
  assert.match(reduced, /\.scroll\s*\{[^}]*transform:\s*none\s*!important/);
  assert.match(reduced, /\.first\s*\{[^}]*animation:\s*none/);
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { colors, radius, shadows } from './tokens';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

const kebab = (name: string): string => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

describe('tokens.css mirrors tokens.ts', () => {
  it.each(Object.entries(colors))('color %s', (name, value) => {
    expect(css).toContain(`--color-${kebab(name)}: ${value.toLowerCase()};`);
  });

  it.each(Object.entries(radius))('radius %s', (name, value) => {
    expect(css).toContain(`--radius-${name}: ${String(value)}px;`);
  });

  it.each(Object.entries(shadows))('shadow %s', (name, value) => {
    expect(css).toContain(`--shadow-${name}: ${value};`);
  });
});

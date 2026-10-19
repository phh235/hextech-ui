import { describe, expect, it } from 'vitest';
import { cn } from '../../packages/utils/src/cn';
import { canPlaySound, resolveSensoryPreferences } from '../../packages/utils/src/sensory';
import { getHextechUIAttributes } from '../../packages/react/src/index';

describe('class composition', () => {
  it('resolves Tailwind conflicts while retaining state variants', () => {
    expect(cn('px-2 text-sm hover:bg-primary', false, { 'px-6': true }, ['text-lg'])).toBe(
      'hover:bg-primary px-6 text-lg',
    );
  });
});

describe('sensory policy without browser globals', () => {
  it('defaults to muted and requires a direct user gesture', () => {
    const defaults = resolveSensoryPreferences();
    expect(canPlaySound(defaults, true)).toBe(false);
    const enabled = resolveSensoryPreferences({ muted: false });
    expect(canPlaySound(enabled, false)).toBe(false);
    expect(canPlaySound(enabled, true)).toBe(true);
  });
  it.each([
    [-1, 0],
    [2, 1],
    [NaN, 0],
    [Infinity, 0],
    [0.6, 0.6],
  ])('clamps volume %s to %s', (input, output) => {
    expect(resolveSensoryPreferences({ volume: input }).volume).toBe(output);
  });
  it('honors reduced sensory preference and zero volume', () => {
    expect(
      canPlaySound(resolveSensoryPreferences({ muted: false, reducedSensory: true }), true),
    ).toBe(false);
    expect(canPlaySound(resolveSensoryPreferences({ muted: false, volume: 0 }), true)).toBe(false);
  });
});

it('exposes a small runtime foundation without Next.js or a catalog fixture', () => {
  expect(getHextechUIAttributes('example')).toEqual({
    'data-hextech-ui': 'example',
    'data-hextech-ui-theme': 'hextech',
  });
});

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import { cn } from '../../packages/utils/src/cn';

describe('isolated Hextech utilities', () => {
  it('does not redefine host color, font, size or spacing theme aliases by default', async () => {
    const source = postcss.parse(
      await readFile(resolve('packages/tokens/src/tailwind.css'), 'utf8'),
    );
    const invalid: string[] = [];
    source.walkDecls((declaration) => {
      if (
        !/^--(?:color|font|font-weight|text|leading|tracking|radius|shadow|ease)-hx-/.test(
          declaration.prop,
        )
      )
        invalid.push(declaration.prop);
    });
    expect(invalid).toEqual([]);
  });
  it('keeps custom font sizes separate from custom text colors and permits consumer overrides', () => {
    const classes = cn('font-hx-sans font-hx-bold text-hx-sm text-hx-primary');
    for (const name of ['font-hx-sans', 'font-hx-bold', 'text-hx-sm', 'text-hx-primary'])
      expect(classes).toContain(name);
    const overridden = cn(classes, 'font-mono text-lg text-red-500');
    expect(overridden).toContain('font-hx-bold');
    expect(overridden).toContain('font-mono');
    expect(overridden).toContain('text-lg');
    expect(overridden).not.toContain('text-hx-sm');
    expect(overridden).not.toContain('font-hx-sans');
  });
});

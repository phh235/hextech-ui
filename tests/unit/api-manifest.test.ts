import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '../../packages/react/component-manifest.json';
// @ts-expect-error Portable ESM build helper without a TypeScript declaration.
import { validateComponentApi } from '../../scripts/validate-component-api.mjs';

describe('documentation API contracts', () => {
  it('rejects a removed prop or export using actual canonical TypeScript types', () => {
    const button = manifest.find((item) => item.name === 'button')!;
    const errors = validateComponentApi(
      [
        {
          ...button,
          exports: [...button.exports, 'MissingButtonPart'],
          api: [...button.api, ['inventedButtonOption', 'boolean', 'false']],
        },
      ],
      resolve('.'),
    );
    expect(errors).toContain('button: missing export MissingButtonPart');
    expect(errors).toContain('button: undocumented type mismatch for prop inventedButtonOption');
  });
});

import { describe, expect, it } from 'vitest';
// @ts-expect-error The portable build helper is an ESM JavaScript module.
import { updateComponentDoc } from '../../scripts/lib/component-docs.mjs';

const item = {
  name: 'button',
  title: 'Button',
  description: 'Actions.',
  api: [['variant', 'primary | destructive', 'primary']],
};
describe('component documentation generation', () => {
  it('retains authored examples and frontmatter across regeneration', () => {
    const initial =
      updateComponentDoc('', item) + '\n## Loading\n\n<UsagePreview name="button-loading" />\n';
    const next = updateComponentDoc(initial, { ...item, api: [['loading', 'boolean', 'false']] });
    expect(next).toContain('## Loading');
    expect(next).toContain('<UsagePreview name="button-loading" />');
    expect(next).toContain('| `loading` | `boolean` | `false` |');
    expect(next).not.toContain('primary');
    expect(updateComponentDoc(next, { ...item, api: [['loading', 'boolean', 'false']] })).toBe(
      next,
    );
  });
  it('migrates legacy pages without duplicating the scaffold or losing additions', () => {
    const legacy =
      '---\ntitle: Button\n---\n\n<CatalogPreview name="button" />\n\n## Installation\n\n<RegistryInstallCommand name="button" />\n\n## Tips\nKeep a visible label.\n';
    const result = updateComponentDoc(legacy, item);
    expect(result.match(/<CatalogPreview/g)).toHaveLength(1);
    expect(result).toContain('Keep a visible label.');
    expect(result).toContain('primary \\| destructive');
  });
  it('refuses to erase content when markers are incomplete', () => {
    expect(() =>
      updateComponentDoc('{/* BEGIN GENERATED REFERENCE */}\nAuthored content', item),
    ).toThrow();
  });
});

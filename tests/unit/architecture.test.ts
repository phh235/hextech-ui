import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { registrySchema } from 'shadcn/schema';

const root = resolve(import.meta.dirname, '../..');
const json = async (file: string) => JSON.parse(await readFile(join(root, file), 'utf8'));

describe('distribution boundaries', () => {
  it.each(['react', 'utils', 'tokens', 'themes'])(
    '%s stays private with deliberate exports',
    async (name) => {
      const pkg = await json(`packages/${name}/package.json`);
      expect(pkg.private).toBe(true);
      expect(pkg.name).toBe(`@hextech-ui/${name}`);
      expect(Object.keys(pkg.exports).some((key) => key.includes('internal'))).toBe(false);
      expect(
        Object.keys(pkg.dependencies ?? {}).some((key) => /next|radix|react-aria/.test(key)),
      ).toBe(false);
    },
  );
  it('uses the current official schema for source registry items', async () => {
    const result = registrySchema.safeParse(await json('registry.json'));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(
        result.data.items
          .filter((item) => item.name.startsWith('internal-'))
          .every((item) => item.meta?.internal),
      ).toBe(true);
      expect(result.data.items.some((item) => item.name === 'button' && !item.meta?.internal)).toBe(
        true,
      );
    }
  });
  it('keeps a single root workspace with no nested project wrapper', async () => {
    const entries = await readdir(root);
    expect(entries).not.toContain('hextech-ui');
    expect(entries).toContain('pnpm-lock.yaml');
    expect(entries).not.toContain('package-lock.json');
    expect(await json('apps/web/package.json')).toMatchObject({ name: '@hextech-ui/web' });
  });
});

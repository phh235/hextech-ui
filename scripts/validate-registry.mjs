import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { registrySchema, registryItemSchema } from 'shadcn/schema';
import { root } from './process.mjs';

const read = async (file) => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const catalog = registrySchema.parse(await read('registry.json'));
const built = registrySchema.parse(await read('apps/web/public/r/registry.json'));
assert.equal(new Set(catalog.items.map((item) => item.name)).size, catalog.items.length);
assert.equal(built.items.length, catalog.items.filter((item) => !item.meta?.internal).length);
assert(built.items.every((item) => !item.meta?.internal));
assert(
  catalog.items
    .find((item) => item.name === 'hextech-theme')
    ?.files.some(
      (file) =>
        file.path === 'THIRD_PARTY_NOTICES.md' &&
        file.target === '~/licenses/hextech-ui/THIRD_PARTY_NOTICES.md',
    ),
  'The shared registry foundation must install the upstream provenance notice',
);
assert(
  built.items.every((item) => (item.files || []).every((file) => !('content' in file))),
  'Public catalog declarations must not embed file content',
);
const allowed = new Set([
  'registry:component',
  'registry:ui',
  'registry:block',
  'registry:hook',
  'registry:lib',
  'registry:style',
  'registry:theme',
  'registry:file',
  'registry:page',
  'registry:base',
  'registry:font',
  'registry:item',
]);
for (const item of catalog.items) {
  assert(allowed.has(item.type));
  if (item.name.startsWith('internal-')) assert.equal(item.meta?.internal, true);
  const output = registryItemSchema.parse(await read(`apps/web/public/r/${item.name}.json`));
  assert.equal(output.name, item.name);
  assert.equal(output.files.length, item.files.length);
  for (const [index, file] of item.files.entries()) {
    assert(!path.isAbsolute(file.path) && !file.path.split(/[\\/]/).includes('..'));
    assert.equal(output.files[index].content, await readFile(path.join(root, file.path), 'utf8'));
  }
  for (const dependency of output.registryDependencies ?? []) {
    const dependencyName = new URL(dependency).pathname
      .split('/')
      .at(-1)
      .replace(/\.json$/, '');
    assert(
      catalog.items.some((candidate) => candidate.name === dependencyName),
      `Unknown registry dependency: ${dependency}`,
    );
  }
  assert(
    !(output.dependencies ?? []).some((dependency) =>
      /@hextech-ui|next|radix|react-aria/.test(dependency),
    ),
  );
}
console.log(
  `Registry schema, paths, content, and dependencies verified: ${catalog.items.length} items (${catalog.items.filter((item) => item.meta?.internal).length} internal fixtures)`,
);

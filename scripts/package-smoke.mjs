import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { root, artifacts, pnpm, run } from './process.mjs';
import { createFixture } from './fixture.mjs';
import { componentExampleCode } from '../apps/web/lib/component-usage.ts';

const packDir = path.join(artifacts, 'packs');
await mkdir(packDir, { recursive: true });
const dependencies = {};
const notice = await readFile(path.join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');
const manifest = JSON.parse(
  await readFile(path.join(root, 'packages/react/component-manifest.json'), 'utf8'),
);
const reactMetadata = JSON.parse(
  await readFile(path.join(root, 'packages/react/package.json'), 'utf8'),
);
const publicPaths = Object.keys(reactMetadata.exports)
  .filter((name) => name !== '.' && !name.endsWith('.css'))
  .map((name) => name.slice(2));
for (const name of ['react', 'utils', 'tokens', 'themes']) {
  await pnpm(['pack', '--pack-destination', packDir], { cwd: path.join(root, 'packages', name) });
  const pkg = JSON.parse(await readFile(path.join(root, 'packages', name, 'package.json'), 'utf8'));
  dependencies[`@hextech-ui/${name}`] =
    `file:${path.join(packDir, `hextech-ui-${name}-${pkg.version}.tgz`).replaceAll('\\', '/')}`;
}
const registry = JSON.parse(await readFile(path.join(root, 'registry.json'), 'utf8'));
for (const item of manifest.filter((entry) => entry.subpathOnly)) {
  const entry = registry.items.find((candidate) => candidate.name === item.name);
  for (const dependency of entry?.dependencies || []) {
    const separator = dependency.lastIndexOf('@');
    if (separator > 0)
      dependencies[dependency.slice(0, separator)] = dependency.slice(separator + 1);
  }
}
const dir = await createFixture('npm-package', true, dependencies);
await mkdir(path.join(dir, 'src/examples'), { recursive: true });
for (const item of manifest) {
  await writeFile(
    path.join(dir, `src/examples/${item.name}.tsx`),
    componentExampleCode(item.name, item.kind),
  );
}
for (const name of ['react', 'utils', 'tokens', 'themes']) {
  const installed = await realpath(path.join(dir, 'node_modules/@hextech-ui', name));
  assert(installed.startsWith(dir), 'Consumer must use a packed artifact, not a workspace link');
  assert.equal(
    await readFile(path.join(installed, 'dist/THIRD_PARTY_NOTICES.md'), 'utf8'),
    notice,
    `${name}: the installed tarball must retain the canonical third-party notice`,
  );
  const pkg = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'));
  assert(!pkg.dependencies?.next);
}
await writeFile(
  path.join(dir, 'src/app.tsx'),
  `import { createElement } from 'react';
import { getHextechUIAttributes, type HextechUIComponentProps } from '@hextech-ui/react';
import { cn } from '@hextech-ui/utils';
${publicPaths.map((name, index) => `import * as Module${index} from '@hextech-ui/react/${name}';`).join('\n')}
${publicPaths.map((_, index) => `export type Contract${index} = typeof Module${index};`).join('\n')}
const props: HextechUIComponentProps<'button'> = { type: 'button', ...getHextechUIAttributes('consumer') };
export const view = createElement('button', { ...props, className: cn('px-2', 'px-4') }, 'External React consumer');
`,
);
await run(process.execPath, [
  path.join(root, 'node_modules/typescript/bin/tsc'),
  '-p',
  path.join(dir, 'tsconfig.json'),
]);
await writeFile(
  path.join(dir, 'consumer.mjs'),
  `import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getHextechUIAttributes, Button } from '@hextech-ui/react';
import { cn, resolveSensoryPreferences } from '@hextech-ui/utils';
import { readFileSync } from 'node:fs';
const html = renderToStaticMarkup(createElement('button', { ...getHextechUIAttributes('external'), className: cn('px-2', 'px-4') }, 'External fixture'));
assert.match(html, /data-hextech-ui="external"/);
assert.match(html, /class="px-4"/);
assert.equal(resolveSensoryPreferences().muted, true);
const rendered = renderToStaticMarkup(createElement(Button, { variant: 'primary', disabled: true }, 'Packed component'));
assert.match(rendered, /data-hextech-ui="button"/);
assert.match(rendered, /disabled/);
for (const name of ${JSON.stringify(publicPaths)}) assert(Object.keys(await import('@hextech-ui/react/' + name)).length > 0, name);
for (const file of ['@hextech-ui/react/styles.css', '@hextech-ui/tokens/base.css', '@hextech-ui/tokens/tailwind.css', '@hextech-ui/themes/hextech.css']) assert(readFileSync(new URL(import.meta.resolve(file)), 'utf8').includes('--hextech-ui-'));
console.log('Packed ESM React consumer rendered successfully, without TypeScript at runtime.');
`,
);
await run(process.execPath, [path.join(dir, 'consumer.mjs')]);
await writeFile(
  path.join(artifacts, 'package-smoke-result.json'),
  JSON.stringify(
    {
      passed: true,
      consumer: dir,
      exports: publicPaths,
      checks: [
        'tarball installation',
        'no workspace links',
        'strict TypeScript declarations',
        'all public code subpaths including hooks, blocks and theme scope',
        'optional entrypoint dependencies',
        'plain JavaScript runtime',
        'React server rendering',
        'CSS exports',
      ],
      completedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

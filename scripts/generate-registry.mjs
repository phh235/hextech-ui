import { readFile, writeFile, readdir } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
const prettierOptions = (await resolveConfig('registry.json')) || {};
const manifest = JSON.parse(await readFile('packages/react/component-manifest.json', 'utf8'));
const old = JSON.parse(await readFile('registry.json', 'utf8'));
const reactPackage = JSON.parse(await readFile('packages/react/package.json', 'utf8'));
const dependencyVersions = { ...reactPackage.devDependencies, ...reactPackage.dependencies };
function externalDependencies(source) {
  const packages = new Set();
  for (const match of source.matchAll(/from ['"]([^.'"@][^'"]*|@[^/'"]+\/[^'"]+)['"]/g)) {
    const specifier = match[1];
    if (specifier.startsWith('@/')) continue;
    const name = specifier.startsWith('@')
      ? specifier.split('/').slice(0, 2).join('/')
      : specifier.split('/')[0];
    if (!['react', 'react-dom'].includes(name) && dependencyVersions[name])
      packages.add(`${name}@${dependencyVersions[name]}`);
  }
  return [...packages];
}
const origin = 'http://127.0.0.1:3000/r/';
const items = old.items.filter((item) => item.meta?.internal);
items.push({
  name: 'token-value',
  type: 'registry:lib',
  title: 'Inline token data',
  files: [{ path: 'packages/utils/src/token-value.ts', type: 'registry:lib' }],
});
const helperFiles = (await readdir('packages/react/src/lib')).filter(
  (name) => /\.tsx?$/.test(name) && name !== 'button-variants.ts',
);
const extraHelpers = helperFiles.map((name) => name.replace(/\.tsx?$/, ''));
for (const name of extraHelpers) {
  const filename = helperFiles.find((file) => file.replace(/\.tsx?$/, '') === name);
  const source = await readFile(`packages/react/src/lib/${filename}`, 'utf8');
  const dependencies = [...source.matchAll(/from ['"]@\/lib\/([^'"]+)['"]/g)].map(
    (match) => `${origin}${match[1]}.json`,
  );
  const runtime = externalDependencies(source);
  items.push({
    name,
    type: 'registry:lib',
    title: name,
    ...(runtime.length ? { dependencies: runtime } : {}),
    ...(dependencies.length ? { registryDependencies: dependencies } : {}),
    files: [{ path: `packages/react/src/lib/${filename}`, type: 'registry:lib' }],
  });
}
items.push({
  name: 'cn',
  type: 'registry:lib',
  title: 'Class composition',
  dependencies: ['clsx@2.1.1', 'tailwind-merge@3.7.0'],
  files: [{ path: 'packages/utils/src/cn.ts', type: 'registry:lib' }],
});
items.push({
  name: 'button-variants',
  type: 'registry:lib',
  title: 'Action style variants',
  registryDependencies: [`${origin}cn.json`],
  files: [{ path: 'packages/react/src/lib/button-variants.ts', type: 'registry:lib' }],
});
items.push({
  name: 'hextech-theme',
  dependencies: ['@fontsource/barlow@5.3.0', '@fontsource/cinzel@5.3.0'],
  type: 'registry:style',
  title: 'Hextech theme foundation',
  description:
    'Import the installed styles/hextech-*.css files after Tailwind. Visual design adapted from LoL Math UI; licensed font substitutes and original project artwork.',
  files: [
    ...[
      ['tokens/src/base.css', 'hextech-tokens.css'],
      ['themes/src/hextech.css', 'hextech-theme.css'],
      ['tokens/src/tailwind.css', 'hextech-tailwind.css'],
      ['tokens/src/tailwind-global.css', 'hextech-tailwind-global.css'],
      ['react/src/styles.css', 'hextech-components.css'],
    ].map(([source, target]) => ({
      path: `packages/${source}`,
      type: 'registry:file',
      target: `styles/${target}`,
    })),
    {
      path: 'THIRD_PARTY_NOTICES.md',
      type: 'registry:file',
      target: '~/licenses/hextech-ui/THIRD_PARTY_NOTICES.md',
    },
  ],
});
for (const component of manifest) {
  const sourcePath = component.source || `packages/react/src/components/${component.name}.tsx`;
  const itemType = component.kind === 'hook' ? 'registry:hook' : 'registry:ui';
  const source = await readFile(sourcePath, 'utf8');
  const dependencies = new Set([`${origin}hextech-theme.json`]);
  for (const name of component.registryDependencies ?? [])
    dependencies.add(`${origin}${name}.json`);
  if (source.includes('@/lib/cn')) dependencies.add(`${origin}cn.json`);
  if (source.includes('@/lib/button-variants')) dependencies.add(`${origin}button-variants.json`);
  if (source.includes('@/lib/token-value')) dependencies.add(`${origin}token-value.json`);
  for (const name of extraHelpers)
    if (source.includes(`@/lib/${name}`)) dependencies.add(`${origin}${name}.json`);
  for (const match of source.matchAll(/from ['"]\.\/([^'"]+)['"]/g))
    if (manifest.some((item) => item.name === match[1]))
      dependencies.add(`${origin}${match[1]}.json`);
  items.push({
    name: component.name,
    type: itemType,
    title: component.title,
    description: component.description,
    meta: {
      project: 'hextech-ui',
      sourceKind: component.upstream ? 'original-reimplementation' : 'original-extension',
    },
    ...(externalDependencies(source).length ? { dependencies: externalDependencies(source) } : {}),
    registryDependencies: [...dependencies],
    files: [{ path: sourcePath, type: itemType }],
  });
}
const blocks = JSON.parse(await readFile('packages/react/block-manifest.json', 'utf8'));
for (const block of blocks) {
  const sourcePath = `packages/react/src/blocks/${block.name}.tsx`;
  const source = await readFile(sourcePath, 'utf8');
  const dependencies = new Set([`${origin}hextech-theme.json`]);
  for (const match of source.matchAll(/from ['"]@\/components\/ui\/([^'"]+)['"]/g))
    dependencies.add(`${origin}${match[1]}.json`);
  for (const match of source.matchAll(/from ['"]@\/lib\/([^'"]+)['"]/g))
    dependencies.add(`${origin}${match[1]}.json`);
  items.push({
    name: block.registryName,
    type: 'registry:block',
    title: block.title,
    description: block.description,
    registryDependencies: [...dependencies],
    ...(externalDependencies(source).length ? { dependencies: externalDependencies(source) } : {}),
    files: [
      {
        path: sourcePath,
        type: 'registry:component',
        target: `components/blocks/${block.name}.tsx`,
      },
    ],
    meta: { project: 'hextech-ui', sourceKind: 'original-block', mock: true },
  });
}
await writeFile(
  'registry.json',
  await format(
    JSON.stringify({
      $schema: old.$schema,
      name: 'hextech-ui',
      homepage: 'http://127.0.0.1:3000',
      items,
    }),
    { ...prettierOptions, parser: 'json' },
  ),
);
console.log(`Registry metadata generated for ${manifest.length} component modules.`);

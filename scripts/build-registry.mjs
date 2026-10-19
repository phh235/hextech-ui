import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { root, pnpm } from './process.mjs';
import './generate-registry.mjs';
import { registryOrigin, siteUrl } from '../apps/web/lib/site.ts';

const origin = new URL(
  process.env.NEXT_PUBLIC_REGISTRY_URL || (process.env.VERCEL ? siteUrl : registryOrigin),
);
if (
  !['http:', 'https:'].includes(origin.protocol) ||
  origin.pathname !== '/' ||
  origin.search ||
  origin.hash ||
  origin.username ||
  origin.password
)
  throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin');
await pnpm(['exec', 'shadcn', 'build', 'registry.json', '--output', 'apps/web/public/r']);
const dir = path.join(root, 'apps/web/public/r');
const catalog = JSON.parse(await readFile(path.join(dir, 'registry.json'), 'utf8'));
catalog.homepage = origin.origin;
for (const item of catalog.items) {
  const file = path.join(dir, `${item.name}.json`);
  const built = JSON.parse(await readFile(file, 'utf8'));
  for (const value of [item, built]) {
    if (value.registryDependencies)
      value.registryDependencies = value.registryDependencies.map((dependency) =>
        dependency.replace('http://127.0.0.1:3000', origin.origin),
      );
  }
  await writeFile(file, JSON.stringify(built, null, 2) + '\n');
}
catalog.items = catalog.items.filter((item) => !item.meta?.internal);
await writeFile(path.join(dir, 'registry.json'), JSON.stringify(catalog, null, 2) + '\n');
await mkdir(path.join(root, '.artifacts'), { recursive: true });
console.log(`Registry built for ${origin.origin}. Internal fixtures remain explicitly marked.`);

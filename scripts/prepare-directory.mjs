import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { registrySchema } from 'shadcn/schema';
import { root, artifacts } from './process.mjs';
const configured = process.env.NEXT_PUBLIC_SITE_URL;
assert(
  configured,
  'A real approved public origin is required; no placeholder submission is produced.',
);
const origin = new URL(configured);
assert(
  origin.protocol === 'https:' && !['localhost', '127.0.0.1', '::1'].includes(origin.hostname),
  'Directory submissions require an approved public HTTPS origin.',
);
const catalog = registrySchema.parse(
  JSON.parse(await readFile(path.join(root, 'apps/web/public/r/registry.json'), 'utf8')),
);
assert.equal(
  catalog.homepage,
  origin.origin,
  'Rebuild the registry for the approved origin first.',
);
assert(
  catalog.items.every(
    (item) => !item.meta?.internal && (item.files || []).every((file) => !('content' in file)),
  ),
);
await writeFile(
  path.join(artifacts, 'registry-directory-catalog.json'),
  JSON.stringify(catalog, null, 2) + '\n',
);
console.log(
  'Prepared a local directory catalog. Namespace ownership, public endpoint verification and external PR approval remain separate requirements.',
);

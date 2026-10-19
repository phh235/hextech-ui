import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { root } from './process.mjs';
export async function registrySourceDigest() {
  const registry = JSON.parse(await readFile(path.join(root, 'registry.json'), 'utf8'));
  const hash = createHash('sha256').update(JSON.stringify(registry));
  const paths = [
    ...new Set(registry.items.flatMap((item) => item.files.map((file) => file.path))),
  ].sort();
  for (const file of paths) hash.update(file).update(await readFile(path.join(root, file)));
  return hash.digest('hex');
}

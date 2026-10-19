import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const packageDir = process.cwd();
const relative = path.relative(root, packageDir).replaceAll('\\', '/');
if (!['packages/react', 'packages/themes', 'packages/tokens', 'packages/utils'].includes(relative))
  throw new Error('Run notice preparation from a Hextech UI package directory');

const destination = path.join(packageDir, 'dist');
await mkdir(destination, { recursive: true });
await copyFile(
  path.join(root, 'THIRD_PARTY_NOTICES.md'),
  path.join(destination, 'THIRD_PARTY_NOTICES.md'),
);
console.log(`${relative}: third-party notices prepared for the package archive`);

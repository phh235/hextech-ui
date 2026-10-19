import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const name = process.argv[2];
if (!['tokens', 'themes'].includes(name)) throw new Error('Expected tokens or themes');
const files = name === 'tokens' ? ['base.css', 'tailwind.css'] : ['hextech.css'];
for (const file of files) {
  const path = fileURLToPath(new URL(`../packages/${name}/src/${file}`, import.meta.url));
  if (!(await readFile(path, 'utf8')).includes('--hextech-ui-'))
    throw new Error(`Missing tokens: ${path}`);
}
console.log(`${name}: CSS entry points verified`);

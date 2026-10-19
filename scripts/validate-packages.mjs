import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import path from 'node:path';
import { publint } from 'publint';
import { root } from './process.mjs';

for (const name of ['react', 'utils', 'tokens', 'themes']) {
  const dir = path.join(root, 'packages', name);
  const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
  assert.equal(pkg.private, true);
  const { messages } = await publint({ pkgDir: dir });
  assert.deepEqual(messages, [], `${pkg.name}: ${JSON.stringify(messages)}`);
  for (const value of Object.values(pkg.exports)) {
    for (const file of typeof value === 'string' ? [value] : Object.values(value))
      await access(path.join(dir, file));
  }
  assert(
    !Object.keys(pkg.dependencies ?? {}).some((dependency) =>
      /next|react-dom$|^react$|radix|react-aria/.test(dependency),
    ),
  );
  if (name === 'react' || name === 'utils') {
    const output = await readFile(path.join(dir, pkg.exports['.'].import), 'utf8');
    assert(!/next\/|react\.production|react\.development|InternalSmoke/.test(output));
    assert((await readdir(path.join(dir, 'dist'))).every((file) => !/test|internal/.test(file)));
  }
  console.log(`${pkg.name}: exports, package metadata, and runtime boundaries verified`);
}

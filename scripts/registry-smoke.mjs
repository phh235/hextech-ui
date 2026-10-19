import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { root, artifacts, pnpm, run, startWeb, waitFor } from './process.mjs';
import { createFixture } from './fixture.mjs';

const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000';
assert.equal(
  new URL(origin).hostname,
  '127.0.0.1',
  'Run the local smoke test with the default local registry origin',
);
const port = Number(new URL(origin).port || 80);
// Fail if the port is occupied: this test must verify the app that it starts.
try {
  await fetch(origin);
  throw new Error(`Port ${port} is already serving. Stop that server before the smoke test.`);
} catch (error) {
  if (error.message.includes('already serving')) throw error;
}
const server = startWeb(port);
const results = [];
try {
  await waitFor(`${origin}/r/internal-smoke.json`, server);
  const response = await fetch(`${origin}/r/internal-smoke.json`);
  assert.match(response.headers.get('content-type'), /application\/json/);
  const item = await response.json();
  assert.equal(item.meta.internal, true);
  for (const dependency of item.registryDependencies) assert((await fetch(dependency)).ok);
  for (const tsx of [true, false]) {
    const dir = await createFixture('registry', tsx);
    await writeFile(path.join(dir, 'src/globals.css'), '@import "tailwindcss";\n');
    await writeFile(
      path.join(dir, 'components.json'),
      JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema.json',
          style: 'new-york',
          rsc: false,
          tsx,
          tailwind: {
            config: '',
            css: 'src/globals.css',
            baseColor: 'neutral',
            cssVariables: true,
          },
          aliases: {
            components: '@/components',
            ui: '@/components/ui',
            utils: '@/lib/cn',
            lib: '@/lib',
            hooks: '@/hooks',
          },
          registries: { '@hextech-ui': `${origin}/r/{name}.json` },
        },
        null,
        2,
      ),
    );
    await pnpm([
      'exec',
      'shadcn',
      'add',
      tsx ? `${origin}/r/internal-smoke.json` : '@hextech-ui/internal-smoke',
      '--yes',
      '--overwrite',
      '--cwd',
      dir,
    ]);
    const extension = tsx ? 'tsx' : 'jsx';
    const component = await readFile(
      path.join(dir, `src/components/ui/internal-smoke.${extension}`),
      'utf8',
    );
    const utility = await readFile(path.join(dir, `src/lib/cn.${tsx ? 'ts' : 'js'}`), 'utf8');
    const hook = await readFile(
      path.join(dir, `src/hooks/use-internal-state.${tsx ? 'ts' : 'js'}`),
      'utf8',
    );
    assert.match(component, /@base-ui\/react\/toggle/);
    assert.match(component, /@\/hooks\/use-internal-state/);
    assert.match(component, /@\/lib\/cn/);
    assert.match(utility, /tailwind-merge/);
    assert.match(hook, /useState/);
    if (!tsx)
      assert(!/interface |import type|: boolean|<SetStateAction/.test(component + utility + hook));
    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    for (const name of ['@base-ui/react', 'clsx', 'tailwind-merge']) assert(pkg.dependencies[name]);
    assert(!Object.keys(pkg.dependencies).some((name) => name.startsWith('@hextech-ui/')));
    await run(process.execPath, [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '-p',
      path.join(dir, tsx ? 'tsconfig.json' : 'jsconfig.json'),
    ]);
    assert((await readdir(path.join(dir, 'node_modules/@base-ui/react'))).length);
    results.push({
      language: tsx ? 'TypeScript' : 'JavaScript',
      installation: tsx ? 'URL' : 'namespace',
      consumer: dir,
      compiled: true,
    });
  }
  await writeFile(
    path.join(artifacts, 'registry-smoke-result.json'),
    JSON.stringify({ passed: true, results, completedAt: new Date().toISOString() }, null, 2),
  );
  console.log('Actual shadcn URL/namespace installs and TS/JS compilation passed.');
} finally {
  server.kill();
}

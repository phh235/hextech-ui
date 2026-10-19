import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { root, artifacts, pnpm, run, startWeb, waitFor } from './process.mjs';
import { createFixture } from './fixture.mjs';
import { registrySourceDigest } from './source-digest.mjs';
import { componentExampleCode } from '../apps/web/lib/component-usage.ts';
const sourceDigest = await registrySourceDigest();
const usageExamples = JSON.parse(
  await readFile(path.join(root, 'apps/web/lib/usage-example-sources.json'), 'utf8'),
);
const webPackage = JSON.parse(await readFile(path.join(root, 'apps/web/package.json'), 'utf8'));
const notice = await readFile(path.join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');

const manifest = JSON.parse(
  await readFile(path.join(root, 'packages/react/component-manifest.json'), 'utf8'),
);
const origin = 'http://127.0.0.1:3000';
try {
  await fetch(origin);
  throw new Error(
    'Port 3000 is occupied; stop the development server before this integration test.',
  );
} catch (error) {
  if (error.message.includes('occupied')) throw error;
}
const server = startWeb(3000);
const results = [];
try {
  await waitFor(`${origin}/r/button.json`, server);
  for (const tsx of [true, false]) {
    const dir = await createFixture('catalog', tsx, {
      vite: '8.3.4',
      '@tailwindcss/vite': '4.3.3',
      tailwindcss: '4.3.3',
      ...(tsx
        ? Object.fromEntries(
            ['react-hook-form', '@hookform/resolvers', 'zod'].map((name) => [
              name,
              webPackage.dependencies[name],
            ]),
          )
        : {}),
    });
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
      ...manifest.map((item) => `@hextech-ui/${item.name}`),
      '--yes',
      '--overwrite',
      '--cwd',
      dir,
    ]);
    assert.equal(
      await readFile(path.join(dir, 'licenses/hextech-ui/THIRD_PARTY_NOTICES.md'), 'utf8'),
      notice,
      'Actual registry installs must retain the canonical third-party notice',
    );
    const ext = tsx ? 'tsx' : 'jsx';
    for (const item of manifest) {
      const file = await readFile(
        path.join(
          dir,
          item.kind === 'hook'
            ? `src/hooks/${item.name}.${tsx ? 'ts' : 'js'}`
            : `src/components/ui/${item.name}.${ext}`,
        ),
        'utf8',
      );
      assert(file.length > 0);
      if (!tsx)
        assert(!/export (?:interface|type) /.test(file), `${item.name} retained TS declarations`);
    }
    if (tsx) {
      await mkdir(path.join(dir, 'src/examples'), { recursive: true });
      for (const item of manifest)
        await writeFile(
          path.join(dir, `src/examples/${item.name}.tsx`),
          componentExampleCode(item.name, item.kind, 'registry'),
        );
      for (const [name, code] of Object.entries(usageExamples))
        await writeFile(path.join(dir, `src/examples/usage-${name}.tsx`), code);
    }
    await run(process.execPath, [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '-p',
      path.join(dir, tsx ? 'tsconfig.json' : 'jsconfig.json'),
    ]);
    const imports = manifest
      .map(
        (item, index) =>
          `import * as component${index} from './${item.kind === 'hook' ? 'hooks' : 'components/ui'}/${item.name}';`,
      )
      .join('\n');
    const entry = `${imports}\nimport { createElement } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './globals.css';\nconst modules=[${manifest.map((_, index) => `component${index}`).join(',')}];\ncreateRoot(document.getElementById('root')).render(createElement('div', {}, modules.map((module) => Object.keys(module).join(',')).join(' | ')));`;
    await writeFile(path.join(dir, `src/main.${ext}`), entry);
    await writeFile(
      path.join(dir, 'index.html'),
      `<html lang="en" data-hextech-ui-theme="hextech"><head><title>Registry consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.${ext}"></script></body></html>`,
    );
    await writeFile(
      path.join(dir, 'src/globals.css'),
      '@import "tailwindcss";\n@import "./styles/hextech-tokens.css";\n@import "./styles/hextech-theme.css";\n@import "./styles/hextech-tailwind.css";\n@import "./styles/hextech-components.css";\n',
    );
    const tailwind = (
      await import(
        pathToFileURL(path.join(dir, 'node_modules/@tailwindcss/vite/dist/index.mjs')).href
      )
    ).default;
    await build({
      root: dir,
      configFile: false,
      plugins: [tailwind()],
      resolve: { alias: { '@': path.join(dir, 'src') } },
      build: {
        outDir: 'dist',
        rolldownOptions: {
          onLog(level, log, handler) {
            if (log.code !== 'MODULE_LEVEL_DIRECTIVE') handler(level, log);
          },
        },
      },
      logLevel: 'warn',
    });
    results.push({
      language: tsx ? 'TypeScript' : 'JavaScript',
      components: manifest.map((item) => item.name),
      installed: true,
      typechecked: true,
      viteBuilt: true,
      documentationExamplesTypechecked: tsx ? manifest.length : 0,
      consumer: dir,
    });
  }
  assert.equal(
    await registrySourceDigest(),
    sourceDigest,
    'Registry sources changed during verification',
  );
  await writeFile(
    path.join(artifacts, 'catalog-smoke-result.json'),
    JSON.stringify(
      { passed: true, sourceDigest, results, completedAt: new Date().toISOString() },
      null,
      2,
    ),
  );
  console.log(
    `Every catalog module installed and built in Vite TS and JS: ${manifest.length} each.`,
  );
} finally {
  server.kill();
}

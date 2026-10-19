import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, preview } from 'vite';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { root, artifacts, pnpm, run, startWeb, waitFor } from './process.mjs';
import { createFixture } from './fixture.mjs';
import { registrySourceDigest } from './source-digest.mjs';
const sourceDigest = await registrySourceDigest();
const blocks = JSON.parse(
  await readFile(path.join(root, 'packages/react/block-manifest.json'), 'utf8'),
);
const origin = 'http://127.0.0.1:3000';
try {
  await fetch(origin);
  throw new Error('Port 3000 is occupied; stop the development server first.');
} catch (error) {
  if (error.message.includes('occupied')) throw error;
}
const server = startWeb(3000);
const browser = await chromium.launch();
const results = [];
try {
  await waitFor(`${origin}/r/auth-01.json`, server);
  for (const tsx of [true, false]) {
    const dir = await createFixture('blocks', tsx, {
      vite: '8.3.4',
      '@tailwindcss/vite': '4.3.3',
      tailwindcss: '4.3.3',
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
      ...blocks.map((block) => `@hextech-ui/${block.registryName}`),
      '--yes',
      '--overwrite',
      '--cwd',
      dir,
    ]);
    const ext = tsx ? 'tsx' : 'jsx';
    for (const block of blocks) {
      const source = await readFile(
        path.join(dir, `src/components/blocks/${block.name}.${ext}`),
        'utf8',
      );
      assert(source.length);
      if (!tsx) assert(!/export (?:interface|type) /.test(source));
    }
    const imports = blocks
      .map((block) => `import { ${block.exports[0]} } from './components/blocks/${block.name}';`)
      .join('\n');
    await writeFile(
      path.join(dir, `src/main.${ext}`),
      `import { createRoot } from 'react-dom/client';\n${imports}\nimport './globals.css';\ncreateRoot(document.getElementById('root')${tsx ? '!' : ''}).render(<main style={{maxWidth:1100,margin:'auto',padding:24,display:'grid',gap:32}}><h1>Independent block consumer</h1>${blocks.map((block) => `<${block.exports[0]} />`).join('')}</main>);`,
    );
    await writeFile(
      path.join(dir, 'index.html'),
      `<html lang="en" data-hextech-ui-theme="hextech" data-color-mode="dark"><head><meta name="viewport" content="width=device-width, initial-scale=1"><title>Independent blocks</title></head><body><div id="root"></div><script type="module" src="/src/main.${ext}"></script></body></html>`,
    );
    await writeFile(
      path.join(dir, 'src/globals.css'),
      '@import "tailwindcss";\n@import "./styles/hextech-tokens.css";\n@import "./styles/hextech-theme.css";\n@import "./styles/hextech-tailwind.css";\n@import "./styles/hextech-components.css";\nbody{margin:0;background:var(--hextech-ui-background);color:var(--hextech-ui-foreground);font-family:var(--hextech-ui-font-sans)}\n',
    );
    await run(process.execPath, [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '-p',
      path.join(dir, tsx ? 'tsconfig.json' : 'jsconfig.json'),
    ]);
    const tailwind = (
      await import(
        pathToFileURL(path.join(dir, 'node_modules/@tailwindcss/vite/dist/index.mjs')).href
      )
    ).default;
    const configuration = {
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
    };
    await build(configuration);
    const serving = await preview({
      ...configuration,
      preview: { host: '127.0.0.1', port: 4178, strictPort: true },
    });
    try {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('http://127.0.0.1:4178');
      await page.getByRole('textbox', { name: 'Email address' }).fill('fixture@example.com');
      await page.getByLabel('Password', { exact: true }).fill('fixture-passphrase');
      await page.getByRole('button', { name: 'Preview login' }).click();
      assert(
        (await page.getByRole('status').filter({ hasText: 'Local login' }).textContent()).includes(
          'No account',
        ),
      );
      await page.getByRole('button', { name: 'Mark ready' }).click();
      await page.getByRole('button', { name: 'Preview matchmaking' }).click();
      assert(await page.getByRole('button', { name: 'Cancel queue preview' }).isVisible());
      assert.deepEqual(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
        [],
      );
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await page.screenshot({
        path: path.join(artifacts, `blocks-consumer-${tsx ? 'ts' : 'js'}.png`),
        fullPage: true,
      });
      await context.close();
    } finally {
      await new Promise((resolve) => serving.httpServer.close(resolve));
    }
    results.push({
      language: tsx ? 'TypeScript' : 'JavaScript',
      blocks: blocks.map((block) => block.registryName),
      installed: true,
      typechecked: true,
      viteBuilt: true,
      browserInteraction: true,
      mobileAxe: true,
      consumer: dir,
    });
  }
  assert.equal(
    await registrySourceDigest(),
    sourceDigest,
    'Registry sources changed during verification',
  );
  await writeFile(
    path.join(artifacts, 'blocks-smoke-result.json'),
    JSON.stringify(
      { passed: true, sourceDigest, completedAt: new Date().toISOString(), results },
      null,
      2,
    ),
  );
  console.log(
    `All ${blocks.length} blocks installed, built and used in independent TS/JS browsers.`,
  );
} finally {
  await browser.close();
  server.kill();
}

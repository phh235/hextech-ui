import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import ts from 'typescript';
import { root, artifacts, pnpm, run, startWeb, waitFor } from './process.mjs';
import { createFixture } from './fixture.mjs';
import { registrySourceDigest } from './source-digest.mjs';
import { componentExampleCode } from '../apps/web/lib/component-usage.ts';
const sourceDigest = await registrySourceDigest();
const manifest = JSON.parse(
  await readFile(path.join(root, 'packages/react/component-manifest.json'), 'utf8'),
);
const blocks = JSON.parse(
  await readFile(path.join(root, 'packages/react/block-manifest.json'), 'utf8'),
);
const origin = 'http://127.0.0.1:3000';
try {
  await fetch(origin);
  throw new Error('Port 3000 is occupied; stop that server first.');
} catch (error) {
  if (error.message.includes('occupied')) throw error;
}
const registry = startWeb(3000);
const browser = await chromium.launch();
const results = [];
try {
  await waitFor(`${origin}/r/button.json`, registry);
  for (const tsx of [true, false]) {
    const dir = await createFixture('next', tsx, {
      next: '16.4.2',
      typescript: '5.9.3',
      '@types/node': '24.19.2',
      tailwindcss: '4.3.3',
      '@tailwindcss/postcss': '4.3.3',
      postcss: '8.5.23',
    });
    await mkdir(path.join(dir, 'src/app'), { recursive: true });
    await writeFile(path.join(dir, 'src/app/globals.css'), '@import "tailwindcss";\n');
    await writeFile(
      path.join(dir, 'components.json'),
      JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema.json',
          style: 'new-york',
          rsc: true,
          tsx,
          tailwind: {
            config: '',
            css: 'src/app/globals.css',
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
      ...blocks.map((item) => `@hextech-ui/${item.registryName}`),
      '--yes',
      '--overwrite',
      '--cwd',
      dir,
    ]);
    const ext = tsx ? 'tsx' : 'jsx';
    await writeFile(
      path.join(dir, 'next.config.mjs'),
      `export default { turbopack: { root: ${JSON.stringify(dir)} }, outputFileTracingRoot: ${JSON.stringify(dir)} };\n`,
    );
    await writeFile(
      path.join(dir, 'postcss.config.mjs'),
      "export default { plugins: { '@tailwindcss/postcss': {} } };\n",
    );
    await writeFile(
      path.join(dir, `src/app/layout.${ext}`),
      `import './globals.css';\nexport default function Layout({children}${tsx ? ': {children: React.ReactNode}' : ''}) { return <html lang="en" data-hextech-ui-theme="hextech" data-color-mode="dark"><body>{children}</body></html>; }`,
    );
    await writeFile(
      path.join(dir, `src/app/page.${ext}`),
      "import { Consumer } from './consumer';\nexport const metadata = { title: 'Independent Next consumer' };\nexport default function Page() { return <main style={{maxWidth:1000,margin:'auto',padding:24}}><h1>Independent Next consumer</h1><Consumer /></main>; }",
    );
    const imports = manifest
      .map(
        (item, index) =>
          `import * as Module${index} from '@/${item.kind === 'hook' ? 'hooks' : 'components/ui'}/${item.name}';`,
      )
      .join('\n');
    await writeFile(
      path.join(dir, `src/app/consumer.${ext}`),
      `'use client';\nimport {useState} from 'react';\n${imports}\nimport {Button} from '@/components/ui/button';\nimport {Checkbox} from '@/components/ui/checkbox';\nimport {NumberField} from '@/components/ui/number-field';\nimport {DatePicker} from '@/components/ui/date-picker';\nimport {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogClose} from '@/components/ui/dialog';\nimport {AuthBlock} from '@/components/blocks/auth';\nconst exportsCount = [${manifest.map((_, index) => `Module${index}`).join(',')}].reduce((sum,module)=>sum+Object.keys(module).length,0);\nexport function Consumer(){const[count,setCount]=useState(0);return <div style={{display:'grid',gap:24}}><p>{exportsCount} source exports compiled across the server/client boundary.</p><Button onClick={()=>setCount(count+1)}>Consumer count {count}</Button><label style={{display:'flex',gap:12}}><Checkbox name="ready" />Ready in Next</label><NumberField label="Party size" defaultValue={3} min={1} max={5}/><DatePicker label="Session date" defaultValue="2026-10-17" referenceDate="2026-10-17"/><Dialog><DialogTrigger>Open consumer dialog</DialogTrigger><DialogContent><DialogTitle>Installed source dialog</DialogTitle><DialogClose>Close consumer dialog</DialogClose></DialogContent></Dialog><AuthBlock/></div>;}`,
    );
    await writeFile(
      path.join(dir, 'src/app/globals.css'),
      '@import "tailwindcss";\n@import "../styles/hextech-tokens.css";\n@import "../styles/hextech-theme.css";\n@import "../styles/hextech-tailwind.css";\n@import "../styles/hextech-components.css";\nbody{margin:0;background:var(--hextech-ui-background);color:var(--hextech-ui-foreground);font-family:var(--hextech-ui-font-sans)}\n',
    );
    await mkdir(path.join(dir, 'src/app/copied-example'), { recursive: true });
    for (const name of ['button', 'table-load-more', 'sonner']) {
      const item = manifest.find((entry) => entry.name === name);
      const code = componentExampleCode(name, item.kind, 'registry');
      await writeFile(
        path.join(dir, `src/copied-${name}.${ext}`),
        tsx
          ? code
          : ts.transpileModule(code, {
              compilerOptions: {
                jsx: ts.JsxEmit.Preserve,
                module: ts.ModuleKind.ESNext,
                target: ts.ScriptTarget.ES2022,
              },
            }).outputText,
      );
    }
    await writeFile(
      path.join(dir, `src/app/copied-example/page.${ext}`),
      "import {Example as Buttons} from '../../copied-button';\nimport {Example as Loading} from '../../copied-table-load-more';\nimport {Example as Notifications} from '../../copied-sonner';\nexport const metadata = { title: 'Copied source examples' };\nexport default function Page(){return <main style={{maxWidth:1000,margin:'auto',padding:24}}><h1>Copied source examples</h1><Buttons/><Loading/><Notifications/></main>;}\n",
    );
    await run(process.execPath, [path.join(dir, 'node_modules/next/dist/bin/next'), 'build'], {
      cwd: dir,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    });
    const server = spawn(
      process.execPath,
      [
        path.join(dir, 'node_modules/next/dist/bin/next'),
        'start',
        '--hostname',
        '127.0.0.1',
        '--port',
        '3201',
      ],
      { cwd: dir, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } },
    );
    try {
      await waitFor('http://127.0.0.1:3201', server);
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('http://127.0.0.1:3201');
      await page.getByRole('button', { name: 'Consumer count 0' }).click();
      assert(await page.getByRole('button', { name: 'Consumer count 1' }).isVisible());
      await page.getByRole('checkbox', { name: 'Ready in Next' }).check();
      assert(await page.getByRole('checkbox', { name: 'Ready in Next' }).isChecked());
      const trigger = page.getByRole('button', { name: 'Open consumer dialog' });
      await trigger.click();
      assert(await page.getByRole('dialog', { name: 'Installed source dialog' }).isVisible());
      await page.keyboard.press('Escape');
      assert(await trigger.evaluate((node) => node === document.activeElement));
      assert.deepEqual(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
        [],
      );
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await page.screenshot({
        path: path.join(artifacts, `next-consumer-${tsx ? 'ts' : 'js'}.png`),
        fullPage: true,
      });
      await page.goto('http://127.0.0.1:3201/copied-example');
      await page.getByRole('button', { name: 'All rows loaded', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Queue up', exact: true }).click();
      await page.getByRole('button', { name: 'Queue up', exact: true }).waitFor();
      await page.getByRole('button', { name: 'Show notification', exact: true }).click();
      await page.getByText('Default Sonner', { exact: true }).waitFor();
      assert.deepEqual(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations,
        [],
      );
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      await context.close();
    } finally {
      server.kill();
    }
    results.push({
      language: tsx ? 'TypeScript' : 'JavaScript',
      components: manifest.map((item) => item.name),
      blocks: blocks.map((item) => item.registryName),
      installed: true,
      productionBuilt: true,
      serverClientBoundary: true,
      browserInteraction: true,
      mobileAxe: true,
      copiedExamples: ['button', 'table-load-more', 'sonner'],
      copiedClientBoundary: true,
      consumer: dir,
    });
  }
  assert.equal(
    await registrySourceDigest(),
    sourceDigest,
    'Registry sources changed during verification',
  );
  await writeFile(
    path.join(artifacts, 'next-smoke-result.json'),
    JSON.stringify(
      { passed: true, sourceDigest, completedAt: new Date().toISOString(), results },
      null,
      2,
    ),
  );
  console.log(
    'Independent Next.js TS and JS source consumers built and passed browser interactions.',
  );
} finally {
  await browser.close();
  registry.kill();
}

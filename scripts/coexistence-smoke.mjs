import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, preview } from 'vite';
import { chromium, expect } from '@playwright/test';
import { root, artifacts, pnpm, startWeb, waitFor, run } from './process.mjs';
import { createFixture } from './fixture.mjs';
import { registrySourceDigest } from './source-digest.mjs';

const origin = 'http://127.0.0.1:3000';
const digest = await registrySourceDigest();
try {
  await fetch(origin);
  throw new Error(
    'Port 3000 is occupied; stop the project dev session before coexistence verification.',
  );
} catch (error) {
  if (error.message.includes('occupied')) throw error;
}
const server = startWeb(3000);
let browser;
let viteServer;
try {
  await waitFor(origin, server);
  const dir = await createFixture('shadcn-coexistence', true, {
    vite: '8.3.4',
    '@tailwindcss/vite': '4.3.3',
    tailwindcss: '4.3.3',
    clsx: '2.1.1',
    'tailwind-merge': '3.7.0',
    'class-variance-authority': '0.7.1',
  });
  await mkdir(path.join(dir, 'src/lib'), { recursive: true });
  await writeFile(
    path.join(dir, 'src/lib/utils.ts'),
    "import {clsx,type ClassValue} from 'clsx';import {twMerge} from 'tailwind-merge';export function cn(...values:ClassValue[]){return twMerge(clsx(values));}\n",
  );
  await writeFile(
    path.join(dir, 'src/host.css'),
    `@import 'tailwindcss';
@source './';
@theme inline { --color-background: var(--background); --color-foreground: var(--foreground); --color-primary: var(--primary); --color-primary-foreground: var(--primary-foreground); --color-input: var(--input); --color-border: var(--border); --color-ring: var(--ring); }
:root { --background:#fff; --foreground:#202035; --primary:#7c3aed; --primary-foreground:#fff; --input:#8877aa; --border:#aa99bb; --ring:#7c3aed; --font-sans:monospace; --text-sm:17px; --spacing:6px; --radius:.75rem; }
body { margin:16px; background:var(--background); color:var(--foreground); }
`,
  );
  const config = {
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: false,
    tsx: true,
    tailwind: { config: '', css: 'src/host.css', baseColor: 'neutral', cssVariables: true },
    aliases: {
      components: '@/components',
      ui: '@/components/ui',
      utils: '@/lib/utils',
      lib: '@/lib',
      hooks: '@/hooks',
    },
  };
  const configPath = path.join(dir, 'components.json');
  await writeFile(configPath, JSON.stringify(config, null, 2));
  await pnpm(['exec', 'shadcn', 'add', 'button', 'input', '--yes', '--cwd', dir]);
  const hostPaths = [
    'src/components/ui/button.tsx',
    'src/components/ui/input.tsx',
    'src/lib/utils.ts',
    'src/host.css',
  ];
  const hashes = async () =>
    Object.fromEntries(
      await Promise.all(
        hostPaths.map(async (file) => [
          file,
          createHash('sha256')
            .update(await readFile(path.join(dir, file)))
            .digest('hex'),
        ]),
      ),
    );
  const beforeFiles = await hashes();
  await writeFile(path.join(dir, 'src/hextech-install.css'), '@import "tailwindcss";\n');
  await writeFile(
    configPath,
    JSON.stringify(
      {
        ...config,
        tailwind: { ...config.tailwind, css: 'src/hextech-install.css' },
        aliases: {
          components: '@/components/hextech',
          ui: '@/components/hextech',
          utils: '@/lib/hextech/cn',
          lib: '@/lib/hextech',
          hooks: '@/hooks/hextech',
        },
      },
      null,
      2,
    ),
  );
  await pnpm([
    'exec',
    'shadcn',
    'add',
    ...[
      'dialog',
      'input-group',
      'checkbox-group',
      'fieldset',
      'button-group',
      'meter',
      'avatar-group',
      'item',
    ].map((name) => `${origin}/r/${name}.json`),
    '--yes',
    '--cwd',
    dir,
  ]);
  await writeFile(configPath, JSON.stringify(config, null, 2));
  assert.deepEqual(await hashes(), beforeFiles, 'Hextech installation overwrote host files');
  await writeFile(
    path.join(dir, 'index.html'),
    '<html lang="en"><head><title>shadcn coexistence</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
  );
  const hostSource = `import {useState} from 'react';import {createRoot} from 'react-dom/client';import {Button as HostButton} from '@/components/ui/button';import {Input as HostInput} from '@/components/ui/input';import './host.css';
function Host(){const[count,setCount]=useState(0);return <section id="host" className="grid gap-2 font-sans" style={{width:400}}><HostButton id="host-button" onClick={()=>setCount(count+1)}>Host count {count}</HostButton><HostInput id="host-input" aria-label="Host name" defaultValue="Host theme"/></section>;}
`;
  const mixedSource = `import {ThemeScope} from '@/lib/hextech/theme-scope';import {Button} from '@/components/hextech/button';import {InputGroup,InputGroupInput} from '@/components/hextech/input-group';import {Dialog,DialogTrigger,DialogContent,DialogTitle,DialogClose} from '@/components/hextech/dialog';
function Island({mode}:{mode:'light'|'dark'}){return <ThemeScope colorMode={mode} id={'island-'+mode} className="grid gap-2 p-4 bg-hx-background text-hx-foreground" style={{maxWidth:400}}><InputGroup><InputGroupInput aria-label={mode+' Hextech name'} defaultValue="Starlight"/></InputGroup><Dialog><DialogTrigger>{'Open '+mode+' settings'}</DialogTrigger><DialogContent><DialogTitle>{mode+' scoped settings'}</DialogTitle><DialogClose>{'Close '+mode+' settings'}</DialogClose></DialogContent></Dialog></ThemeScope>;}
`;
  const tailwind = (
    await import(
      pathToFileURL(path.join(dir, 'node_modules/@tailwindcss/vite/dist/index.mjs')).href
    )
  ).default;
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  const readings = [];
  await writeFile(
    path.join(dir, 'src/mixed.css'),
    "@import './host.css';\n@import './styles/hextech-tokens.css';\n@import './styles/hextech-theme.css';\n@import './styles/hextech-tailwind.css';\n@import './styles/hextech-components.css';\n",
  );
  for (const mixed of [false, true]) {
    await writeFile(
      path.join(dir, 'src/main.tsx'),
      (mixed ? hostSource.replace("import './host.css'", "import './mixed.css'") : hostSource) +
        (mixed ? mixedSource : '') +
        `createRoot(document.getElementById('root')!).render(<><Host/>${mixed ? '<Island mode="dark"/><Island mode="light"/>' : ''}</>);`,
    );
    await run(process.execPath, [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '-p',
      path.join(dir, 'tsconfig.json'),
    ]);
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
    viteServer = await preview({
      root: dir,
      configFile: false,
      preview: { host: '127.0.0.1', port: 4186, strictPort: true },
      logLevel: 'warn',
    });
    await page.goto('http://127.0.0.1:4186');
    await page.getByRole('button', { name: 'Host count 0', exact: true }).click();
    await page.getByRole('button', { name: 'Host count 1', exact: true }).waitFor();
    await page.mouse.move(0, 0);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#host').evaluate(async (element) => {
      await Promise.all(
        element
          .getAnimations({ subtree: true })
          .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
          .map((animation) => animation.finished.catch(() => undefined)),
      );
    });
    readings.push(
      await page.evaluate(() =>
        Object.fromEntries(
          ['host-button', 'host-input', 'host'].map((id) => {
            const el = document.getElementById(id);
            const style = getComputedStyle(el);
            return [
              id,
              {
                color: style.color,
                background: style.backgroundColor,
                font: style.fontFamily,
                fontSize: style.fontSize,
                gap: style.gap,
                padding: style.padding,
                height: el.getBoundingClientRect().height,
              },
            ];
          }),
        ),
      ),
    );
    if (mixed) {
      assert.deepEqual(
        readings[1],
        readings[0],
        'Hextech imports changed the host component styles',
      );
      for (const mode of ['dark', 'light']) {
        const input = page.getByRole('textbox', { name: mode + ' Hextech name', exact: true });
        await expect(input).toHaveCSS('font-size', '12px');
        await expect(input).toHaveCSS('font-family', /Barlow/);
        assert.equal(
          await input.evaluate((el) => el.closest('[role="group"]').getBoundingClientRect().height),
          36,
          'Scoped spacing must retain a 36px input group',
        );
        const trigger = page.getByRole('button', {
          name: 'Open ' + mode + ' settings',
          exact: true,
        });
        await trigger.click();
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        assert.equal(
          await dialog.evaluate((el) =>
            el.closest('[data-color-mode]')?.getAttribute('data-color-mode'),
          ),
          mode,
        );
        await page
          .getByRole('button', { name: 'Close ' + mode + ' settings', exact: true })
          .click();
        await expect(trigger).toBeFocused();
      }
      await page.screenshot({
        path: path.join(artifacts, 'coexistence-mixed-desktop.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      // A deliberately 400px host fixture is excluded from the Hextech mobile width contract.
      for (const mode of ['dark', 'light'])
        assert((await page.locator('#island-' + mode).boundingBox()).width <= 390);
    }
    await new Promise((resolve) => viteServer.httpServer.close(resolve));
    viteServer = undefined;
  }
  assert.equal(await registrySourceDigest(), digest, 'Registry source changed during verification');
  await writeFile(
    path.join(artifacts, 'coexistence-result.json'),
    JSON.stringify(
      {
        passed: true,
        digest,
        consumer: dir,
        hostFilesPreserved: true,
        hostStylesBefore: readings[0],
        hostStylesAfter: readings[1],
        scopedPortals: ['dark', 'light'],
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'Actual shadcn components and installed Hextech source coexist: host files/styles unchanged, scoped geometry and portal focus verified.',
  );
} finally {
  await browser?.close();
  if (viteServer) await new Promise((resolve) => viteServer.httpServer.close(resolve));
  server.kill();
}

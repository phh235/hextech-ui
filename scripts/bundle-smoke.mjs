import assert from 'node:assert/strict';
import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { build, preview } from 'vite';
import { chromium } from '@playwright/test';
import { artifacts, root, pnpm } from './process.mjs';
import { createFixture } from './fixture.mjs';
const metadata = JSON.parse(await readFile(path.join(root, 'packages/react/package.json'), 'utf8'));
const archive = path.join(artifacts, 'packs', `hextech-ui-react-${metadata.version}.tgz`);
await pnpm(['pack', '--pack-destination', path.dirname(archive)], {
  cwd: path.join(root, 'packages/react'),
});
const dir = await createFixture('bundle', true, {
  '@hextech-ui/react': `file:${archive.replaceAll('\\', '/')}`,
  vite: '8.3.4',
});
for (const dependency of [
  'lexical',
  '@tanstack/charts',
  '@tanstack/react-table',
  '@tanstack/react-virtual',
])
  await assert.rejects(
    access(path.join(dir, 'node_modules', dependency)),
    `${dependency} should not be installed for basic controls`,
  );
await writeFile(
  path.join(dir, 'index.html'),
  '<html lang="en" data-hextech-ui-theme="hextech" data-color-mode="dark"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Packed component consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
);
const results = [];
for (const entry of ['@hextech-ui/react/button', '@hextech-ui/react']) {
  await writeFile(
    path.join(dir, 'src/main.tsx'),
    `import {createRoot} from 'react-dom/client';\nimport {useState} from 'react';\nimport {Button} from '${entry}';\nimport '@hextech-ui/react/styles.css';\nfunction App(){const[count,setCount]=useState(0);return <main style={{padding:24}}><h1>Packed React consumer</h1><Button onClick={()=>setCount(count+1)}>Packed count {count}</Button></main>;}\ncreateRoot(document.getElementById('root')!).render(<App/>);`,
  );
  const bundle = await build({
    root: dir,
    configFile: false,
    logLevel: 'warn',
    build: {
      write: false,
      minify: true,
      rolldownOptions: {
        onLog(level, log, handler) {
          if (log.code !== 'MODULE_LEVEL_DIRECTIVE') handler(level, log);
        },
      },
    },
  });
  const output = (Array.isArray(bundle) ? bundle[0] : bundle).output;
  const modules = [
    ...new Set(
      output
        .filter((item) => item.type === 'chunk')
        .flatMap((chunk) =>
          Object.entries(chunk.modules)
            .filter(([, value]) => value.renderedLength > 0)
            .map(([name]) => name),
        ),
    ),
  ];
  assert(
    !modules.some((name) => /lexical|@tanstack[+/]|next\//.test(name)),
    'Basic button bundle included an optional engine or Next.js',
  );
  const bytes = output
    .filter((item) => item.type === 'chunk')
    .reduce((sum, chunk) => sum + Buffer.byteLength(chunk.code), 0);
  const gzipBytes = output
    .filter((item) => item.type === 'chunk')
    .reduce((sum, chunk) => sum + gzipSync(chunk.code).length, 0);
  results.push({
    entry,
    javascriptBytesIncludingReact: bytes,
    gzipBytesIncludingReact: gzipBytes,
    renderedModules: modules.length,
    optionalEngineModules: 0,
  });
}
await build({
  root: dir,
  configFile: false,
  logLevel: 'warn',
  build: {
    outDir: 'dist',
    rolldownOptions: {
      onLog(level, log, handler) {
        if (log.code !== 'MODULE_LEVEL_DIRECTIVE') handler(level, log);
      },
    },
  },
});
const serving = await preview({
  root: dir,
  configFile: false,
  preview: { host: '127.0.0.1', port: 4179, strictPort: true },
});
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  const failedFonts = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (/\.woff2?(?:\?|$)/.test(response.url()) && !response.ok()) failedFonts.push(response.url());
  });
  await page.goto('http://127.0.0.1:4179');
  const button = page.getByRole('button', { name: 'Packed count 0' });
  await button.click();
  assert(await page.getByRole('button', { name: 'Packed count 1' }).isVisible());
  await page.mouse.move(0, 0);
  const style = await page.getByRole('button', { name: 'Packed count 1' }).evaluate((node) => {
    const css = getComputedStyle(node);
    return {
      border: css.borderTopColor,
      minHeight: css.minHeight,
      background: css.backgroundImage,
      font: css.fontFamily,
    };
  });
  assert.equal(style.border, 'rgba(0, 0, 0, 0)');
  assert.equal(parseFloat(style.minHeight), 36);
  assert.match(style.background, /rgb\(120, 90, 40\).*rgb\(200, 155, 60\)/);
  assert.match(style.font, /Cinzel/);
  const loadedFonts = await page.evaluate(async () => {
    const groups = await Promise.all([
      document.fonts.load('700 16px Cinzel'),
      document.fonts.load('500 12px Barlow'),
    ]);
    return groups.map((fonts) =>
      fonts.map((font) => ({ family: font.family, status: font.status })),
    );
  });
  assert(
    loadedFonts.every((group) => group.length && group.every((font) => font.status === 'loaded')),
    'Packed fonts did not load',
  );
  assert.deepEqual(failedFonts, []);
  assert.deepEqual(errors, []);
  await context.close();
} finally {
  await browser.close();
  await new Promise((resolve) => serving.httpServer.close(resolve));
}
await writeFile(
  path.join(artifacts, 'bundle-smoke-result.json'),
  JSON.stringify(
    {
      passed: true,
      consumer: dir,
      results,
      optionalPeersAbsent: true,
      browserStyledInteraction: true,
      completedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(results, null, 2));

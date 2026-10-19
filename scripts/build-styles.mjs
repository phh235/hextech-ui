import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
const dir = fileURLToPath(new URL('../packages/react/', import.meta.url));
const input = await readFile(
  new URL('../packages/react/src/tailwind.css', import.meta.url),
  'utf8',
);
const result = await postcss([tailwind({ base: dir, optimize: true })]).process(input, {
  from: `${dir}/src/tailwind.css`,
  to: `${dir}/dist/styles.css`,
});
// Tailwind rebases dependency font URLs to the workspace node_modules directory.
// A tarball must instead carry the unmodified fonts and their original notices.
const outputPath = path.join(dir, 'dist/styles.css');
const portable = postcss.parse(result.css, { from: outputPath });
// Standalone CSS must not reset a host application's generic Tailwind theme variables.
portable.walkRules((rule) => {
  if (
    rule.parent?.type === 'atrule' &&
    rule.parent.name === 'layer' &&
    rule.parent.params === 'theme' &&
    rule.selector.includes(':root')
  ) {
    rule.selector = '[data-hextech-ui-theme="hextech"]';
  }
});
const assets = new Map();
portable.walkAtRules('font-face', (face) => {
  face.walkDecls('src', (declaration) => {
    declaration.value = declaration.value.replace(
      /url\((['"]?)([^'"()]+)\1\)/g,
      (url, quote, source) => {
        if (!/\.(woff2?|ttf|otf)$/.test(source)) throw new Error(`Unexpected font URL: ${source}`);
        const filename = path.basename(source);
        if (!/^(barlow|cinzel)-latin-\d+-normal\.woff2?$/.test(filename))
          throw new Error(`Unexpected font asset: ${filename}`);
        assets.set(filename, path.resolve(path.dirname(outputPath), source));
        return `url(./fonts/${filename})`;
      },
    );
  });
});
const fontDir = path.join(dir, 'dist/fonts');
await mkdir(fontDir, { recursive: true });
await Promise.all([...assets].map(([name, source]) => copyFile(source, path.join(fontDir, name))));
for (const family of ['barlow', 'cinzel']) {
  await copyFile(
    new URL(`../packages/themes/node_modules/@fontsource/${family}/LICENSE`, import.meta.url),
    path.join(fontDir, `${family}-OFL.txt`),
  );
}
const css = portable.toString();
if (css.includes('.pnpm/') || css.includes('.pnpm\\'))
  throw new Error('Workspace paths leaked into standalone CSS');
await writeFile(outputPath, css);
console.log(
  `Compiled standalone library CSS: ${Buffer.byteLength(css)} bytes; ${assets.size} portable font assets with OFL notices`,
);

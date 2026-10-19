import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
import { componentExampleCode } from '../apps/web/lib/component-usage.ts';
import { updateComponentDoc } from './lib/component-docs.mjs';
async function writeIfChanged(file, content) {
  try {
    if ((await readFile(file, 'utf8')) === content) return;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await writeFile(file, content);
}
const manifest = JSON.parse(await readFile('packages/react/component-manifest.json', 'utf8'));
await mkdir('apps/web/content/docs/components', { recursive: true });
const formattedExamples = {};
for (const item of manifest) {
  formattedExamples[item.name] = await format(
    componentExampleCode(item.name, item.kind, 'registry'),
    { parser: 'typescript', singleQuote: true, printWidth: 80 },
  );
  const destination = 'apps/web/content/docs/components/' + item.name + '.mdx';
  let existing = '';
  try {
    existing = await readFile(destination, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const body = updateComponentDoc(existing, item);
  await writeIfChanged(
    destination,
    await format(body, { ...(await resolveConfig(destination)), filepath: destination }),
  );
}
await writeIfChanged(
  'apps/web/lib/formatted-component-examples.json',
  JSON.stringify(formattedExamples, null, 2) + '\n',
);
await writeIfChanged(
  'apps/web/content/docs/components/meta.json',
  JSON.stringify(
    {
      title: 'Components',
      pages: [...manifest]
        .sort((a, b) => a.title.localeCompare(b.title, 'en'))
        .map((item) => item.name),
    },
    null,
    2,
  ) + '\n',
);
console.log(`Generated ${manifest.length} component reference pages.`);

// The runnable file is also the copyable source: no separately maintained snippets.
const usageExamples = {};
for (const file of (await readdir('apps/web/components/examples')).filter((file) =>
  file.endsWith('.tsx'),
)) {
  const name = file.slice(0, -4);
  usageExamples[name] = await format(
    (await readFile(`apps/web/components/examples/${file}`, 'utf8')).replaceAll(
      '@hextech-ui/react/',
      '@/components/ui/',
    ),
    { parser: 'typescript', singleQuote: true, printWidth: 80 },
  );
}
await writeIfChanged(
  'apps/web/lib/usage-example-sources.json',
  JSON.stringify(usageExamples, null, 2) + '\n',
);

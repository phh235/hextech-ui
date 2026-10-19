import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';
import { componentExampleCode } from '../apps/web/lib/component-usage.ts';
const manifest = JSON.parse(await readFile('packages/react/component-manifest.json', 'utf8'));
await mkdir('apps/web/content/docs/components', { recursive: true });
const formattedExamples = {};
for (const item of manifest) {
  formattedExamples[item.name] = await format(
    componentExampleCode(item.name, item.kind, 'registry'),
    { parser: 'typescript', singleQuote: true, printWidth: 80 },
  );
  const destination = 'apps/web/content/docs/components/' + item.name + '.mdx';
  const body =
    '---\ntitle: ' +
    item.title +
    '\ndescription: ' +
    JSON.stringify(item.description) +
    '\n---\n\n<CatalogPreview name="' +
    item.name +
    '" />\n\n## Installation\n\n<RegistryInstallCommand name="' +
    item.name +
    '" />\n';
  await writeFile(
    destination,
    await format(body, { ...(await resolveConfig(destination)), filepath: destination }),
  );
}
await writeFile(
  'apps/web/lib/formatted-component-examples.json',
  JSON.stringify(formattedExamples, null, 2) + '\n',
);
await writeFile(
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

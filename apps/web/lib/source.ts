import { docs } from '../.source/server';
import { loader, llms } from 'fumadocs-core/source';
import { registryInstallCommand } from './site';
import manifest from '../../../packages/react/component-manifest.json';
import formattedExamples from './formatted-component-examples.json';
import usageExamples from './usage-example-sources.json';

export const source = loader({ baseUrl: '/docs', source: docs.toFumadocsSource() });

export const docsPages = () => source.getPages().filter((page) => page.slugs[0] !== 'blocks');
export const docsLlms = llms(
  { ...source, getPages: () => docsPages() },
  {
    renderPage: async (page) => {
      const heading = '# ' + page.data.title + ' (' + page.url + ')\n\n';
      if (page.slugs.length === 1 && page.slugs[0] === 'components')
        return (
          heading +
          [...manifest]
            .sort((a, b) => a.title.localeCompare(b.title, 'en'))
            .map((item) => '- [' + item.title + '](/docs/components/' + item.name + ')')
            .join('\n')
        );
      const content = (await page.data.getText('processed'))
        .replace(
          /<RegistryInstallCommand\s+name="([a-z0-9-]+)"\s*\/>/g,
          (_, name: string) => '```bash\n' + registryInstallCommand(name) + '\n```',
        )
        .replace(/<CatalogPreview\s+name="([a-z0-9-]+)"\s*\/>/g, (tag, name: string) => {
          const code = formattedExamples[name as keyof typeof formattedExamples];
          return code ? '```tsx\n' + code + '```' : tag;
        });
      const complete = content
        .replace(/<UsagePreview\s+name="([a-z0-9-]+)"\s*\/>/g, (tag, name: string) => {
          const code = usageExamples[name as keyof typeof usageExamples];
          return code ? '```tsx\n' + code + '```' : tag;
        })
        .replace(/\{\/\* (?:BEGIN|END) GENERATED REFERENCE \*\/\}/g, '');
      return heading + complete;
    },
  },
);

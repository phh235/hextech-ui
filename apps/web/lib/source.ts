import { docs } from '../.source/server';
import { loader, llms } from 'fumadocs-core/source';
import { registryInstallCommand } from './site';
import manifest from '../../../packages/react/component-manifest.json';
import formattedExamples from './formatted-component-examples.json';

export const source = loader({ baseUrl: '/docs', source: docs.toFumadocsSource() });

export const docsPages = () => source.getPages().filter((page) => page.slugs[0] !== 'blocks');
export const docsLlms = llms(
  { ...source, getPages: () => docsPages() },
  {
    renderPage: async (page) => {
      const item =
        page.slugs[0] === 'components'
          ? manifest.find((item) => item.name === page.slugs[1])
          : undefined;
      const heading = '# ' + page.data.title + ' (' + page.url + ')\n\n';
      if (item) {
        const code = formattedExamples[item.name as keyof typeof formattedExamples];
        const api = item.api
          .map((row) => '| ' + row.map((value) => value.replaceAll('|', '\\|')).join(' | ') + ' |')
          .join('\n');
        return (
          heading +
          item.description +
          '\n\n## Example\n\n' +
          String.fromCharCode(96).repeat(3) +
          'tsx\n' +
          code +
          String.fromCharCode(96).repeat(3) +
          '\n\n## Installation\n\n```bash\n' +
          registryInstallCommand(item.name) +
          '\n```\n\n## API\n\n| Prop | Type | Default |\n| --- | --- | --- |\n' +
          api +
          '\n\n' +
          ('notes' in item ? item.notes?.join('\n\n') : '')
        );
      }
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
      return heading + content;
    },
  },
);

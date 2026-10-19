import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { codeHighlightOptions } from './lib/code-highlight';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: { postprocess: { includeProcessedMarkdown: true } },
});
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: codeHighlightOptions,
  },
});

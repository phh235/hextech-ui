import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';
export const { GET } = createFromSource({
  ...source,
  getPages: (...args: Parameters<typeof source.getPages>) =>
    source.getPages(...args).filter((page) => !page.url.startsWith('/docs/blocks')),
});

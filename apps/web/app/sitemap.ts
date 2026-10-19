import type { MetadataRoute } from 'next';
import { docsPages } from '@/lib/source';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [...new Set(['/', ...docsPages().map((page) => page.url)])].map((path) => ({
    url: path === '/' ? siteUrl : new URL(path, siteUrl).href,
  }));
}

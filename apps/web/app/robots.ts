import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Allow crawling so noindex metadata/headers on internal and machine routes can be read.
  return { rules: { userAgent: '*', allow: '/' }, sitemap: new URL('/sitemap.xml', siteUrl).href };
}

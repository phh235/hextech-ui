import { createMDX } from 'fumadocs-mdx/next';
import { fileURLToPath } from 'node:url';
import { registryOrigin, siteUrl } from './lib/site.ts';

const withMDX = createMDX();
export default withMDX({
  reactStrictMode: true,
  devIndicators: false,
  env: {
    NEXT_PUBLIC_REGISTRY_URL:
      process.env.NEXT_PUBLIC_REGISTRY_URL || (process.env.VERCEL ? siteUrl : registryOrigin),
  },
  async headers() {
    const paths =
      process.env.VERCEL_ENV === 'preview'
        ? ['/:path*']
        : [
            '/internal/:path*',
            '/r/:path*',
            '/api/:path*',
            '/docs/:path*.md',
            '/llms.txt',
            '/llms-full.txt',
            '/llms.mdx/:path*',
          ];
    return paths.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    }));
  },
  async rewrites() {
    return [{ source: '/docs/:slug*.md', destination: '/llms.mdx/docs/:slug*/content.md' }];
  },
  poweredByHeader: false,
  turbopack: { root: fileURLToPath(new URL('../..', import.meta.url)) },
  transpilePackages: ['@hextech-ui/react', '@hextech-ui/utils'],
});

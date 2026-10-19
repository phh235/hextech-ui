/** Maintainer-supplied destinations shared by the website and registry build. */
export const defaultSiteUrl = 'https://hextech-ui.vercel.app';
export const supportUrl = 'https://ko-fi.com/phh235';

function origin(value: string, variable: string) {
  const url = new URL(value);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  )
    throw new Error(`${variable} must be an HTTP(S) origin`);
  return url.origin;
}

export const siteUrl = origin(
  process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl,
  'NEXT_PUBLIC_SITE_URL',
);
export const registryOrigin = origin(
  process.env.NEXT_PUBLIC_REGISTRY_URL || 'http://127.0.0.1:3000',
  'NEXT_PUBLIC_REGISTRY_URL',
);

const configured =
  process.env.NEXT_PUBLIC_REPOSITORY_URL?.trim() || 'https://github.com/phh235/hextech-ui';
export const repositoryUrl =
  configured && /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/.test(configured)
    ? configured.replace(/\/$/, '')
    : null;

export function registryInstallCommand(name: string) {
  return `npx shadcn@latest add ${registryOrigin}/r/${name}.json`;
}

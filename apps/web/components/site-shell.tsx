'use client';
import { usePathname } from 'next/navigation';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { ReactNode } from 'react';
import { SoundToggle } from './interaction-sounds';
import { Brand } from './wordmark';
import { GitHubIcon } from './github-button';
import { repositoryUrl } from '@/lib/site';
export function SiteShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/docs' || pathname.startsWith('/docs/')) return children;
  return (
    <HomeLayout
      nav={{ title: <Brand />, url: '/' }}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Components', url: '/docs/components' },
        { text: 'Themes', url: '/docs/theming' },
        {
          type: 'custom',
          on: 'nav',
          secondary: true,
          children: (
            <li>
              <SoundToggle />
            </li>
          ),
        },
        { type: 'custom', on: 'menu', secondary: true, children: <SoundToggle /> },
        ...(repositoryUrl
          ? [
              {
                type: 'icon' as const,
                text: 'GitHub',
                label: 'GitHub',
                icon: <GitHubIcon />,
                url: repositoryUrl,
              },
            ]
          : []),
      ]}
      themeSwitch={{ enabled: true, mode: 'light-dark' }}
      searchToggle={{
        sm: { 'aria-label': 'Search documentation' },
        full: { 'aria-label': 'Search documentation' },
      }}
    >
      {children}
      {footer}
    </HomeLayout>
  );
}

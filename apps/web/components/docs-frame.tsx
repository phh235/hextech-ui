'use client';
import { DocsAI as DocsLayout } from './docs-ai';
import type { Item, Root } from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import Link from 'next/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { repositoryUrl, supportUrl } from '@/lib/site';
import { GitHubButton } from './github-button';
import { SoundToggle } from './interaction-sounds';
import { Brand } from './wordmark';

function SidebarControls() {
  return (
    <div className="flex items-center justify-between gap-3" data-docs-controls>
      <div className="flex items-center gap-1">
        {repositoryUrl && (
          <GitHubButton
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="size-9"
          />
        )}
        <Link
          href={supportUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support on Ko-fi"
          title="Support on Ko-fi"
          className={buttonVariants({ variant: 'ghost', className: 'h-9 px-2 text-sm' })}
        >
          Support
        </Link>
      </div>
      <div className="flex items-center gap-1">
        <SoundToggle />
        <ThemeSwitch mode="light-dark" />
      </div>
    </div>
  );
}

export function DocsFrame({ tree, children }: { tree: Root; children: ReactNode }) {
  const componentIndex: Item = { type: 'page', name: 'All Components', url: '/docs/components' };
  return (
    <DocsLayout
      tree={{
        ...tree,
        children: tree.children.flatMap((node) =>
          node.type === 'folder' && node.name === 'Components'
            ? [componentIndex, ...node.children]
            : [node],
        ),
      }}
      nav={{ title: <Brand />, url: '/' }}
      tabs={false}
      sidebar={{ defaultOpenLevel: 1, footer: <SidebarControls /> }}
      searchToggle={{
        sm: { 'aria-label': 'Search documentation' },
        full: { 'aria-label': 'Search documentation' },
      }}
      themeSwitch={{ enabled: false }}
      containerProps={{ className: 'docs-site [--fd-layout-width:100%]' }}
    >
      {children}
    </DocsLayout>
  );
}

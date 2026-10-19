import type { ReactNode } from 'react';
import { DocsFrame } from '@/components/docs-frame';
import { source } from '@/lib/source';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <DocsFrame tree={source.pageTree}>{children}</DocsFrame>;
}

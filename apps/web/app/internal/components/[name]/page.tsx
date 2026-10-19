import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsPage, DocsTitle, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { DocsFrame } from '@/components/docs-frame';
import { CatalogPreview } from '@/components/catalog-preview';
import { source } from '@/lib/source';
import manifest from '../../../../../../packages/react/component-manifest.json';

export const metadata: Metadata = {
  title: 'Component verification',
  robots: { index: false, follow: false },
};

export default async function ComponentVerification({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const item = manifest.find((item) => item.name === name);
  if (!item) notFound();
  return (
    <DocsFrame tree={source.pageTree}>
      <DocsPage toc={[]} tableOfContent={{ enabled: false }} className="w-full max-w-[900px]">
        <DocsTitle>{item.title}</DocsTitle>
        <DocsBody>
          <CatalogPreview name={name} internal />
        </DocsBody>
      </DocsPage>
    </DocsFrame>
  );
}

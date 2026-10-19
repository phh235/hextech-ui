import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { source } from '@/lib/source';
import { pageMetadata } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { StructuredData } from '@/components/structured-data';
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { InstallCommand, RegistryInstallCommand } from '@/components/copy-button';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { CatalogPreview } from '@/components/catalog-preview';
import { UsagePreview } from '@/components/usage-preview';
import { ComponentGallery } from '@/components/component-gallery';
import { BlockGallery } from '@/components/block-gallery';
import { BlockPreview } from '@/components/block-preview';

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const Content = page.data.body;
  const markdownUrl = page.slugs.length ? `${page.url}.md` : '/docs/index.md';
  const componentPage = slug?.[0] === 'components' && slug.length > 1;
  const ancestors = [
    { name: 'Home', path: '/' },
    ...Array.from({ length: page.slugs.length }, (_, index) =>
      source.getPage(page.slugs.slice(0, index)),
    )
      .filter((parent) => parent !== undefined)
      .map((parent) => ({ name: parent.data.title, path: parent.url })),
    { name: page.data.title, path: page.url },
  ];
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: ancestors.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: new URL(entry.path, siteUrl).href,
    })),
  };
  return (
    <DocsPage
      className="w-full max-w-[900px]"
      id="main-content"
      toc={page.data.toc}
      tableOfContent={{ enabled: !componentPage, style: 'clerk' }}
    >
      <StructuredData data={breadcrumbs} />
      <div className="docs-page-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <DocsTitle>{page.data.title}</DocsTitle>
          <div className="flex items-center gap-1">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
            <ViewOptionsPopover markdownUrl={markdownUrl} />
          </div>
        </div>
        {!componentPage && (
          <DocsDescription className="mb-0 mt-4 text-base leading-7">
            {page.data.description}
          </DocsDescription>
        )}
      </div>
      <DocsBody>
        <Content
          components={{
            ...defaultMdxComponents,
            InstallCommand,
            RegistryInstallCommand,
            Step,
            Steps,
            Tab,
            Tabs,
            CatalogPreview,
            UsagePreview,
            ComponentGallery,
            BlockGallery,
            BlockPreview,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return pageMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    index: page.slugs[0] !== 'blocks',
  });
}

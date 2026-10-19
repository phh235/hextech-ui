import type { Metadata } from 'next';
import { siteUrl } from './site';

export const siteName = 'Hextech UI';
export const siteTitle = 'Hextech UI — League-inspired components. Open by design.';
export const siteDescription =
  'League-inspired React components you can customize and own. Accessible primitives, editable source and light/dark themes, built with Base UI and Tailwind CSS.';
export const allowIndexing = process.env.VERCEL_ENV !== 'preview';

const image = {
  url: new URL('/opengraph-image.png', siteUrl).href,
  width: 1200,
  height: 630,
  alt: 'Hextech UI — Hexcore logo. League-inspired components. Open by design.',
};

export function socialMetadata(title: string, description: string): Metadata {
  return {
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
      locale: 'en_US',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

export function pageMetadata({
  title,
  description = siteDescription,
  path,
  index = true,
}: {
  title: string;
  description?: string | undefined;
  path: string;
  index?: boolean;
}): Metadata {
  const canonical = path === '/' ? siteUrl : new URL(path, siteUrl).href;
  const social = socialMetadata(
    title === siteTitle ? title : `${title} · ${siteName}`,
    description,
  );
  return {
    ...social,
    title: title === siteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: { ...social.openGraph, url: canonical },
    ...(!index && {
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    }),
  };
}

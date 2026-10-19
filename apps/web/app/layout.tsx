import { Analytics } from '@vercel/analytics/next';
import { InteractionSounds } from '@/components/interaction-sounds';
import { SiteFooter } from '@/components/site-footer';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { SiteShell } from '@/components/site-shell';
import { siteUrl } from '@/lib/site';
import { allowIndexing, siteName, siteTitle, siteDescription, socialMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...socialMetadata(siteTitle, siteDescription),
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: { default: siteTitle, template: '%s · Hextech UI' },
  description: siteDescription,
  robots: {
    index: allowIndexing,
    follow: true,
    googleBot: { index: allowIndexing, follow: true, 'max-image-preview': 'large' },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className="dark"
      data-hextech-ui-theme="hextech"
      data-color-mode="dark"
      suppressHydrationWarning
    >
      <body>
        <RootProvider
          theme={{
            attribute: ['class', 'data-color-mode'],
            storageKey: 'hextech-ui-color-mode',
            defaultTheme: 'dark',
            themes: ['light', 'dark'],
            enableSystem: false,
            hotKey: false,
          }}
        >
          <InteractionSounds />
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteShell footer={<SiteFooter />}>{children}</SiteShell>
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}

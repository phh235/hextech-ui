import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hextech UI',
    short_name: 'Hextech UI',
    description: 'League-inspired components. Open by design.',
    start_url: '/',
    display: 'browser',
    background_color: '#010a13',
    theme_color: '#010a13',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/brand/favicons/app-192.png', sizes: '192x192', type: 'image/png' },
      {
        src: '/brand/favicons/app-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

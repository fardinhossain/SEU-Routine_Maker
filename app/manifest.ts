import type { MetadataRoute } from 'next';

const iconVersion = '2026-07-10';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEU Routine Maker',
    short_name: 'SEU Routine',
    description: 'Create a clash-free Southeast University class routine from UMS HTML, PDF, or screenshots.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#E1DCC9',
    prefer_related_applications: false,
    icons: [
      {
        src: `/favicon-192.png?v=${iconVersion}`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `/icon-512.png?v=${iconVersion}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `/icon-512.png?v=${iconVersion}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `/apple-touch-icon.png?v=${iconVersion}`,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

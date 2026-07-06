import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SEU Routine Maker',
    short_name: 'SEU Routine',
    description: 'Create a clash-free Southeast University class routine from UMS HTML, PDF, or screenshots.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#091326',
    theme_color: '#20ded6',
    icons: [
      {
        src: '/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}

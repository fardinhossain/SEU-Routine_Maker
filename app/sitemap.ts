import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seuroutine.vercel.app';
  const lastModified = new Date('2026-07-06');

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/organizer`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

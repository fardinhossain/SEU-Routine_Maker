import type { Metadata } from 'next';

import App from '../src/App';

const title = 'SEU Routine Maker - Free Class Schedule for SEU Students';
const description = 'Create your SEU routine free from Southeast University UMS HTML or screenshots. Organize sections, detect class clashes, and export a printable weekly routine.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'SEU routine',
    'SEU routine maker',
    'SEU class routine',
    'SEU schedule maker',
    'SEU timetable',
    'SEU course schedule',
    'Southeast University routine',
    'SEU rotine',
    'SU routine',
    'SU rotine',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SEU Routine Maker',
    locale: 'en_US',
    title,
    description,
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'SEU Routine Maker weekly class schedule preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.jpg'],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://seuroutine.vercel.app/#website',
      url: 'https://seuroutine.vercel.app/',
      name: 'SEU Routine Maker',
      alternateName: ['SEU Routine', 'Southeast University Routine Maker', 'seuroutine.vercel.app'],
      creator: { '@id': 'https://seuroutine.vercel.app/#creator' },
      inLanguage: 'en',
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://seuroutine.vercel.app/#application',
      url: 'https://seuroutine.vercel.app/',
      name: 'SEU Routine Maker',
      alternateName: 'SEU Routine',
      description,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'BDT',
      },
      featureList: [
        'Import Southeast University UMS HTML and MHTML files',
        'Detect conflicting class times',
        'Organize available course sections',
        'Create and export a weekly SEU class routine',
      ],
      creator: { '@id': 'https://seuroutine.vercel.app/#creator' },
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': 'https://seuroutine.vercel.app/#creator',
      name: 'Fardin Hossain',
      url: 'https://mdfardin.vercel.app/',
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        id="seu-routine-jsonld"
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <App />
    </>
  );
}

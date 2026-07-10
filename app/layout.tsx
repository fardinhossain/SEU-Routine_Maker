import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const iconVersion = '2026-07-10';

export const metadata: Metadata = {
  metadataBase: new URL('https://seuroutine.vercel.app'),
  title: {
    default: 'Routine Maker SEU - Class Routine Builder for SEU Students',
    template: '%s | SEU Routine Maker',
  },
  description: 'Routine Maker SEU helps Southeast University students create a clear, clash-free class routine from UMS HTML, PDFs, or screenshots.',
  applicationName: 'SEU Routine Maker',
  generator: 'SEU Routine Maker',
  creator: 'Fardin Hossain',
  publisher: 'SEU Routine Maker',
  authors: [{ name: 'Fardin Hossain', url: 'https://mdfardin.vercel.app/' }],
  category: 'education',
  keywords: [
    'SEU routine',
    'SEU routine maker',
    'routine maker seu',
    'Routine Maker SEU',
    'SEU class routine',
    'SEU schedule maker',
    'SEU timetable',
    'Southeast University routine',
    'Southeast University class routine',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      // Keep the conventional favicon URL stable for search-engine crawlers.
      // The larger browser/PWA icons remain versioned so normal browser caches
      // are still refreshed after a branding update.
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48' },
      { url: `/favicon.svg?v=${iconVersion}`, type: 'image/svg+xml', sizes: 'any' },
      { url: `/favicon-192.png?v=${iconVersion}`, type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: {
      url: `/apple-touch-icon.png?v=${iconVersion}`,
      type: 'image/png',
      sizes: '180x180',
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SEU Routine Maker',
    title: 'Routine Maker SEU - Class Routine Builder for SEU Students',
    description: 'Routine Maker SEU helps Southeast University students create a clear, clash-free class routine from UMS HTML, PDFs, or screenshots.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'SEU Routine Maker weekly class schedule preview',
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

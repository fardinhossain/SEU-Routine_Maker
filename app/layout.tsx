import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://seuroutine.vercel.app'),
  title: {
    default: 'SEU Routine Maker - Class Routine Builder for SEU Students',
    template: '%s | SEU Routine Maker',
  },
  description: 'Create a clear, clash-free SEU class routine from UMS HTML or screenshots with this free routine maker for Southeast University students.',
  applicationName: 'SEU Routine Maker',
  generator: 'SEU Routine Maker',
  creator: 'Fardin Hossain',
  publisher: 'SEU Routine Maker',
  authors: [{ name: 'Fardin Hossain', url: 'https://mdfardin.vercel.app/' }],
  category: 'education',
  keywords: [
    'SEU routine',
    'SEU routine maker',
    'SEU class routine',
    'SEU schedule maker',
    'SEU timetable',
    'Southeast University routine',
    'Southeast University class routine',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon-192.png',
    apple: {
      url: '/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'SEU Routine Maker',
    title: 'SEU Routine Maker - Class Routine Builder for SEU Students',
    description: 'Create a clear, clash-free SEU class routine from UMS HTML or screenshots with this free routine maker for Southeast University students.',
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

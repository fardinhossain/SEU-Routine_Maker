import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://seuroutine.vercel.app'),
  title: {
    default: 'SEU Routine Maker',
    template: '%s | SEU Routine Maker',
  },
  description: 'Create a clear, clash-free SEU class routine from UMS HTML or screenshots with this free routine maker for Southeast University students.',
  applicationName: 'SEU Routine Maker',
  icons: {
    icon: [
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    shortcut: '/favicon-192.png',
    apple: {
      url: '/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
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

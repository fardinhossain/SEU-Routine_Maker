import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://seuroutine.vercel.app'),
  title: 'SEU Routine Maker - Create Your Class Schedule Easily | SEU Students',
  description: 'Free SEU Routine Maker. Build clash-free class schedules, save and share your SEU semester routine in seconds. Perfect for Southeast University students. Import UMS HTML or use OCR from screenshots.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'SEU Routine Maker - Create Your Class Schedule Easily',
    description: 'Free SEU Routine Maker. Build clash-free class schedules from UMS HTML or screenshots. Made for Southeast University students.',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEU Routine Maker - Create Your Class Schedule Easily',
    description: 'Free SEU Routine Maker. Build clash-free class schedules from UMS HTML or screenshots.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

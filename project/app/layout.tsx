import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Master Strategist Collection — Timeless Wisdom, Modern Power',
  description:
    'An exclusive eBook bundle featuring Machiavelli\'s The Prince, Sun Tzu\'s The Art of War, and Marcus Aurelius\' Meditations. Master the art of power, strategy, and stoic resilience. Instant download. Pay with crypto.',
  keywords: [
    'Master Strategist Collection',
    'Machiavelli The Prince',
    'Sun Tzu Art of War',
    'Marcus Aurelius Meditations',
    'eBook bundle',
    'strategy books',
    'stoicism',
    'power and strategy',
    'classic philosophy eBooks',
    'crypto payment eBook',
    'instant digital download',
  ],
  authors: [{ name: 'The Master Strategist Collection' }],
  creator: 'The Master Strategist Collection',
  metadataBase: new URL('https://master-strategist.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Master Strategist Collection',
    description:
      'Three timeless classics. One transformative bundle. Master power, strategy, and stoic wisdom — Machiavelli, Sun Tzu, and Marcus Aurelius. Instant download via secure crypto payment.',
    url: 'https://master-strategist.com',
    siteName: 'The Master Strategist Collection',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'The Master Strategist Collection — Premium eBook Bundle',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Master Strategist Collection',
    description:
      'Three timeless classics. One transformative bundle. Master power, strategy, and stoic wisdom. Instant download via secure crypto payment.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: '#08080b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-ink-950 text-ink-100 antialiased`}>{children}</body>
    </html>
  );
}
export const metadata = {
  title: 'Master Strategist | Elite Collection',
  description: 'Unlock your potential with our digital collection.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: ['/og-image.png'],
  },
};

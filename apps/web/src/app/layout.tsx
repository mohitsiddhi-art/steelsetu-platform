import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { GlobalModalProvider } from '@/context/GlobalModalContext';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://steelsetu.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Steelsetu | B2B Industrial Steel Trading & Supply Platform',
    template: '%s | Steelsetu',
  },
  description:
    'Source TMT bars, MS pipes, GI/PPGL roofing sheets, plates and coils from verified Indian mills. Post your requirement and get verified supplier quotes across 25+ cities.',
  keywords: [
    'steel supplier India',
    'TMT bars Fe 500D',
    'PPGL roofing sheets',
    'MS pipes',
    'HR coil',
    'steel price India',
    'Burrabazar steel',
  ],
  authors: [{ name: 'Singhi Enterprises' }],
  creator: 'Singhi Enterprises',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Steelsetu',
    title: 'Steelsetu | Build the Right Connection. Source the Right Steel.',
    description:
      'A two-layer B2B steel marketplace — a cinematic catalogue of Indian mills and a verified supplier network for procurement teams.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steelsetu | B2B Industrial Steel Trading & Supply Platform',
    description:
      'Source TMT, pipes, roofing sheets, plates and coils from verified Indian mills.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#05060A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Sora:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-sora: 'Sora', sans-serif;
            --font-space-grotesk: 'Space Grotesk', sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased">
        <LanguageProvider>
          <GlobalModalProvider>
            {children}
          </GlobalModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
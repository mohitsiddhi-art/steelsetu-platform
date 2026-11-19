import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import MegaSearch from '@/components/marketing/MegaSearch';
import TrustShieldBar from '@/components/marketing/TrustShieldBar';
import PriceTicker from '@/components/marketing/PriceTicker';
import SplitMarketplace from '@/components/marketing/SplitMarketplace';
import CalculatorPreview from '@/components/marketing/CalculatorPreview';
import MandiBulletin from '@/components/marketing/MandiBulletin';
import MetricsSection from '@/components/marketing/MetricsSection';
import TestimonialsCarousel from '@/components/marketing/TestimonialsCarousel';
import FinalCta from '@/components/marketing/FinalCta';
import { getFeaturedProducts } from '@/services/catalogService';
import { getFeaturedBrands, getMarketRates } from '@/services/platformService';

export const instant = false;

export const metadata: Metadata = {
  title: 'Steelsetu | Pan-India B2B Industrial Steel Trading & Supply Platform',
  description:
    'Build the Right Connection. Source the Right Steel. Post one requirement and get verified quotes for TMT bars, MS pipes, GI/PPGL roofing sheets, plates and coils from Indian mills across 25+ cities.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [products, brands, rates] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedBrands(),
    getMarketRates(),
  ]);

  const showcaseBrands = brands.length > 0 ? brands : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://steelsetu.com/#organization',
        name: 'Steelsetu',
        legalName: 'Singhi Enterprises',
        url: 'https://steelsetu.com',
        logo: 'https://steelsetu.com/icon.png',
        description:
          'B2B industrial steel trading and supply platform operated by Singhi Enterprises, Burrabazar, Kolkata.',
        email: 'hello@steelsetu.com',
        telephone: '+91-98830-51500',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Maharshi Debendra Road, Burrabazar',
          addressLocality: 'Kolkata',
          addressRegion: 'West Bengal',
          postalCode: '700007',
          addressCountry: 'IN',
        },
        areaServed: { '@type': 'Country', name: 'India' },
      },
    ],
  };

  return (
    <div data-layer="marketing" className="relative min-h-screen ss-industrial-grid text-slate-100">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MarketingHeader />

      <main className="pt-20">
        <MegaSearch />
        <TrustShieldBar />
        <PriceTicker rates={rates} />
        <SplitMarketplace products={products} />
        <CalculatorPreview />
        <MandiBulletin />
        <MetricsSection />
        <TestimonialsCarousel />
        <FinalCta />
      </main>

      <SiteFooter tone="dark" />
    </div>
  );
}

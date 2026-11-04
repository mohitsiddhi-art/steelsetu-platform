import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import GroundTruthCard from '@/components/marketing/GroundTruthCard';

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-ss-white">
      <MarketingHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Compare Steel Products</h1>
        <div className="grid gap-8 md:grid-cols-2">
            <GroundTruthCard
                type="truth"
                title="Understand Product Specs"
                description="Comparing prices alone is dangerous. Always compare thickness, coating microns, and yield strength. Our catalog provides full spec sheets for this purpose."
            />
            <GroundTruthCard
                type="warning"
                title="Marketplace Price Traps"
                description="If a price seems too good to be true, it likely is. Verify if quotes include GST, freight, and insurance."
            />
        </div>
      </main>
      <SiteFooter tone="light" />
    </div>
  );
}

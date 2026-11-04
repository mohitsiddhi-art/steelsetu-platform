import type { Metadata } from 'next';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Why Kolkata Factory Roofs Leak: Mount SDS vs Local Screws | Steelsetu',
  description: 'Fabricators saving ₹500 on local screws risk ₹75,000 in roof damage. Learn why Mount 12x55mm SDS screws with EPDM washers are necessary for Kolkata\'s climate.',
  authors: [{ name: 'Singhi Enterprises', url: 'https://steelsetu.com' }],
  openGraph: {
    title: 'Why Kolkata Factory Roofs Leak: Mount SDS vs Local Screws',
    description: 'B2B technical guide on industrial roofing fasteners for the West Bengal climate.',
    type: 'article',
  },
};

export default function BlogPage() {
  const whatsappUrl = `https://wa.me/919883051500?text=${encodeURIComponent(
    'Hello Singhi Enterprises, I read your guide on Mount 12x55 SDS screws. Need a commercial quote for factory roofing.'
  )}`;

  return (
    <div data-layer="marketing" className="relative min-h-screen ss-industrial-grid text-slate-100 selection:bg-orange-500/30">
      <MarketingHeader />

      <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <article className="prose prose-invert prose-slate max-w-none">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-orange-500 font-mono text-sm mb-4">
              <span className="px-2 py-0.5 border border-orange-500/30 bg-orange-500/10">TECHNICAL GUIDE</span>
              <span>•</span>
              <time dateTime="2026-11-04">Nov 4, 2026</time>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              Why Local Carbon Steel Screws Cost Your Factory Roof Thousands
            </h1>
            <div className="flex items-center gap-4 p-4 border border-slate-800 bg-slate-900/50 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500 font-bold">SE</div>
              <div>
                <p className="text-sm font-medium text-slate-200">Singhi Enterprises</p>
                <p className="text-xs text-slate-400">Maharshi Debendra Road, Burrabazar, Kolkata</p>
              </div>
            </div>
          </header>

          <div className="space-y-8 text-lg leading-relaxed text-slate-300">
            <p>
              Industrial factory roofs in Burrabazar and the industrial belts of Dankuni and Durgapur face a constant enemy: extreme humidity. If your industrial roof is leaking within two years, the culprit is rarely the sheet itself. It is the fastener. Fabricators often save ₹500 by installing local carbon steel screws. That decision leads to premature rusting and sheet damage that can cost over ₹75,000 in repairs.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="h-px w-8 bg-orange-500"></span>
                The Hidden Cost of Saving on Fasteners
              </h2>
              <p>
                When you choose a local unbranded screw, you get a bare bones fastener often prone to surface rust within months. Humidity in West Bengal accelerates this oxidation process significantly. As the screw head rusts, it expands. This expansion creates micro gaps between the screw and the roofing sheet.
              </p>
              <p className="mt-4">
                The contact point between the purlin and the screw becomes the primary failure point. Once water finds this path, it follows the screw shank down into your factory floor. A ₹2,300 saving on initial installation material quickly transforms into a massive maintenance nightmare.
              </p>
            </section>

            <section className="p-6 border border-slate-800 bg-slate-900/30 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Technical Comparison: Why Specifications Matter</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">Zinc Coating and Corrosion Resistance</h3>
                  <p>
                    Local unbranded screws typically feature 3 to 5 microns of commercial electro plating. This layer is too thin for the saline and humid air found in Kolkata and surrounding industrial hubs. Mount brand 12x55mm Self-Drilling Screws feature 15 to 20 microns of Class 3 hot dip zinc-tin coating, adhering to AS 3566 standards. This provides the necessary barrier to prevent rust in harsh environments.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">The Washer Material</h3>
                  <p>
                    The washer is the unsung hero of a watertight roof. Local screws often use cheap black PVC or recycled rubber washers. These materials harden and crack under the intense 45°C Kolkata summer heat. Mount screws use high-density vulcanized EPDM washers. These retain elasticity and maintain a watertight seal up to 120°C, ensuring the seal remains effective despite daily thermal cycles.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">Drilling Capacity</h3>
                  <p>
                    Installation efficiency is also key. Mount SDS screws feature a high-performance Tek-point #3 drill tip. This enables piercing up to 5mm thick MS purlins without slippage or metal burning, ensuring a secure grip that stays tight over time.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Thermal Expansion Math</h2>
              <p>
                Metal moves constantly under changing temperatures. A twenty meter long continuous PPGL sheet expands four millimeters to six millimeters between a cold winter night at fourteen degrees Celsius and a scorching summer noon at forty three degrees Celsius.
              </p>
              <p className="mt-4">
                Under this continuous shear stress, poor quality washers disintegrate. When the rubber hardens, the lateral movement of the metal sheet slices right through the degraded washer. High density vulcanized EPDM absorbs this lateral shift without tearing or losing its memory. It expands and contracts alongside the steel panel, keeping the penetration point entirely dry.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">The Installation Mistake Most Fabricators Make</h2>
              <p>
                Even a premium fastener fails if installed incorrectly. A common error on site involves over-torquing the drill gun. When local mistries drive the screw at maximum RPM without setting a depth clutch, they crush the EPDM washer completely flat.
              </p>
              <p className="mt-4">
                A crushed washer loses its elasticity on day one, creating a ring of stress where water pools and begins corrosion. Proper installation requires stopping the drill the moment the washer bulges slightly past the metal sealing face, preserving its cushion and sealing power.
              </p>
            </section>

            <section className="overflow-hidden border border-slate-800 rounded-lg">
              <h2 className="text-2xl font-bold text-white p-6 border-b border-slate-800">The True Economic Impact</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-slate-200">
                      <th className="px-6 py-4 font-bold border-b border-slate-700">Cost Component</th>
                      <th className="px-6 py-4 font-bold border-b border-slate-700">Local Screws</th>
                      <th className="px-6 py-4 font-bold border-b border-slate-700 text-emerald-400">Mount SDS Screws</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="bg-slate-900/30">
                      <td className="px-6 py-4 font-medium">Initial Material Cost</td>
                      <td className="px-6 py-4">₹3,500</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">₹5,800</td>
                    </tr>
                    <tr className="bg-slate-900/50">
                      <td className="px-6 py-4 font-medium">Replacement Cost (2 Years)</td>
                      <td className="px-6 py-4 text-red-400">₹45,000 to ₹75,000</td>
                      <td className="px-6 py-4 font-bold text-emerald-400">₹0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-800/20 text-sm italic text-slate-400">
                *Comparison based on 10,000 sq ft industrial shed (approx 4,500 screws).
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How to Identify Genuine Mount SDS Screws at Burrabazar Mandi</h2>
              <p>
                Counterfeit and unbranded fasteners flood wholesale markets across Burrabazar, making verification essential before purchase. Genuine Mount SDS screws carry distinct physical markers that distinguish them from cheap carbon steel substitutes.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-300">
                <li><strong>Brand Stamp:</strong> Check the screw head for the clear factory-embossed brand stamp.</li>
                <li><strong>EPDM Test:</strong> Real vulcanized EPDM is bonded directly to the metal backing and will not peel off or crack when bent.</li>
                <li><strong>Tip Sharpness:</strong> Tek-point #3 flutes are sharp and precisely milled, not blunt or rounded.</li>
              </ul>
            </section>

            <section className="bg-slate-900 border-2 border-orange-500/20 p-8 rounded-2xl mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Purchase and Availability</h2>
              <p className="mb-6">
                Ready bulk stock of Mount SDS screws in original factory boxes (12x55mm and 12x25mm) is available at Singhi Enterprises.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/products?category=ROOFING_ACCESSORY&q=Mount"
                  className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
                >
                  ⚡ Check Ready Box Stock
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
                >
                  💬 WhatsApp Trade Desk
                </a>
              </div>
              <p className="mt-6 text-sm text-center text-slate-400">
                Singhi Enterprises | Maharshi Debendra Road, Burrabazar, Kolkata - 700007
              </p>
            </section>

            <footer className="mt-16 pt-8 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Sources</h3>
              <ul className="text-sm space-y-2 text-slate-500 font-mono">
                <li>[1] AS 3566 Standard for Self-drilling screws for construction</li>
                <li>[2] Indian Industrial Standard (IS) 12444 for structural steel</li>
                <li>[3] Engineering guidelines on thermal expansion of profiled steel sheets</li>
              </ul>
            </footer>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

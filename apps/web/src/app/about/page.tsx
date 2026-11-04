import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { Landmark, ShieldCheck, MapPin, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <MarketingHeader />
      <main className="flex-1 container mx-auto px-4 py-24 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-xs font-mono mb-4">
          <Landmark className="w-3.5 h-3.5 text-ss-orange" /> Institutional Heritage &amp; Trust
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-display mb-6">
          About Steelsetu &amp; Singhi Enterprises
        </h1>

        <div className="rounded-2xl border border-amber-800/60 bg-amber-950/20 p-6 mb-8 flex items-start gap-4">
          <Award className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Verified Trade Authority &amp; Samity Membership</h3>
            <p className="text-sm text-slate-300 font-mono leading-relaxed">
              &ldquo;Operated by Singhi Enterprises — Proud Life Member of Shree Burrabazar Lohapatty Seva Samity (Regd. Estd. 1968, Maharshi Debendra Road, Kolkata-700007)&rdquo;
            </p>
          </div>
        </div>

        <div className="space-y-6 text-slate-300 leading-relaxed text-base">
          <p>
            Steelsetu is a cinematic B2B marketplace bridging the gap between India&apos;s industrial heartland in Eastern India and procurement teams across the country. Operating directly out of the historic trading hub of Burrabazar, Kolkata, we combine three decades of offline steel brokerage experience with cutting-edge digital procurement workflows.
          </p>
          <p>
            Our roots are deeply embedded in the mercantile traditions of Kolkata. As a life member of the Shree Burrabazar Lohapatty Seva Samity, Singhi Enterprises upholds the highest standards of fair weights, transparent mill test certificates, and ethical trade practices.
          </p>
          <p>
            We bring transparency, verified quality, and data-driven insights to the steel trading industry, replacing opaque networks with digital precision, guaranteed MTC traceability, and prompt dispute resolution.
          </p>
        </div>
      </main>
      <SiteFooter tone="dark" />
    </div>
  );
}

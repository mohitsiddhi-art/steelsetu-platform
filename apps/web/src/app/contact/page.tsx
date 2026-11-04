import Link from 'next/link';
import { Mail, MapPin, Phone, MessageCircle, Clock, ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata = {
  title: 'Contact Steelsetu Trade Desk | Singhi Enterprises Burrabazar',
  description: 'Get in touch with Singhi Enterprises, Burrabazar prime steel stockist and mill channel partner.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ss-ink text-slate-100 flex flex-col ss-industrial-grid">
      <MarketingHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-800 text-xs font-mono text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Commercial Trade Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Steelsetu Trade Desk &amp; Registered Office
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Direct mill allocations, spot mandi pricing, and bulk commercial orders handled by Singhi Enterprises at Burrabazar, Kolkata.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Details Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-ss-orange" /> Office &amp; Desk Coordinates
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white">Singhi Enterprises</p>
                  <p className="text-slate-300 mt-0.5">
                    Maharshi Debendra Road, Burrabazar, Kolkata - 700007, West Bengal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-ss-orange shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-mono">Phone / Hotline</p>
                  <a href="tel:+919883051500" className="text-white font-bold hover:underline">
                    +91 98830 51500
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-mono">WhatsApp Desk</p>
                  <a
                    href="https://wa.me/919883051500?text=Hello%20Singhi%20Enterprises%20Trade%20Desk,%20I%20would%20like%20to%20discuss%20steel%20procurement."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    +91 98830 51500 &rarr; Instant Chat
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-mono">Email Inquiries</p>
                  <a href="mailto:hello@steelsetu.com" className="text-white font-bold hover:underline">
                    hello@steelsetu.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 font-mono">Trade Desk Timings</p>
                  <p className="text-slate-200 font-semibold mt-0.5">
                    Monday to Saturday: 10:00 AM - 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919883051500"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-emerald-600/20"
              >
                Chat on WhatsApp Now
              </a>
              <Link
                href="/trade-desk"
                className="flex-1 text-center py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20"
              >
                Open Trade Desk CRM
              </Link>
            </div>
          </div>

          {/* Map & Location Embed Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Burrabazar Mandi Hub Location</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strategically positioned in the heart of Kolkata&apos;s primary steel wholesale district at Maharshi Debendra Road, ensuring direct truck dispatch across West Bengal, Bihar, Jharkhand, and Odisha.
              </p>
            </div>

            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative flex items-center justify-center">
              <iframe
                title="Burrabazar Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.152599723528!2d88.3475!3d22.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02770d1234567%3A0x123456789abcdef!2sMaharshi%20Debendra%20Rd%2C%20Burrabazar%2C%20Kolkata%2C%20West%20Bengal%20700007!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-300 font-mono text-center">
              📍 GPS Coordinates: 22.5833° N, 88.3475° E · Maharshi Debendra Road Hub
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

import { Suspense } from 'react';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { getBlogPosts } from '@/services/platformService';
import Link from 'next/link';

async function BlogPosts() {
  const posts = await getBlogPosts();

  // Manually add the new technical guide if not present in DB yet
  const technicalPost = {
    id: 'mount-sds-screws-vs-local-roof-leaks',
    title: "Why Kolkata Factory Roofs Leak: Mount SDS vs Local Screws",
    excerpt: "Fabricators saving ₹2,300 on unbranded screws risk ₹75,000 in roof damage. An engineering analysis of Class 3 zinc coatings, EPDM washers, and thermal expansion across Burrabazar and Dankuni sheds.",
    slug: "mount-sds-screws-vs-local-roof-leaks",
    category: "FASTENERS & ROOFING",
    readingTimeMinutes: 5,
  };

  const allPosts = [technicalPost, ...posts];

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {allPosts.map(post => (
        <article key={post.id} className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-sm hover:border-ss-orange/50 transition-colors">
          <span className="text-[10px] font-bold text-ss-orange tracking-widest uppercase mb-2 block">{post.category}</span>
          <h2 className="text-xl font-bold mb-3 text-slate-100">{post.title}</h2>
          <p className="text-slate-300 text-sm mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <Link href={`/blog/${post.slug}`} className="text-blue-400 font-semibold text-sm hover:underline">Read more</Link>
            <span className="text-slate-500 text-xs">{post.readingTimeMinutes} min read</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default async function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <MarketingHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-white">Steelsetu Insights</h1>
        <Suspense fallback={<div className="p-4 text-slate-500">Loading posts...</div>}>
          <BlogPosts />
        </Suspense>
      </main>
      <SiteFooter tone="light" />
    </div>
  );
}

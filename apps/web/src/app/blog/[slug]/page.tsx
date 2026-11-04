import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MarketingHeader from '@/components/layout/MarketingHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import { getBlogPostBySlug } from '@/services/platformService';

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-8">{new Date(post.publishedAt).toLocaleDateString()}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </>
  );
}

export const instant = false;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-ss-white">
      <MarketingHeader />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <Suspense fallback={<div className="p-4 text-slate-500">Loading...</div>}>
          <BlogPostContent slug={slug} />
        </Suspense>
      </main>
      <SiteFooter tone="light" />
    </div>
  );
}

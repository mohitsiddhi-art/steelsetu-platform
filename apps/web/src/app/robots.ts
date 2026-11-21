import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/staff', '/dashboard', '/trade-desk', '/api'],
      },
    ],
    sitemap: 'https://www.steelsetu.com/sitemap.xml',
  };
}

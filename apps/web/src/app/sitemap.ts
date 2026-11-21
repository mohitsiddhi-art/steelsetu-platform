import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const SITE_URL = 'https://www.steelsetu.com';

  return [
    { url: `${SITE_URL}`, lastModified: new Date() },
    { url: `${SITE_URL}/products`, lastModified: new Date() },
    { url: `${SITE_URL}/suppliers`, lastModified: new Date() },
    { url: `${SITE_URL}/prices`, lastModified: new Date() },
    { url: `${SITE_URL}/calculators`, lastModified: new Date() },
    { url: `${SITE_URL}/blog`, lastModified: new Date() },
    { url: `${SITE_URL}/community`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, lastModified: new Date() },
    { url: `${SITE_URL}/terms`, lastModified: new Date() },
    { url: `${SITE_URL}/privacy`, lastModified: new Date() },
    { url: `${SITE_URL}/disclaimer`, lastModified: new Date() },
  ];
}

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://steelsetu.com', lastModified: new Date() },
    { url: 'https://steelsetu.com/suppliers', lastModified: new Date() },
    { url: 'https://steelsetu.com/blog', lastModified: new Date() },
    { url: 'https://steelsetu.com/prices', lastModified: new Date() },
    { url: 'https://steelsetu.com/compare', lastModified: new Date() },
    { url: 'https://steelsetu.com/about', lastModified: new Date() },
    { url: 'https://steelsetu.com/community', lastModified: new Date() },
  ];
}

import type { MetadataRoute } from 'next';

const siteUrl = 'https://www.displaycellpros.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/services', '/services/display-repair', '/services/cell-phone-repair', '/about', '/contact', '/quote'].map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : 0.8,
  }));
}

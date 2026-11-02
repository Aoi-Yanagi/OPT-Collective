import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://opt-collective.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/category/', '/product/', '/info/'],
        disallow: ['/dashboard/', '/api/admin/', '/checkout', '/track'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
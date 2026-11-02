import { MetadataRoute } from 'next';
import { OPT_PRODUCTS } from '@/features/catalog/catalog.data';
import { PublicProductItem } from '@/types/public-catalog.types';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://opt-collective.vercel.app';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/category/desk`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/drive`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/category/vault`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = (
    OPT_PRODUCTS as PublicProductItem[]
  )
    .filter((p: PublicProductItem) => p.publicationStatus === 'PUBLISHED')
    .map((product: PublicProductItem) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  return [...staticRoutes, ...productRoutes];
}
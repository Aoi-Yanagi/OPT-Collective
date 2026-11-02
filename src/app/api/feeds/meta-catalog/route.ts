import { NextResponse } from 'next/server';
import { OPT_PRODUCTS } from '@/features/catalog/catalog.data';

/**
 * Dynamic Meta Commerce Manager & WhatsApp Business Catalog Feed.
 * Connect https://your-domain.vercel.app/api/feeds/meta-catalog in Meta Commerce Manager -> Data Sources -> Scheduled Feed.
 */
export async function GET() {
  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://opt-collective.vercel.app';

  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'sale_price',
    'link',
    'image_link',
    'brand',
    'product_type',
  ].join(',');

  const publishedProducts = OPT_PRODUCTS.filter(
    (p) => p.publicationStatus === 'PUBLISHED'
  );

  const rows = publishedProducts.map((product) => {
    const availability =
      product.stockStatus === 'IN_STOCK' || product.stockStatus === 'LOW_STOCK'
        ? 'in stock'
        : 'out of stock';

    const cleanTitle = `"${product.title.replace(/"/g, '""')}"`;
    const cleanDesc = `"${(product.description || product.subtitle).replace(/"/g, '""')}"`;

    return [
      product.sku,
      cleanTitle,
      cleanDesc,
      availability,
      'new',
      `${product.compareAtPrice} INR`,
      `${product.price} INR`,
      `${siteBaseUrl}/product/${product.slug}`,
      product.image,
      '"The O.P.T. Collective"',
      `"${product.division}"`,
    ].join(',');
  });

  const csvBody = [headers, ...rows].join('\n');

  return new NextResponse(csvBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
    },
  });
}
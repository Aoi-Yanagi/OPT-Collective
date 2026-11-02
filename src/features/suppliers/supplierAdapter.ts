import { PublicProductItem, ProductDivision } from '@/types/public-catalog.types';
import { SupplierOfferRecord } from '@/types/private-procurement.types';

export interface ImportedProductDraft {
  product: PublicProductItem;
  primaryOffer: SupplierOfferRecord;
  adapterDetected: string;
}

export interface SupplierAdapter {
  id: string;
  supplierName: string;
  matchesUrl: (url: string) => boolean;
  parseUrlToDraft: (
    url: string,
    overrides?: {
      title?: string;
      division?: ProductDivision;
      purchaseCostInr?: number;
      sellingPriceInr?: number;
      imageUrl?: string;
    }
  ) => ImportedProductDraft;
}

function slugifyTitle(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractTitleFromUrlPath(url: string, fallback: string): string {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || fallback;
    return last
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return fallback;
  }
}

export const SUPPLIER_ADAPTER_REGISTRY: SupplierAdapter[] = [
  {
    id: 'adapter-deodap',
    supplierName: 'DeoDap Wholesale',
    matchesUrl: (url) => /deodap\.(in|com)/i.test(url),
    parseUrlToDraft: (url, overrides) =>
      buildNormalizedDraft('DeoDap Wholesale', 'sup-deodap', url, overrides),
  },
  {
    id: 'adapter-meesho',
    supplierName: 'Meesho Supplier Network',
    matchesUrl: (url) => /meesho\.com/i.test(url),
    parseUrlToDraft: (url, overrides) =>
      buildNormalizedDraft('Meesho Supplier Network', 'sup-meesho', url, overrides),
  },
  {
    id: 'adapter-indiamart',
    supplierName: 'IndiaMART Importer',
    matchesUrl: (url) => /indiamart\.com/i.test(url),
    parseUrlToDraft: (url, overrides) =>
      buildNormalizedDraft('IndiaMART Importer', 'sup-indiamart', url, overrides),
  },
  {
    id: 'adapter-hothaat-baapstore',
    supplierName: 'Trend Discovery Reference (Hothaat / Baapstore)',
    matchesUrl: (url) => /(hothaat|baapstore)\.com/i.test(url),
    parseUrlToDraft: (url, overrides) =>
      buildNormalizedDraft('Trend Radar Reference', 'sup-deodap', url, overrides),
  },
];

function buildNormalizedDraft(
  supplierName: string,
  supplierId: string,
  url: string,
  overrides?: {
    title?: string;
    division?: ProductDivision;
    purchaseCostInr?: number;
    sellingPriceInr?: number;
    imageUrl?: string;
  }
): ImportedProductDraft {
  const inferredTitle =
    overrides?.title?.trim() || extractTitleFromUrlPath(url, 'O.P.T. Precision Hardware Unit');
  const division: ProductDivision = overrides?.division || 'DESK';
  const randCode = Math.floor(100 + Math.random() * 899);
  const sku = `OPT-${division}-${randCode}`;
  const slug = `${slugifyTitle(inferredTitle)}-${randCode}`;
  const purchaseCost = overrides?.purchaseCostInr || 195;
  const sellingPrice = overrides?.sellingPriceInr || 599;
  const productId = `prod-${division.toLowerCase()}-${randCode}`;
  const image =
    overrides?.imageUrl ||
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80';

  return {
    adapterDetected: supplierName,
    product: {
      id: productId,
      sku,
      slug,
      title: inferredTitle,
      subtitle: `Direct Partner Hub Dispatch // Curated for O.P.T. // ${division}`,
      description: `Precision-vetted ${inferredTitle} backed by The O.P.T. Collective 7-Day Defective Replacement Shield.`,
      division,
      tags: [division.toLowerCase(), 'new-arrival'],
      price: sellingPrice,
      compareAtPrice: Math.round(sellingPrice * 1.9),
      rating: 0,
      reviewsCount: 0,
      badge: `New Arrival // ${division}`,
      image,
      gallery: [image],
      specs: [
        'Quality-checked at regional partner dispatch hub',
        'Ships in plain neutral outer courier parcel',
        'Protected by O.P.T. 7-Day Unboxing Replacement Shield',
      ],
      variants: [
        {
          id: `var-${randCode}-std`,
          name: 'Standard Industrial Finish',
          skuSuffix: 'STD',
          priceDeltaInr: 0,
          stockStatus: 'IN_STOCK',
        },
      ],
      stockStatus: 'IN_STOCK',
      stockQuantityLeft: 12,
      inStock: true,
      publicationStatus: 'DRAFT',
    },
    primaryOffer: {
      id: `offer-${randCode}-1`,
      productId,
      productSku: sku,
      supplierId,
      supplierName,
      supplierProductUrl: url,
      supplierSku: `SUP-${randCode}`,
      purchaseCostInr: purchaseCost,
      shippingCostInr: 0,
      currency: 'INR',
      stockStatus: 'IN_STOCK',
      isPrimary: true,
      lastCheckedAt: new Date().toISOString().slice(0, 10),
    },
  };
}

export function importProductFromSupplierUrl(
  url: string,
  overrides?: Parameters<SupplierAdapter['parseUrlToDraft']>[1]
): ImportedProductDraft {
  const matched = SUPPLIER_ADAPTER_REGISTRY.find((a) => a.matchesUrl(url));
  if (matched) {
    return matched.parseUrlToDraft(url, overrides);
  }
  return buildNormalizedDraft('Manual / Custom Supplier URL', 'sup-custom', url, overrides);
}
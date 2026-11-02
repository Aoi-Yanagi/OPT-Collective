import { DivisionKey } from './theme.types';

export type ProductDivision = Exclude<DivisionKey, 'ALL'>;

export type StockRetentionStatus =
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'RESTOCKING_SOON'
  | 'OUT_OF_STOCK';

export type PublicationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'RECOMMENDED_CANDIDATE';

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Obsidian Matte", "CNC Anodized Silver"
  skuSuffix: string;
  priceDeltaInr: number;
  stockStatus: StockRetentionStatus;
  colorHex?: string;
}

export interface PublicProductItem {
  id: string;
  sku: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  division: ProductDivision;
  tags: string[];
  price: number;
  compareAtPrice: number;
  rating: number;
  reviewsCount: number;
  badge: string;
  image: string;
  gallery: string[];
  specs: string[];
  variants: ProductVariant[];
  stockStatus: StockRetentionStatus;
  stockQuantityLeft?: number; // Used for LOW_STOCK urgency badge
  nextRestockDateIso?: string; // Used for RESTOCKING_SOON countdown
  restockWaitlistCount?: number; // Social proof for returning visitors
  inStock: boolean; // Backward-compatible flag derived from stockStatus
  publicationStatus: PublicationStatus;
}
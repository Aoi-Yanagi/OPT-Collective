import { ProductDivision, StockRetentionStatus } from './public-catalog.types';

export type SupplierIntegrationType =
  | 'MANUAL_ASSISTED'
  | 'CSV_FEED'
  | 'URL_IMPORTER'
  | 'AUTHORIZED_API';

export interface SupplierRecord {
  id: string;
  name: string; // Flexible string (DeoDap, Meesho, IndiaMART, or any future supplier)
  websiteUrl: string;
  integrationType: SupplierIntegrationType;
  neutralPackagingVerified: boolean;
  active: boolean;
  lastSyncedAt?: string;
}

export interface SupplierOfferRecord {
  id: string;
  productId: string;
  productSku: string;
  supplierId: string;
  supplierName: string;
  supplierProductUrl: string;
  supplierSku: string;
  purchaseCostInr: number;
  shippingCostInr: number;
  currency: 'INR';
  stockStatus: StockRetentionStatus;
  isPrimary: boolean;
  lastCheckedAt: string;
  internalNotes?: string;
}

export interface ProductMarginCalculation {
  sellingPriceInr: number;
  totalSupplierCostInr: number;
  estimatedMarginInr: number;
  marginPercentage: number;
}

export interface TrendRecommendationCandidate {
  id: string;
  title: string;
  suggestedDivision: ProductDivision;
  trendSourceName: string; // e.g., "Hothaat Trend Radar", "Baapstore Niche Winner", "DeoDap Viral"
  sourceReferenceUrl: string;
  fulfillmentSupplierName: string;
  fulfillmentSupplierUrl: string;
  estimatedSupplierCostInr: number;
  suggestedRetailPriceInr: number;
  image: string;
  specs: string[];
  demandScore: number; // 1 - 100
  status: 'PENDING_REVIEW' | 'APPROVED_PUBLISHED' | 'DISMISSED';
  detectedAt: string;
}

/**
 * Computes net profit margin dynamically from selling price and supplier offer cost
 * rather than storing hardcoded margin numbers.
 */
export function calculateOfferMargin(
  sellingPriceInr: number,
  purchaseCostInr: number,
  shippingCostInr: number = 0
): ProductMarginCalculation {
  const totalSupplierCostInr = purchaseCostInr + shippingCostInr;
  const estimatedMarginInr = Math.max(0, sellingPriceInr - totalSupplierCostInr);
  const marginPercentage =
    sellingPriceInr > 0 ? Math.round((estimatedMarginInr / sellingPriceInr) * 100) : 0;

  return {
    sellingPriceInr,
    totalSupplierCostInr,
    estimatedMarginInr,
    marginPercentage,
  };
}
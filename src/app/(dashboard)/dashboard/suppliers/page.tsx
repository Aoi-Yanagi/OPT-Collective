'use client';

import React, { useState } from 'react';
import { useLiveCatalog } from '@/features/catalog/useLiveCatalog';
import { importProductFromSupplierUrl } from '@/features/suppliers/supplierAdapter';
import { generateDualModeArticlesForProduct } from '@/features/guides/guides.data';
import {
  calculateOfferMargin,
  TrendRecommendationCandidate,
  SupplierOfferRecord,
} from '@/types/private-procurement.types';
import {
  PublicProductItem,
  ProductDivision,
  StockRetentionStatus,
} from '@/types/public-catalog.types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  CheckCircle2,
  PlusCircle,
  ExternalLink,
  Share2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

const PRIVATE_SUPPLIER_OFFERS: SupplierOfferRecord[] = [
  {
    id: 'offer-001-primary',
    productId: 'prod-desk-01',
    productSku: 'OPT-DESK-001',
    supplierId: 'sup-deodap',
    supplierName: 'DeoDap Wholesale',
    supplierProductUrl: 'https://deodap.in/search?q=aluminum+laptop+stand',
    supplierSku: 'DD-ALU-6AXIS-01',
    purchaseCostInr: 190,
    shippingCostInr: 0,
    currency: 'INR',
    stockStatus: 'IN_STOCK',
    isPrimary: true,
    lastCheckedAt: '2026-11-02',
  },
  {
    id: 'offer-002-primary',
    productId: 'prod-desk-02',
    productSku: 'OPT-DESK-002',
    supplierId: 'sup-meesho',
    supplierName: 'Meesho Supplier Network',
    supplierProductUrl: 'https://www.meesho.com/search?q=memory%20foam%20coccyx%20cushion',
    supplierSku: 'MSH-ORTHO-55D',
    purchaseCostInr: 280,
    shippingCostInr: 0,
    currency: 'INR',
    stockStatus: 'IN_STOCK',
    isPrimary: true,
    lastCheckedAt: '2026-11-02',
  },
  {
    id: 'offer-003-primary',
    productId: 'prod-desk-03',
    productSku: 'OPT-DESK-003',
    supplierId: 'sup-deodap',
    supplierName: 'DeoDap Wholesale',
    supplierProductUrl: 'https://deodap.in/search?q=7+in+1+keyboard+cleaner',
    supplierSku: 'DD-7IN1-CLN',
    purchaseCostInr: 105,
    shippingCostInr: 0,
    currency: 'INR',
    stockStatus: 'LOW_STOCK',
    isPrimary: true,
    lastCheckedAt: '2026-11-02',
  },
  {
    id: 'offer-004-primary',
    productId: 'prod-drive-01',
    productSku: 'OPT-DRIVE-001',
    supplierId: 'sup-deodap',
    supplierName: 'DeoDap Wholesale',
    supplierProductUrl: 'https://deodap.in/search?q=car+seat+gap+organizer',
    supplierSku: 'DD-CAR-GAP-PR',
    purchaseCostInr: 210,
    shippingCostInr: 0,
    currency: 'INR',
    stockStatus: 'IN_STOCK',
    isPrimary: true,
    lastCheckedAt: '2026-11-02',
  },
  {
    id: 'offer-005-primary',
    productId: 'prod-drive-02',
    productSku: 'OPT-DRIVE-002',
    supplierId: 'sup-meesho',
    supplierName: 'Meesho Supplier Network',
    supplierProductUrl: 'https://www.meesho.com/search?q=microfiber%20car%20duster',
    supplierSku: 'MSH-CAR-DUST-02',
    purchaseCostInr: 175,
    shippingCostInr: 0,
    currency: 'INR',
    stockStatus: 'RESTOCKING_SOON',
    isPrimary: true,
    lastCheckedAt: '2026-11-02',
  },
  {
    id: 'offer-006-primary',
    productId: 'prod-vault-01',
    productSku: 'OPT-VAULT-001',
    supplierId: 'sup-deodap',
    supplierName: 'DeoDap Wholesale',
    supplierProductUrl: 'https://deodap.in',
    supplierSku: 'DD-COMBO-01-03',
    purchaseCostInr: 295,
    shippingCostInr: 0,
    currency: 'INR',
    stockStatus: 'IN_STOCK',
    isPrimary: true,
    lastCheckedAt: '2026-11-02',
  },
];

const TREND_RECOMMENDATION_CANDIDATES: TrendRecommendationCandidate[] = [
  {
    id: 'rec-trend-01',
    title: 'MagSafe-Compatible Alloy Car AC Vent Grip Mount (360° Swivel)',
    suggestedDivision: 'DRIVE',
    trendSourceName: 'Hothaat {Trends} Radar',
    sourceReferenceUrl: 'https://www.hothaat.com',
    fulfillmentSupplierName: 'DeoDap Wholesale',
    fulfillmentSupplierUrl: 'https://deodap.in/search?q=magnetic+car+phone+holder',
    estimatedSupplierCostInr: 145,
    suggestedRetailPriceInr: 499,
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    specs: [
      'N52 Neodymium Ring Magnet Array',
      'Zero-Vibration Metal Hook Vent Lock',
      'One-Handed 360° Portrait/Landscape Rotation',
    ],
    demandScore: 94,
    status: 'PENDING_REVIEW',
    detectedAt: '2026-11-02',
  },
  {
    id: 'rec-trend-02',
    title: 'Under-Desk Clamp Rotary Headphone & Cable Management Arm',
    suggestedDivision: 'DESK',
    trendSourceName: 'Baapstore {Trends} Winner',
    sourceReferenceUrl: 'https://www.baapstore.com',
    fulfillmentSupplierName: 'Meesho Supplier Network',
    fulfillmentSupplierUrl: 'https://www.meesho.com/search?q=headphone%20stand%20clamp',
    estimatedSupplierCostInr: 130,
    suggestedRetailPriceInr: 449,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    specs: [
      '360° Under-Desk Swivel Clamp',
      'Silicone Padded Headband Cradle',
      'Built-In USB-C / Lightning Cable Clips',
    ],
    demandScore: 89,
    status: 'PENDING_REVIEW',
    detectedAt: '2026-11-02',
  },
  {
    id: 'rec-trend-03',
    title: 'USB-C Rechargeable Mini Bag Sealer & Thermal Cutter (Impulse Kitchen Winner)',
    suggestedDivision: 'VAULT',
    trendSourceName: 'DeoDap Viral Impulse #1',
    sourceReferenceUrl: 'https://deodap.in',
    fulfillmentSupplierName: 'DeoDap Wholesale',
    fulfillmentSupplierUrl: 'https://deodap.in/search?q=mini+bag+sealer',
    estimatedSupplierCostInr: 95,
    suggestedRetailPriceInr: 399,
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
    specs: [
      'Instant 1-Second Thermal Airtight Seal',
      'Magnetic Fridge-Mount Backside',
      'USB-C Rechargeable Battery',
    ],
    demandScore: 96,
    status: 'PENDING_REVIEW',
    detectedAt: '2026-11-02',
  },
];

export default function SuppliersAndProductImporterPage() {
  const {
    products: catalogList,
    publishProductEverywhere,
    updateProductStockEverywhere,
  } = useLiveCatalog();

  const [recommendations, setRecommendations] = useState<TrendRecommendationCandidate[]>(
    TREND_RECOMMENDATION_CANDIDATES
  );

  const [supplierUrl, setSupplierUrl] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [division, setDivision] = useState<ProductDivision>('DESK');
  const [supplierCost, setSupplierCost] = useState<number>(180);
  const [sellingPrice, setSellingPrice] = useState<number>(599);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [copiedArticleKey, setCopiedArticleKey] = useState<string | null>(null);

  async function handleApproveRecommendation(rec: TrendRecommendationCandidate) {
    const imported = importProductFromSupplierUrl(rec.fulfillmentSupplierUrl, {
      title: rec.title,
      division: rec.suggestedDivision,
      purchaseCostInr: rec.estimatedSupplierCostInr,
      sellingPriceInr: rec.suggestedRetailPriceInr,
      imageUrl: rec.image,
    });

    imported.product.publicationStatus = 'PUBLISHED';
    imported.product.specs = rec.specs;

    await publishProductEverywhere(imported.product);

    setRecommendations((prev: TrendRecommendationCandidate[]) =>
      prev.map((item: TrendRecommendationCandidate) =>
        item.id === rec.id ? { ...item, status: 'APPROVED_PUBLISHED' } : item
      )
    );
    setImportFeedback(
      `✓ "${rec.title}" (${imported.product.sku}) approved & published LIVE across Storefront, ${rec.suggestedDivision} Category, and Meta/WhatsApp Catalog Feed!`
    );
  }

  async function handleUrlImportAndPublish(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierUrl.trim()) return;

    const draft = importProductFromSupplierUrl(supplierUrl.trim(), {
      title: customTitle.trim() || undefined,
      division,
      purchaseCostInr: supplierCost,
      sellingPriceInr: sellingPrice,
    });
    draft.product.publicationStatus = 'PUBLISHED';

    await publishProductEverywhere(draft.product);

    setImportFeedback(
      `✓ Imported via [${draft.adapterDetected}] & Published ${draft.product.sku} (${draft.product.title}) LIVE across Storefront & Meta Catalog!`
    );
    setSupplierUrl('');
    setCustomTitle('');
  }

  async function handleStockStateChange(
    sku: string,
    newStatus: StockRetentionStatus
  ) {
    await updateProductStockEverywhere(sku, newStatus);
    setImportFeedback(
      `✓ Updated ${sku} stock state to ${newStatus} across Storefront & Meta Feed.`
    );
  }

  function handleCopyArticleDraft(
    prod: PublicProductItem,
    mode: 'DIRECT_ADSENSE' | 'SUBTLE_TROJAN'
  ) {
    const generated = generateDualModeArticlesForProduct({
      title: prod.title,
      sku: prod.sku,
      slug: prod.slug,
      division: prod.division,
      priceInr: prod.price,
      compareAtPriceInr: prod.compareAtPrice,
      specs: prod.specs,
    });

    const textToCopy =
      mode === 'DIRECT_ADSENSE'
        ? generated.directBloggerDraft
        : generated.subtleEducationalDraft;

    navigator.clipboard.writeText(textToCopy);
    const key = `${prod.sku}-${mode}`;
    setCopiedArticleKey(key);
    setTimeout(() => setCopiedArticleKey(null), 2200);
  }

  const liveMarginPreview = calculateOfferMargin(sellingPrice, supplierCost);

  return (
    <div className="space-y-8">
      {importFeedback && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-bold text-emerald-200">
          {importFeedback}
        </div>
      )}

      {/* Section 1: 1-Click Viral & Trend Recommendations Inbox */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-border pb-3">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-theme-accent flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Viral &amp; Impulse Trend Scout Inbox (Hothaat / Baapstore / DeoDap / Meesho)
            </span>
            <p className="text-xs text-theme-muted mt-0.5">
              Click <strong>Approve &amp; Publish Everywhere</strong> to automatically push any viral winner live to your Storefront, Division Page, and Instagram/Facebook/WhatsApp Catalog Feed.
            </p>
          </div>
          <a
            href="/api/feeds/meta-catalog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-theme-border bg-white/5 px-3 py-1.5 font-mono text-[11px] text-theme-accent hover:border-theme-accent"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>View Live Meta/WhatsApp Feed CSV</span>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {recommendations.map((rec: TrendRecommendationCandidate) => {
            const margin = calculateOfferMargin(
              rec.suggestedRetailPriceInr,
              rec.estimatedSupplierCostInr
            );
            return (
              <div
                key={rec.id}
                className="opt-matte-surface p-4 flex flex-col justify-between space-y-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-theme-accent font-bold">{rec.trendSourceName}</span>
                    <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300 font-bold">
                      Score: {rec.demandScore}/100
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-sm font-bold text-theme-text">{rec.title}</h3>
                  <p className="mt-1 font-mono text-[11px] text-theme-muted">
                    Cost: ₹{rec.estimatedSupplierCostInr} → Retail: ₹{rec.suggestedRetailPriceInr}{' '}
                    <strong className="text-emerald-400">
                      (+₹{margin.estimatedMarginInr} / {margin.marginPercentage}% Profit)
                    </strong>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-theme-border">
                  <a
                    href={rec.fulfillmentSupplierUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-theme-muted hover:text-theme-text"
                  >
                    <span>Supplier</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  {rec.status === 'APPROVED_PUBLISHED' ? (
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      Live ✓
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveRecommendation(rec)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve &amp; Publish</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Section 2: Paste Supplier URL Importer */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase text-theme-accent flex items-center gap-1.5">
          <PlusCircle className="h-4 w-4" />
          Paste Supplier URL Importer (DeoDap / Meesho / IndiaMART / Any Viral URL)
        </h2>

        <form
          onSubmit={handleUrlImportAndPublish}
          className="grid grid-cols-1 gap-3 sm:grid-cols-12 text-xs"
        >
          <input
            required
            placeholder="Paste Supplier Product URL (e.g., https://deodap.in/... or https://meesho.com/...)"
            value={supplierUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSupplierUrl(e.target.value)
            }
            className="sm:col-span-5 rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-theme-text"
          />
          <input
            placeholder="Custom Product Title (optional — auto-inferred from URL)"
            value={customTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCustomTitle(e.target.value)
            }
            className="sm:col-span-4 rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-theme-text"
          />
          <select
            value={division}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setDivision(e.target.value as ProductDivision)
            }
            className="sm:col-span-3 rounded-lg border border-theme-border bg-black/60 px-3 py-2 font-mono text-theme-text"
          >
            <option value="DESK">O.P.T. // DESK</option>
            <option value="DRIVE">O.P.T. // DRIVE</option>
            <option value="VAULT">O.P.T. // VAULT &amp; VIRAL</option>
          </select>

          <div className="sm:col-span-3">
            <label className="text-[10px] text-theme-muted block">Supplier Cost (₹)</label>
            <input
              type="number"
              value={supplierCost}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSupplierCost(Number(e.target.value))
              }
              className="mt-0.5 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2 font-mono text-theme-text"
            />
          </div>
          <div className="sm:col-span-3">
            <label className="text-[10px] text-theme-muted block">Selling Price (₹)</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSellingPrice(Number(e.target.value))
              }
              className="mt-0.5 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2 font-mono text-theme-text"
            />
          </div>
          <div className="sm:col-span-3 flex flex-col justify-end">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 font-mono text-[11px] text-emerald-300">
              Net Profit: +₹{liveMarginPreview.estimatedMarginInr} ({liveMarginPreview.marginPercentage}%)
            </div>
          </div>
          <div className="sm:col-span-3 flex flex-col justify-end">
            <Button type="submit" variant="primary" className="w-full">
              Import &amp; Publish SKU
            </Button>
          </div>
        </form>
      </GlassCard>

      {/* Section 3: Active Catalog, Stock State & Dual-Mode Blog Article Generator */}
      <GlassCard className="p-6 overflow-x-auto">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-mono text-xs font-bold uppercase text-theme-accent flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            Live Catalog, Stock Retention &amp; 1-Click Blog Article Syndicator ({catalogList.length} SKUs)
          </h2>
          <span className="font-mono text-[11px] text-theme-muted">
            Two-Birds-One-Stone: Copy Mode A for AdSense/Blogger • Copy Mode B for Medium/Quora/Reddit
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-theme-border font-mono text-[11px] text-theme-muted">
              <th className="pb-3 pr-3">SKU</th>
              <th className="pb-3 pr-3">Product Title</th>
              <th className="pb-3 pr-3">Price / Margin</th>
              <th className="pb-3 pr-3">Stock &amp; Retention State</th>
              <th className="pb-3">1-Click External Blog &amp; SEO Drafts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border">
            {catalogList.map((prod: PublicProductItem) => {
              const primaryOffer = PRIVATE_SUPPLIER_OFFERS.find(
                (o: SupplierOfferRecord) => o.productSku === prod.sku && o.isPrimary
              );
              const cost = primaryOffer?.purchaseCostInr || Math.round(prod.price * 0.32);
              const margin = calculateOfferMargin(prod.price, cost);

              return (
                <tr key={prod.sku}>
                  <td className="py-3 pr-3 font-mono font-bold text-theme-accent">
                    {prod.sku}
                  </td>
                  <td className="py-3 pr-3 font-medium text-theme-text">{prod.title}</td>
                  <td className="py-3 pr-3 font-mono">
                    <span className="font-bold text-theme-text">₹{prod.price}</span>{' '}
                    <span className="text-emerald-400 font-bold">
                      (+₹{margin.estimatedMarginInr})
                    </span>
                  </td>
                  <td className="py-3 pr-3">
                    <select
                      value={prod.stockStatus}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleStockStateChange(
                          prod.sku,
                          e.target.value as StockRetentionStatus
                        )
                      }
                      className="rounded border border-theme-border bg-black/60 px-2 py-1 font-mono text-[11px] text-theme-text"
                    >
                      <option value="IN_STOCK">IN_STOCK</option>
                      <option value="LOW_STOCK">LOW_STOCK</option>
                      <option value="RESTOCKING_SOON">RESTOCKING_SOON</option>
                      <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyArticleDraft(prod, 'DIRECT_ADSENSE')}
                        className="inline-flex items-center gap-1 rounded border border-theme-accent/40 bg-theme-accent/10 px-2 py-1 font-mono text-[10px] font-bold text-theme-accent hover:bg-theme-accent/20"
                      >
                        {copiedArticleKey === `${prod.sku}-DIRECT_ADSENSE` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied Blogger Draft!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Mode A: AdSense/Blogger</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyArticleDraft(prod, 'SUBTLE_TROJAN')}
                        className="inline-flex items-center gap-1 rounded border border-theme-border bg-white/5 px-2 py-1 font-mono text-[10px] text-theme-muted hover:border-theme-accent hover:text-theme-text"
                      >
                        {copiedArticleKey === `${prod.sku}-SUBTLE_TROJAN` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied Subtle SEO!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Mode B: Subtle (Medium/Quora)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
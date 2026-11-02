'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Flame,
  PackageX,
  ShoppingBag,
} from 'lucide-react';
import type { PublicProductItem } from '@/types/public-catalog.types';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: PublicProductItem;
  onAddToCart: (product: PublicProductItem, selectedVariantName?: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants?.[0]?.name || 'Standard'
  );
  const [showAltImage, setShowAltImage] = useState<boolean>(false);
  const isUnavailable = product.stockStatus === 'OUT_OF_STOCK' || product.stockStatus === 'RESTOCKING_SOON';
  const displayImage = showAltImage && product.gallery?.[1]
    ? product.gallery[1]
    : product.image;

  return (
    <article className="opt-product-card group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-theme-border bg-theme-surface transition duration-300 hover:-translate-y-1 hover:border-theme-accent/45 hover:shadow-[0_22px_55px_rgba(0,0,0,0.25)]">
      <div
        onMouseEnter={() => setShowAltImage(true)}
        onMouseLeave={() => setShowAltImage(false)}
        className="relative m-2.5 aspect-[4/3] overflow-hidden rounded-[1.05rem] bg-black/25"
      >
        <Link href={`/product/${product.slug}`} className="block h-full w-full" aria-label={`View ${product.title}`}>
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] ${isUnavailable ? 'grayscale opacity-55' : ''}`}
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        </Link>
        <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full border border-white/15 bg-black/45 px-3 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
          {product.badge}
        </span>
        {isUnavailable && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 p-4 text-center backdrop-blur-[2px]">
            {product.stockStatus === 'RESTOCKING_SOON' ? <Clock className="h-6 w-6 text-amber-300" /> : <PackageX className="h-6 w-6 text-rose-300" />}
            <span className="mt-2 rounded-full border border-white/20 bg-black/35 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-white">
              {product.stockStatus === 'RESTOCKING_SOON' ? 'Restocking soon' : 'Currently unavailable'}
            </span>
          </div>
        )}
        {product.stockStatus === 'LOW_STOCK' && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-2.5 py-1 font-mono text-[9px] font-bold text-slate-950">
            <Flame className="h-3 w-3" /> Limited availability
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
        <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-theme-muted">
          <span>{product.sku}</span>
          <span>{product.division}</span>
        </div>

        <Link href={`/product/${product.slug}`} className="mt-2 block">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-theme-text transition-colors group-hover:text-theme-accent sm:text-base">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-theme-muted">{product.subtitle}</p>

        {product.variants.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Product variants">
            {product.variants.slice(0, 3).map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant.name)}
                aria-pressed={selectedVariant === variant.name}
                className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-[9px] transition ${selectedVariant === variant.name ? 'border-theme-accent/60 bg-theme-accent/10 text-theme-text' : 'border-theme-border text-theme-muted hover:border-theme-accent/40 hover:text-theme-text'}`}
              >
                {variant.colorHex && <span className="h-2 w-2 rounded-full border border-white/20" style={{ backgroundColor: variant.colorHex }} />}
                {variant.name}
              </button>
            ))}
            {product.variants.length > 3 && <span className="self-center text-[9px] text-theme-muted">+{product.variants.length - 3} more</span>}
          </div>
        )}

        <ul className="mt-4 space-y-1.5 border-t border-theme-border/80 pt-3">
          {product.specs.slice(0, 2).map((spec) => (
            <li key={spec} className="flex items-start gap-2 text-[10px] leading-4 text-theme-muted">
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-theme-accent/80" />
              <span>{spec}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-theme-border/80 pt-4 mt-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xl font-semibold tracking-tight text-theme-text">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.1em] text-theme-muted">
              {isUnavailable ? 'Temporarily unavailable' : 'QR checkout · Supplier-direct delivery'}
            </span>
          </div>
          {isUnavailable ? (
            <Button variant="outline" size="sm" disabled className="shrink-0">
              <span>Unavailable</span>
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => onAddToCart(product, selectedVariant)} className="shrink-0">
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add</span>
              <ArrowUpRight className="h-3 w-3 opacity-70" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

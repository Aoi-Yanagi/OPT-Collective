'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLiveCatalog } from '@/features/catalog/useLiveCatalog';
import { PublicProductItem } from '@/types/public-catalog.types';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import { useStoreCart } from '@/features/catalog/StorefrontShell';
import { ProductCard } from '@/features/catalog/ProductCard';
import { Product3DShowcase } from '@/features/animations/Product3DShowcase';
import { ScrollStorySection } from '@/features/animations/ScrollStorySection';
import {
  ShieldCheck,
  QrCode,
  Truck,
  Sparkles,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react';

type SortOption = 'FEATURED' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW' | 'HIGHEST_RATED';

export default function StorefrontHomePage() {
  const { activeDivision, selectDivisionWithTheme } = useOptTheme();
  const { addToCart, device } = useStoreCart();
  const { products } = useLiveCatalog();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('FEATURED');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const filteredProducts: PublicProductItem[] = useMemo(() => {
    const base = products.filter(
      (p: PublicProductItem) => p.publicationStatus === 'PUBLISHED'
    );

    const byDivision =
      activeDivision === 'ALL'
        ? base
        : base.filter((p: PublicProductItem) => p.division === activeDivision);

    const bySearch = !searchQuery.trim()
      ? byDivision
      : byDivision.filter((p: PublicProductItem) => {
          const q = searchQuery.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.subtitle.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.tags?.some((t: string) => t.toLowerCase().includes(q))
          );
        });

    const byStock = onlyAvailable
      ? bySearch.filter(
          (p: PublicProductItem) =>
            p.stockStatus === 'IN_STOCK' || p.stockStatus === 'LOW_STOCK'
        )
      : bySearch;

    const sorted = [...byStock];
    if (sortBy === 'PRICE_LOW_HIGH') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH_LOW') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'HIGHEST_RATED') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted;
  }, [products, activeDivision, searchQuery, sortBy, onlyAvailable]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-16">
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-theme-accent/40 bg-theme-accent/10 px-3.5 py-1 text-xs font-semibold text-theme-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <span>THE O.P.T. COLLECTIVE // OPTIMAL PERFORMANCE TOOLS</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text sm:text-5xl leading-[1.12]">
            Precision Hardware for Your{' '}
            <span className="text-theme-accent">Workspace</span> &amp;{' '}
            <span className="text-theme-accent">Cockpit</span>.
          </h1>

          <p className="max-w-2xl text-sm leading-relaxed text-theme-muted sm:text-base">
            Engineered to eliminate cervical posture fatigue and cabin clutter. Dispatched directly from our vetted Indian partner hubs in neutral packaging—saving you 40% over traditional retail showrooms.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3 text-xs">
            <div className="opt-glass p-3.5 flex items-center gap-2.5">
              <QrCode className="h-4 w-4 text-theme-accent shrink-0" />
              <span>Dedicated 3-Stage QR Checkout</span>
            </div>
            <div className="opt-glass p-3.5 flex items-center gap-2.5">
              <Truck className="h-4 w-4 text-theme-accent shrink-0" />
              <span>Direct Partner Hub Dispatch</span>
            </div>
            <div className="opt-glass p-3.5 flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-theme-accent shrink-0" />
              <span>7-Day Unboxing Replacement Shield</span>
            </div>
          </div>
        </div>
<div className="lg:col-span-5">
          {products[0] && (
            <Product3DShowcase
              product={filteredProducts[0] || products[0]}
              enableGpu3D={device.enableGpu3D}
            />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            key: 'DESK' as const,
            title: 'O.P.T. // DESK',
            desc: '6061 Aluminum Laptop Risers, 55D Coccyx Cushions & Switch Detailing Kits.',
            href: '/category/desk',
            tag: 'Slate / Cyber Cyan',
          },
          {
            key: 'DRIVE' as const,
            title: 'O.P.T. // DRIVE',
            desc: 'StealthFit Console Gap Organizers & Scratch-Free Microfiber Cabin Tools.',
            href: '/category/drive',
            tag: 'Carbon / Telemetry Amber',
          },
          {
            key: 'VAULT' as const,
            title: 'O.P.T. // FESTIVE VAULT',
            desc: 'Curated Dual-Unit Workstation & Car Makeover Combos with Bundle Savings.',
            href: '/category/vault',
            tag: 'Onyx / Gold',
          },
        ].map((divCard) => (
          <Link
            key={divCard.key}
            href={divCard.href}
            onClick={() => selectDivisionWithTheme(divCard.key)}
            className="opt-matte-surface group flex flex-col justify-between p-5 hover:border-theme-accent transition"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-theme-accent">
                <span>{divCard.tag}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h2 className="mt-2 text-base font-extrabold text-theme-text group-hover:text-theme-accent transition">
                {divCard.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-theme-muted">
                {divCard.desc}
              </p>
            </div>
            <span className="mt-4 inline-block font-mono text-[11px] font-semibold text-theme-text">
              Explore {divCard.key} Division →
            </span>
          </Link>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-theme-border pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-theme-accent">
              MODULAR HARDWARE CATALOG // {activeDivision}
            </span>
            <h2 className="text-2xl font-extrabold text-theme-text">
              Curated Performance Gear ({filteredProducts.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-theme-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search stand, cushion, car, SKU..."
                className="w-full rounded-lg border border-theme-border bg-black/40 pl-8 pr-3 py-2 text-xs text-theme-text"
              />
            </div>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-theme-border bg-white/[0.03] px-3 py-2 text-xs text-theme-muted hover:text-theme-text">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOnlyAvailable(e.target.checked)
                }
                className="rounded border-theme-border"
              />
              <span>In-Stock Only</span>
            </label>

            <div className="inline-flex items-center gap-1.5 rounded-lg border border-theme-border bg-black/40 px-2.5 py-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 text-theme-accent" />
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as SortOption)
                }
                className="bg-transparent font-mono text-xs text-theme-text focus:outline-none"
              >
                <option value="FEATURED" className="bg-slate-950">
                  Sort: Featured
                </option>
                <option value="PRICE_LOW_HIGH" className="bg-slate-950">
                  Price: Low to High
                </option>
                <option value="PRICE_HIGH_LOW" className="bg-slate-950">
                  Price: High to Low
                </option>
                <option value="HIGHEST_RATED" className="bg-slate-950">
                  Highest Rated
                </option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="opt-matte-surface p-10 text-center space-y-3">
            <p className="text-sm font-bold text-theme-text">
              No matching hardware units found for &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setOnlyAvailable(false);
                selectDivisionWithTheme('ALL');
              }}
              className="rounded-opt-btn bg-theme-accent px-4 py-2 text-xs font-bold text-theme-accent-fg"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product: PublicProductItem) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(item: PublicProductItem, variantName?: string) =>
                  addToCart(item, variantName)
                }
              />
            ))}
          </div>
        )}
      </section>

      <ScrollStorySection enableGsap={!device.prefersReducedMotion} />
    </div>
  );
}
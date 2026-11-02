'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  QrCode,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
} from 'lucide-react';
import { OPT_PRODUCTS } from '@/features/catalog/catalog.data';
import type { PublicProductItem } from '@/types/public-catalog.types';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import { useStoreCart } from '@/features/catalog/StorefrontShell';
import { ProductCard } from '@/features/catalog/ProductCard';
import { Product3DShowcase } from '@/features/animations/Product3DShowcase';

type SortOption = 'FEATURED' | 'PRICE_LOW_HIGH' | 'PRICE_HIGH_LOW';

const DIVISION_SPOTLIGHTS = [
  {
    key: 'DESK' as const,
    title: 'DESK / STUDIO',
    subtitle: 'Build a better place to think.',
    description: 'Workspace risers, seating support and everyday desk tools.',
    href: '/category/desk',
    index: '01',
  },
  {
    key: 'DRIVE' as const,
    title: 'DRIVE / CABIN',
    subtitle: 'Bring order to every journey.',
    description: 'Useful organizers and considered car-care essentials.',
    href: '/category/drive',
    index: '02',
  },
  {
    key: 'VAULT' as const,
    title: 'VAULT / EDITIONS',
    subtitle: 'Useful things, thoughtfully paired.',
    description: 'Curated combinations and limited collections.',
    href: '/category/vault',
    index: '03',
  },
];

export default function StorefrontHomePage() {
  const { activeDivision, selectDivisionWithTheme } = useOptTheme();
  const { addToCart, device } = useStoreCart();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('FEATURED');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const publicProducts = OPT_PRODUCTS as PublicProductItem[];
  const featuredProduct = publicProducts.find(
    (product) => product.publicationStatus === 'PUBLISHED'
  ) ?? publicProducts[0];

  const filteredProducts: PublicProductItem[] = useMemo(() => {
    const published = publicProducts.filter(
      (product) => product.publicationStatus === 'PUBLISHED'
    );
    const byDivision = activeDivision === 'ALL'
      ? published
      : published.filter((product) => product.division === activeDivision);
    const query = searchQuery.trim().toLowerCase();
    const bySearch = !query
      ? byDivision
      : byDivision.filter((product) =>
          product.title.toLowerCase().includes(query) ||
          product.subtitle.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
        );
    const byStock = onlyAvailable
      ? bySearch.filter((product) =>
          product.stockStatus === 'IN_STOCK' || product.stockStatus === 'LOW_STOCK'
        )
      : bySearch;
    const sorted = [...byStock];
    if (sortBy === 'PRICE_LOW_HIGH') sorted.sort((a, b) => a.price - b.price);
    if (sortBy === 'PRICE_HIGH_LOW') sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [publicProducts, activeDivision, searchQuery, sortBy, onlyAvailable]);

  return (
    <div className="opt-storefront-shell mx-auto max-w-[1440px] space-y-20 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Editorial hero */}
      <section className="opt-hero-shell relative isolate grid items-center gap-8 overflow-hidden rounded-[2rem] border border-theme-border px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.04fr_0.96fr] lg:px-12 lg:py-12">
        <div className="opt-hero-grid pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-theme-accent/30 bg-theme-accent/10 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-theme-accent sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-theme-accent shadow-[0_0_12px_var(--accent-primary)]" />
            The O.P.T. Collective · India
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-theme-muted sm:text-xs">
              Everyday equipment, considered differently
            </p>
            <h1 className="max-w-3xl text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.055em] text-theme-text sm:text-5xl lg:text-[4.5rem]">
              Make room for
              <span className="opt-heading-accent block">better focus.</span>
              Better journeys.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-theme-muted sm:text-base">
              A focused edit of useful desk and car essentials. Choose your gear here;
              we coordinate the supplier-side order after your QR payment is verified.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#catalog" className="opt-primary-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold">
              Explore the collection <ArrowRight className="h-4 w-4" />
            </a>
            <Link href="/info/shipping-policy" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-theme-border bg-white/[0.025] px-6 text-sm font-medium text-theme-text transition hover:border-theme-accent/50 hover:bg-white/[0.05]">
              How ordering works <ArrowUpRight className="h-4 w-4 text-theme-accent" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-theme-border/80 pt-5 text-xs sm:grid-cols-3">
            <div className="flex items-center gap-2.5 text-theme-muted">
              <QrCode className="h-4 w-4 shrink-0 text-theme-accent" />
              <span>QR-only payment</span>
            </div>
            <div className="flex items-center gap-2.5 text-theme-muted">
              <ShieldCheck className="h-4 w-4 shrink-0 text-theme-accent" />
              <span>Payment checked before fulfilment</span>
            </div>
            <div className="flex items-center gap-2.5 text-theme-muted">
              <Truck className="h-4 w-4 shrink-0 text-theme-accent" />
              <span>Supplier ships to your address</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[560px] lg:ml-auto">
          {featuredProduct && (
            <Product3DShowcase
              product={featuredProduct}
              enableGpu3D={device.enableGpu3D && device.hasFinePointer}
            />
          )}
        </div>
        <div className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-64 w-64 rounded-full bg-theme-accent/10 blur-3xl" aria-hidden="true" />
      </section>

      {/* Category discovery */}
      <section className="space-y-6" aria-labelledby="division-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="opt-section-kicker">Find your everyday upgrade</p>
            <h2 id="division-heading" className="mt-2 text-2xl font-semibold tracking-tight text-theme-text sm:text-3xl">
              Three ways to move better.
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-theme-muted sm:text-right">
            Browse by the space you want to improve. Each division carries its own visual identity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {DIVISION_SPOTLIGHTS.map((spotlight) => {
            const divisionProduct = publicProducts.find(
              (product) => product.division === spotlight.key && product.publicationStatus === 'PUBLISHED'
            );
            return (
              <Link
                key={spotlight.key}
                href={spotlight.href}
                onClick={() => selectDivisionWithTheme(spotlight.key)}
                className={`opt-division-card opt-division-${spotlight.key.toLowerCase()} group relative isolate min-h-[260px] overflow-hidden rounded-[1.5rem] border border-theme-border p-5 sm:min-h-[300px] sm:p-6`}
              >
                {divisionProduct && (
                  <img
                    src={divisionProduct.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="opt-division-image absolute inset-0 -z-20 h-full w-full object-cover"
                  />
                )}
                <div className="opt-division-overlay absolute inset-0 -z-10" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/65">{spotlight.index} / {spotlight.key}</span>
                  <span className="rounded-full border border-white/20 bg-black/20 p-2 text-white transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-theme-accent/70 group-hover:text-theme-accent">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-20 max-w-xs sm:mt-24">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">{spotlight.title}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[1.7rem]">{spotlight.subtitle}</h3>
                  <p className="mt-2 text-xs leading-6 text-white/70">{spotlight.description}</p>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white transition group-hover:text-theme-accent">
                  Explore division <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Product catalog */}
      <section id="catalog" className="scroll-mt-28 space-y-6" aria-labelledby="catalog-heading">
        <div className="flex flex-col gap-5 border-b border-theme-border pb-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="opt-section-kicker">The current edit · {activeDivision === 'ALL' ? 'All divisions' : activeDivision}</p>
            <h2 id="catalog-heading" className="mt-2 text-2xl font-semibold tracking-tight text-theme-text sm:text-3xl">
              Gear worth making space for.
            </h2>
            <p className="mt-1 text-xs text-theme-muted">{filteredProducts.length} published product{filteredProducts.length === 1 ? '' : 's'} in this view</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="opt-control-shell relative flex min-h-10 min-w-0 flex-1 items-center sm:w-64 sm:flex-none">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-theme-muted" />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                placeholder="Search products or SKU"
                className="w-full bg-transparent py-2 pl-10 pr-3 text-xs text-theme-text outline-none placeholder:text-theme-muted/70"
              />
            </label>

            <label className="opt-control-shell inline-flex min-h-10 cursor-pointer items-center gap-2 px-3 text-xs text-theme-muted">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setOnlyAvailable(event.target.checked)}
                className="h-3.5 w-3.5 accent-[var(--accent-primary)]"
              />
              Available only
            </label>

            <label className="opt-control-shell inline-flex min-h-10 items-center gap-2 px-3 text-xs text-theme-muted">
              <SlidersHorizontal className="h-3.5 w-3.5 text-theme-accent" />
              <span className="sr-only">Sort products</span>
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setSortBy(event.target.value as SortOption)}
                className="max-w-[150px] bg-transparent py-2 text-xs text-theme-text outline-none"
              >
                <option value="FEATURED" className="bg-slate-950">Featured</option>
                <option value="PRICE_LOW_HIGH" className="bg-slate-950">Price: low to high</option>
                <option value="PRICE_HIGH_LOW" className="bg-slate-950">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="opt-empty-state rounded-2xl border border-theme-border px-6 py-14 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-theme-accent" />
            <p className="mt-3 text-sm font-semibold text-theme-text">No matching products found.</p>
            <p className="mt-1 text-xs text-theme-muted">Try another search or clear your filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setOnlyAvailable(false);
                setSortBy('FEATURED');
                selectDivisionWithTheme('ALL');
              }}
              className="opt-secondary-cta mt-5 rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(item: PublicProductItem, variantName?: string) => addToCart(item, variantName)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Transparent ordering model */}
      <section className="opt-process-panel relative overflow-hidden rounded-[1.75rem] border border-theme-border p-6 sm:p-8 lg:p-10" aria-labelledby="process-heading">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="opt-section-kicker">Simple by design</p>
            <h2 id="process-heading" className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-theme-text sm:text-3xl">
              From your screen to your doorstep.
            </h2>
            <p className="mt-3 max-w-md text-xs leading-6 text-theme-muted">
              You order with us. We verify your QR payment, place the supplier order and coordinate delivery to your address.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Search, step: '01', title: 'Choose your gear', copy: 'Explore the collection and confirm your delivery details.' },
              { icon: QrCode, step: '02', title: 'Pay by QR', copy: 'Complete the QR payment and wait for verification.' },
              { icon: Truck, step: '03', title: 'We coordinate delivery', copy: 'We place the supplier order for direct delivery to you.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="opt-process-step rounded-2xl border border-theme-border bg-black/15 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-theme-muted">STEP {item.step}</span>
                    <Icon className="h-4 w-4 text-theme-accent" />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold text-theme-text">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-theme-muted">{item.copy}</p>
                  <CheckCircle2 className="mt-4 h-4 w-4 text-theme-accent/70" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

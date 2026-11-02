'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLiveCatalog } from '@/features/catalog/useLiveCatalog';
import { PublicProductItem } from '@/types/public-catalog.types';
import { ProductCard } from '@/features/catalog/ProductCard';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import { useStoreCart } from '@/features/catalog/StorefrontShell';
import { DivisionKey } from '@/types/theme.types';

const DIVISION_META: Record<string, { title: string; subtitle: string }> = {
  desk: {
    title: 'O.P.T. // DESK DIVISION',
    subtitle:
      'CNC Aluminum Stands, 55D Memory Foam Cushions & Mechanical Detailing Gear.',
  },
  drive: {
    title: 'O.P.T. // DRIVE DIVISION',
    subtitle:
      'Zero-Rattle Car Seat Organizers, Microfiber Exterior Dusters & Cabin Tools.',
  },
  vault: {
    title: 'O.P.T. // FESTIVE VAULT',
    subtitle:
      'High-Value Seasonal Combos & Executive Desk Makeover Bundles.',
  },
};

export default function CategoryDivisionPage() {
  const params = useParams<{ division: string }>();
  const divisionSlug = (params?.division || 'desk').toLowerCase();
  const { selectDivisionWithTheme } = useOptTheme();
  const { addToCart } = useStoreCart();
  const { products } = useLiveCatalog();

  useEffect(() => {
    const upper = divisionSlug.toUpperCase() as DivisionKey;
    if (upper === 'DESK' || upper === 'DRIVE' || upper === 'VAULT') {
      selectDivisionWithTheme(upper);
    }
  }, [divisionSlug, selectDivisionWithTheme]);

  const divisionProducts: PublicProductItem[] = products.filter(
    (p: PublicProductItem) =>
      p.publicationStatus === 'PUBLISHED' &&
      p.division.toLowerCase() === divisionSlug
  );

  const meta = DIVISION_META[divisionSlug] || DIVISION_META.desk;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-8">
      <div>
        <Link
          href="/"
          onClick={() => selectDivisionWithTheme('ALL')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-muted hover:text-theme-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Divisions</span>
        </Link>

        <h1 className="mt-3 text-3xl font-extrabold text-theme-text">{meta.title}</h1>
        <p className="mt-1 text-sm text-theme-muted">{meta.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {divisionProducts.map((product: PublicProductItem) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(item: PublicProductItem, variantName?: string) =>
              addToCart(item, variantName)
            }
          />
        ))}
      </div>
    </div>
  );
}
'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductsByDivision } from '@/features/catalog/catalog.data';
import { ProductCard } from '@/features/catalog/ProductCard';
import { useStoreCart } from '@/features/catalog/StorefrontShell';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import { DivisionKey } from '@/types/theme.types';

const DIVISION_META: Record<string, { title: string; subtitle: string }> = {
  DESK: {
    title: 'O.P.T. // DESK — Ergonomic WFH & Study Gear',
    subtitle: 'CNC aluminum risers, 55D coccyx support, and mechanical switch detailing tools.',
  },
  DRIVE: {
    title: 'O.P.T. // DRIVE — Car Cabin & Detailing',
    subtitle: 'Zero-rattle console organizers and high-pile microfiber dusters for Indian roads.',
  },
  VAULT: {
    title: 'O.P.T. // FESTIVE VAULT — Limited Bundles',
    subtitle: 'Pre-Diwali Safai makeovers and high-value gifting combos.',
  },
};

export default function CategoryDivisionPage() {
  const params = useParams<{ division: string }>();
  const rawDivision = (params?.division || 'desk').toUpperCase() as DivisionKey;
  const { addToCart } = useStoreCart();
  const { selectDivisionWithTheme } = useOptTheme();

  useEffect(() => {
    if (['DESK', 'DRIVE', 'VAULT'].includes(rawDivision)) {
      selectDivisionWithTheme(rawDivision);
    }
  }, [rawDivision]);

  const products = getProductsByDivision(rawDivision);
  const meta = DIVISION_META[rawDivision] || DIVISION_META.DESK;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="opt-glass mb-8 p-6 sm:p-8">
        <span className="font-mono text-xs uppercase tracking-widest text-theme-accent">
          DIVISION ARCHIVE // {rawDivision}
        </span>
        <h1 className="mt-2 text-2xl font-extrabold text-theme-text sm:text-3xl">
          {meta.title}
        </h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-theme-muted">
          {meta.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </section>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { OPT_PRODUCTS } from './catalog.data';
import {
  PublicProductItem,
  StockRetentionStatus,
} from '@/types/public-catalog.types';

const CATALOG_CACHE_KEY = 'opt_live_catalog_v2';

export function useLiveCatalog() {
  const [products, setProducts] = useState<PublicProductItem[]>(
    OPT_PRODUCTS as PublicProductItem[]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCatalog = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/catalog', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          window.localStorage.setItem(
            CATALOG_CACHE_KEY,
            JSON.stringify(data.products)
          );
          return;
        }
      }
    } catch {
      // Fallback to localStorage cache if offline
      try {
        const cached = window.localStorage.getItem(CATALOG_CACHE_KEY);
        if (cached) {
          setProducts(JSON.parse(cached));
        }
      } catch {
        // Ignore storage read error
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  async function publishProductEverywhere(newProduct: PublicProductItem) {
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ADD_OR_PUBLISH_PRODUCT',
        product: newProduct,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
      window.localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(data.products));
    }
  }

  async function updateProductStockEverywhere(
    sku: string,
    stockStatus: StockRetentionStatus
  ) {
    const res = await fetch('/api/catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE_STOCK_STATUS',
        sku,
        stockStatus,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products);
      window.localStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(data.products));
    }
  }

  return {
    products,
    isLoading,
    refreshCatalog,
    publishProductEverywhere,
    updateProductStockEverywhere,
  };
}
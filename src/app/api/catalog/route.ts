import { NextRequest, NextResponse } from 'next/server';
import { OPT_PRODUCTS } from '@/features/catalog/catalog.data';
import {
  PublicProductItem,
  StockRetentionStatus,
} from '@/types/public-catalog.types';
import { dispatchMultiBotNotification } from '@/features/notifications/botRouter';

// Server-side live catalog state initialized with OPT_PRODUCTS
let LIVE_CATALOG_STORE: PublicProductItem[] = [...(OPT_PRODUCTS as PublicProductItem[])];

export async function GET() {
  return NextResponse.json({
    products: LIVE_CATALOG_STORE,
    updatedAtIso: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'ADD_OR_PUBLISH_PRODUCT') {
      const product = body.product as PublicProductItem;
      if (!product?.sku || !product?.title) {
        return NextResponse.json({ error: 'Invalid product payload.' }, { status: 400 });
      }

      const cleanProduct: PublicProductItem = {
        ...product,
        publicationStatus: 'PUBLISHED',
        inStock:
          product.stockStatus === 'IN_STOCK' || product.stockStatus === 'LOW_STOCK',
      };

      const existsIdx = LIVE_CATALOG_STORE.findIndex(
        (p: PublicProductItem) => p.sku === cleanProduct.sku
      );
      if (existsIdx >= 0) {
        LIVE_CATALOG_STORE[existsIdx] = cleanProduct;
      } else {
        LIVE_CATALOG_STORE = [cleanProduct, ...LIVE_CATALOG_STORE];
      }

      await dispatchMultiBotNotification({
        channel: 'CATALOG_WAITLIST',
        title: `New SKU Published Everywhere: ${cleanProduct.sku}`,
        lines: [
          `Title: ${cleanProduct.title}`,
          `Division: ${cleanProduct.division} | Price: ₹${cleanProduct.price}`,
          `Meta/WhatsApp Feed: Synced`,
        ],
      });

      return NextResponse.json({ ok: true, products: LIVE_CATALOG_STORE });
    }

    if (action === 'UPDATE_STOCK_STATUS') {
      const { sku, stockStatus } = body as {
        sku: string;
        stockStatus: StockRetentionStatus;
      };

      LIVE_CATALOG_STORE = LIVE_CATALOG_STORE.map((p: PublicProductItem) =>
        p.sku === sku
          ? {
              ...p,
              stockStatus,
              inStock: stockStatus === 'IN_STOCK' || stockStatus === 'LOW_STOCK',
            }
          : p
      );

      return NextResponse.json({ ok: true, products: LIVE_CATALOG_STORE });
    }

    return NextResponse.json({ error: 'Unknown catalog action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Catalog update failed.' }, { status: 500 });
  }
}
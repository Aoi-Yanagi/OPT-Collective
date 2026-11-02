'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DevicePlatform } from '@/types/theme.types';
import { CartItem, ProductItem } from '@/types/store.types';
import { OPT_PRODUCTS } from './catalog.data';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { ThemeBar } from '@/components/layout/ThemeBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SlideDrawer } from '@/components/ui/SlideDrawer';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowRight, Plus, Minus } from 'lucide-react';

const CART_STORAGE_KEY = 'opt_collective_bag_v2';

export interface StoreCartContextValue {
  cart: CartItem[];
  addToCart: (item: ProductItem, selectedVariantName?: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  device: ReturnType<typeof useDeviceProfile>;
}

export const CartContext = React.createContext<StoreCartContextValue | null>(null);

export function useStoreCart(): StoreCartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useStoreCart must be used within StorefrontShell');
  return ctx;
}

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [platformOverride, setPlatformOverride] = useState<DevicePlatform | null>(null);
  const device = useDeviceProfile(platformOverride);
  const [cart, setCart] = useState<CartItem[]>([
    {
      ...OPT_PRODUCTS[0],
      quantity: 1,
      selectedVariantName: OPT_PRODUCTS[0].variants?.[0]?.name || 'Obsidian Matte',
    },
  ]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);

  // Hydrate persistent cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }
    } catch {
      // Ignore storage read errors in private browsing
    }
  }, []);

  // Persist cart changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage write errors
    }
  }, [cart]);

  function addToCart(product: ProductItem, selectedVariantName?: string) {
    const variantToUse =
      selectedVariantName || product.variants?.[0]?.name || 'Standard';

    setCart((prev: CartItem[]) => {
      const exists = prev.find(
        (i: CartItem) =>
          i.id === product.id && (i.selectedVariantName || 'Standard') === variantToUse
      );
      if (exists) {
        return prev.map((i: CartItem) =>
          i.id === product.id && (i.selectedVariantName || 'Standard') === variantToUse
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
          selectedVariantName: variantToUse,
        },
      ];
    });
    setIsBagOpen(true);
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev: CartItem[]) =>
      prev
        .map((item: CartItem) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item: CartItem) => item.quantity > 0)
    );
  }

  function removeFromCart(id: string) {
    setCart((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal: number = cart.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        device,
      }}
    >
      <div className="min-h-screen flex flex-col">
        <ThemeBar
          currentPlatform={device.platform}
          onOverridePlatform={(p: DevicePlatform | null) => setPlatformOverride(p)}
        />
        <Navbar
          cartCount={cart.reduce((s: number, i: CartItem) => s + i.quantity, 0)}
          onOpenCart={() => setIsBagOpen(true)}
          device={device}
        />

        <main className="flex-1">{children}</main>

        <Footer />

        <SlideDrawer
          isOpen={isBagOpen}
          onClose={() => setIsBagOpen(false)}
          title="Your O.P.T. Gear Bag"
          subtitle="Persistent Cart • QR-Only Verified Checkout"
        >
          {cart.length === 0 ? (
            <p className="py-12 text-center text-xs text-theme-muted">
              Your bag is empty. Add ergonomic desk or car gear to start the 3-stage QR checkout.
            </p>
          ) : (
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-3">
                {cart.map((item: CartItem) => (
                  <div
                    key={`${item.id}-${item.selectedVariantName || 'std'}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-theme-border bg-white/[0.03] p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-12 w-12 shrink-0 rounded object-cover border border-theme-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-bold text-theme-text">
                        {item.title}
                      </p>
                      <p className="font-mono text-[10px] text-theme-accent">
                        Variant: {item.selectedVariantName || 'Standard'}
                      </p>
                      <p className="font-mono text-[11px] text-theme-muted">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="rounded border border-theme-border p-1 text-theme-muted hover:text-theme-text"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-1.5 font-mono text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="rounded border border-theme-border p-1 text-theme-muted hover:text-theme-text"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-1 p-1 text-theme-muted hover:text-rose-400"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-theme-border pt-4">
                <div className="flex items-center justify-between text-sm font-bold text-theme-text">
                  <span>Total Payable (Free Hub Dispatch)</span>
                  <span className="font-mono text-base text-theme-accent">₹{subtotal}</span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-3 w-full"
                  onClick={() => {
                    setIsBagOpen(false);
                    router.push('/checkout');
                  }}
                >
                  <span>Proceed to 3-Stage QR Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SlideDrawer>
      </div>
    </CartContext.Provider>
  );
}
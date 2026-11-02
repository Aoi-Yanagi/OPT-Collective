'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CartItem, ProductItem } from '@/types/store.types';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SlideDrawer } from '@/components/ui/SlideDrawer';
import { Button } from '@/components/ui/Button';
import { Trash2, ArrowRight, Plus, Minus, ShoppingBag } from 'lucide-react';

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
  const context = React.useContext(CartContext);
  if (!context) throw new Error('useStoreCart must be used within StorefrontShell');
  return context;
}

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const device = useDeviceProfile();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed as CartItem[]);
      }
    } catch {
      // Ignore invalid or inaccessible local storage without blocking the storefront.
    } finally {
      setCartHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // The in-memory cart remains usable when storage is unavailable.
    }
  }, [cart, cartHydrated]);

  function addToCart(product: ProductItem, selectedVariantName?: string): void {
    const variantToUse = selectedVariantName || product.variants?.[0]?.name || 'Standard';
    setCart((previous) => {
      const exists = previous.find((item) =>
        item.id === product.id && (item.selectedVariantName || 'Standard') === variantToUse
      );
      if (exists) {
        return previous.map((item) =>
          item.id === product.id && (item.selectedVariantName || 'Standard') === variantToUse
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...previous, { ...product, quantity: 1, selectedVariantName: variantToUse }];
    });
    setIsBagOpen(true);
  }

  function updateQuantity(id: string, delta: number): void {
    setCart((previous) => previous
      .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeFromCart(id: string): void {
    setCart((previous) => previous.filter((item) => item.id !== id));
  }

  function clearCart(): void {
    setCart([]);
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, device }}>
      <div className="opt-storefront min-h-screen flex flex-col">
        <Navbar cartCount={cartCount} onOpenCart={() => setIsBagOpen(true)} device={device} />
        <main className="min-w-0 flex-1">{children}</main>
        <Footer />

        <SlideDrawer
          isOpen={isBagOpen}
          onClose={() => setIsBagOpen(false)}
          title="Your considered collection"
          subtitle="Your bag is saved on this device · payment happens after order review"
        >
          {cart.length === 0 ? (
            <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-theme-border bg-theme-matte text-theme-accent"><ShoppingBag className="h-7 w-7" /></span>
              <h3 className="mt-5 text-base font-semibold text-theme-text">A little room for something good.</h3>
              <p className="mt-2 max-w-xs text-xs leading-6 text-theme-muted">Your bag is empty. Explore the collection and add an object that makes your everyday better.</p>
              <button type="button" onClick={() => setIsBagOpen(false)} className="opt-primary-cta mt-5 rounded-full px-5 py-2.5 text-xs font-semibold">Continue exploring</button>
            </div>
          ) : (
            <div className="flex min-h-full flex-col justify-between gap-6">
              <div className="space-y-3">
                {cart.map((item) => (
                  <article key={`${item.id}-${item.selectedVariantName || 'std'}`} className="flex items-center gap-3 rounded-2xl border border-theme-border bg-theme-surface p-3">
                    <img src={item.image} alt={item.title} className="h-16 w-16 shrink-0 rounded-xl border border-theme-border object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-theme-text">{item.title}</p>
                      <p className="mt-1 text-[10px] text-theme-muted">{item.selectedVariantName || 'Standard'}</p>
                      <p className="mt-1 font-mono text-[11px] font-semibold text-theme-accent">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.title} quantity`} className="rounded-full border border-theme-border p-1.5 text-theme-muted hover:text-theme-text"><Minus className="h-3 w-3" /></button>
                      <span className="min-w-5 text-center font-mono text-[11px] text-theme-text">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.title} quantity`} className="rounded-full border border-theme-border p-1.5 text-theme-muted hover:text-theme-text"><Plus className="h-3 w-3" /></button>
                      <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title}`} className="ml-1 rounded-full p-1.5 text-theme-muted transition hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="sticky bottom-0 border-t border-theme-border bg-theme-canvas/95 pt-4 backdrop-blur-xl">
                <div className="flex items-center justify-between text-sm font-semibold text-theme-text">
                  <span>Subtotal</span><span className="font-mono text-lg text-theme-accent">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="mt-1 text-[10px] leading-5 text-theme-muted">Final order details and delivery information are confirmed before QR payment.</p>
                <Button variant="primary" size="lg" className="mt-3 w-full" onClick={() => { setIsBagOpen(false); router.push('/checkout'); }}>
                  Review your order <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SlideDrawer>
      </div>
    </CartContext.Provider>
  );
}

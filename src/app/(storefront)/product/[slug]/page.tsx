'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import {
  getProductBySlugOrSku,
  getProductsByDivision,
} from '@/features/catalog/catalog.data';
import { useStoreCart } from '@/features/catalog/StorefrontShell';
import { ProductShareButton } from '@/features/social/SocialHub';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProductCard } from '@/features/catalog/ProductCard';

export default function ReusableProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slugParam = params?.slug || '';
  const product = getProductBySlugOrSku(slugParam);
  const { addToCart } = useStoreCart();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0]?.name || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pinEstimate, setPinEstimate] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <GlassCard className="p-8">
          <h1 className="text-xl font-bold text-theme-text">Hardware Unit Not Found</h1>
          <p className="mt-2 text-xs text-theme-muted">
            The requested product slug ({slugParam}) is not currently active in the catalog.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-opt-btn bg-theme-accent px-4 py-2 text-xs font-bold text-theme-accent-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Storefront</span>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const gallery =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const isUnavailable =
    product.stockStatus === 'OUT_OF_STOCK' || product.stockStatus === 'RESTOCKING_SOON';
  const relatedProducts = getProductsByDivision(product.division)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  function handleCheckPin() {
    if (!/^\d{6}$/.test(pincode)) {
      setPinEstimate('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPinEstimate(
      `PIN ${pincode} captured. Delivery availability and the current estimate will be confirmed after supplier-side checks.`
    );
  }

  function handleAddQuantityToBag() {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-14">
      {/* Top Breadcrumb & Share Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/category/${product.division.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-muted hover:text-theme-accent transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to O.P.T. // {product.division}</span>
        </Link>

        <ProductShareButton
          title={product.title}
          text={product.subtitle}
          urlPath={`/product/${product.slug}`}
        />
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Column: Multi-Angle Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="opt-glass relative h-80 sm:h-[420px] w-full overflow-hidden p-2">
            <img
              src={gallery[activeImageIdx] || product.image}
              alt={product.title}
              className="h-full w-full rounded-lg object-cover"
            />
            <span className="absolute left-5 top-5 rounded-full bg-black/80 px-3 py-1 font-mono text-xs font-bold text-theme-accent">
              {product.sku} // {product.badge}
            </span>
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activeImageIdx === idx
                      ? 'border-theme-accent'
                      : 'border-theme-border opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product details, pricing and availability */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-theme-muted">
              <span className="font-semibold uppercase tracking-[0.12em]">O.P.T. {product.division}</span>
              <span>·</span>
              <span>{product.sku}</span>
            </div>

            <h1 className="mt-2 text-2xl font-extrabold text-theme-text sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-theme-muted">
              {product.description || product.subtitle}
            </p>
          </div>

          {/* Pricing Block */}
          <div className="opt-matte-surface flex items-center justify-between gap-4 p-4">
            <div>
              <span className="block text-xs text-theme-muted">Current O.P.T. price</span>
              <span className="mt-0.5 block text-2xl font-bold tracking-tight text-theme-text">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right text-xs">
              {isUnavailable ? (
                <span className="font-semibold text-amber-700">Temporarily unavailable</span>
              ) : (
                <span className="font-semibold text-theme-accent">Available to order</span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <label className="block font-mono text-xs font-semibold uppercase text-theme-muted">
                Select Finish / Variant: <strong className="text-theme-text">{selectedVariant}</strong>
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v.name)}
                    className={`rounded-opt-btn border px-3.5 py-2 text-xs font-semibold transition ${
                      selectedVariant === v.name
                        ? 'border-theme-accent bg-theme-accent text-theme-accent-fg'
                        : 'border-theme-border bg-theme-surface text-theme-text hover:border-theme-accent/50'
                    }`}
                  >
                    {v.name} {v.priceDeltaInr > 0 ? `(+₹${v.priceDeltaInr})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to bag or show an honest unavailable state. */}
          {isUnavailable ? (
            <div className="rounded-xl border border-theme-border bg-theme-surface p-4">
              <p className="text-sm font-semibold text-theme-text">This item is temporarily unavailable.</p>
              <p className="mt-1 text-xs leading-relaxed text-theme-muted">
                Availability is checked as part of the merchant fulfillment process. Please revisit this product later.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-opt-btn border border-theme-border bg-theme-surface px-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-2 text-sm font-bold text-theme-muted hover:text-theme-text"
                >
                  −
                </button>
                <span className="px-3 font-mono text-xs font-bold text-theme-text">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-2.5 py-2 text-sm font-bold text-theme-muted hover:text-theme-text"
                >
                  +
                </button>
              </div>
              <Button variant="primary" size="lg" className="flex-1" onClick={handleAddQuantityToBag}>
                <ShoppingBag className="h-4 w-4" />
                <span>Add {quantity} to Bag — ₹{product.price * quantity}</span>
              </Button>
            </div>
          )}

          {/* PIN Code Delivery Check */}
          <div className="opt-matte-surface p-4 space-y-2">
            <label className="flex items-center gap-1.5 font-mono text-xs font-semibold text-theme-text">
              <MapPin className="h-3.5 w-3.5 text-theme-accent" />
              <span>Check delivery details</span>
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Enter 6-Digit PIN Code"
                maxLength={6}
                inputMode="numeric"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-48 rounded-lg border border-theme-border bg-theme-surface px-3 py-1.5 font-mono text-xs text-theme-text"
              />
              <Button variant="outline" size="sm" onClick={handleCheckPin}>
                Continue
              </Button>
            </div>
            {pinEstimate && <p className="text-xs text-theme-accent pt-1">{pinEstimate}</p>}
          </div>

          {/* Transparent merchant-assisted supplier fulfillment explanation. */}
          <div className="rounded-xl border border-theme-border bg-theme-surface p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-theme-text">
              <ShieldCheck className="h-4 w-4 shrink-0 text-theme-accent" />
              <span>How fulfillment works</span>
            </div>
            <p className="leading-relaxed text-theme-muted">
              You place your order with O.P.T. After payment verification, the merchant places the supplier order using the delivery details you provide. The supplier ships the product directly to your address, and order updates are recorded against your O.P.T. order reference.
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="border-t border-theme-border pt-4">
            <h3 className="font-mono text-xs font-bold uppercase text-theme-accent">
              Hardware Specifications
            </h3>
            <ul className="mt-2.5 space-y-1.5">
              {product.specs.map((s) => (
                <li key={s} className="flex items-center gap-2 text-xs text-theme-muted">
                  <CheckCircle2 className="h-3.5 w-3.5 text-theme-accent shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="border-t border-theme-border pt-10">
        <div className="opt-matte-surface p-5 sm:p-6">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-theme-accent">Customer feedback</span>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-theme-text">Reviews are being prepared.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-theme-muted">
            Customer ratings will be displayed after the delivered-order review and merchant approval workflow is connected. No sample reviews or unverified ratings are shown.
          </p>
        </div>
      </section>

      {/* Related Division Gear */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-theme-border pt-10">
          <h2 className="mb-6 text-lg font-bold text-theme-text">
            Related {product.division} Hardware
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onAddToCart={(item) => addToCart(item)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
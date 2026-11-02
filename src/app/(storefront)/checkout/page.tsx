'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  HeartHandshake,
  ArrowLeft,
  ArrowRight,
  Edit3,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useStoreCart } from '@/features/catalog/StorefrontShell';
import { CartItem } from '@/types/store.types';
import {
  CustomerDeliveryDetails,
  OrderLineSnapshot,
  OrderRecord,
  PaymentUiPresentationState,
} from '@/types/order-lifecycle.types';
import { PaymentQrPanel } from '@/features/payment/PaymentQrPanel';
import { ForensicsScanResult } from '@/types/checkout.types';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

type CheckoutStage = 1 | 2 | 3;

export default function DedicatedThreeStageCheckoutPage() {
  const { cart, device, clearCart } = useStoreCart();
  const [stage, setStage] = useState<CheckoutStage>(1);

  const [delivery, setDelivery] = useState<CustomerDeliveryDetails>({
    fullName: '',
    mobileNumber: '',
    email: '',
    addressLine: '',
    apartmentOrLandmark: '',
    city: '',
    state: '',
    pincode: '',
    deliveryInstructions: '',
  });

  const [addressConfirmed, setAddressConfirmed] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);

  const [persistedOrder, setPersistedOrder] = useState<OrderRecord | null>(null);
  const [paymentUiState, setPaymentUiState] =
    useState<PaymentUiPresentationState>('QR_AVAILABLE');
  const [paymentStatusMsg, setPaymentStatusMsg] = useState<string>(
    'Scan the merchant QR code to complete your exact payment, then click Request Verification.'
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const subtotal: number = cart.reduce(
    (sum: number, i: CartItem) => sum + i.price * i.quantity,
    0
  );

  function handleStage1Submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!delivery.fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^\d{10}$/.test(delivery.mobileNumber)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!delivery.addressLine.trim() || !delivery.city.trim() || !delivery.state.trim()) {
      setFormError('Please complete your street address, city, and state.');
      return;
    }
    if (!/^\d{6}$/.test(delivery.pincode)) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setStage(2);
  }

  async function handleConfirmOrderAndGenerateQr() {
    if (!addressConfirmed) {
      setFormError(
        'Please confirm that your delivery address and contact details are accurate.'
      );
      return;
    }
    setFormError(null);
    setIsCreatingOrder(true);

    try {
      const itemsSnapshot: OrderLineSnapshot[] = cart.map((item: CartItem) => ({
        productId: item.id,
        sku: item.sku,
        slug: item.slug,
        title: item.title,
        selectedVariant:
          item.selectedVariantName || item.variants?.[0]?.name || 'Standard',
        quantity: item.quantity,
        unitPriceInr: item.price,
        lineTotalInr: item.price * item.quantity,
        image: item.image,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_PENDING_ORDER',
          delivery,
          items: itemsSnapshot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.order) {
        setFormError(data.error || 'Could not create pending order.');
        return;
      }

      setPersistedOrder(data.order);
      setPaymentUiState('QR_AVAILABLE');
      setStage(3);
      clearCart();
    } catch {
      setFormError('Network error while creating durable order snapshot.');
    } finally {
      setIsCreatingOrder(false);
    }
  }

  async function handleRequestVerification(params: {
    customerSubmittedRef: string;
    forensics: ForensicsScanResult | null;
  }) {
    if (!persistedOrder) return;
    setIsVerifying(true);
    setPaymentUiState('VERIFICATION_IN_PROGRESS');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REQUEST_PAYMENT_VERIFICATION',
          orderReference: persistedOrder.orderReference,
          customerSubmittedRef: params.customerSubmittedRef,
          forensics: params.forensics,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.verificationResult) {
        setPaymentUiState('VERIFICATION_TEMPORARILY_UNAVAILABLE');
        setPaymentStatusMsg(
          'Verification service timed out. Your order and payment attempt are safely preserved—please retry shortly.'
        );
        return;
      }

      setPersistedOrder(data.order);
      setPaymentUiState(data.verificationResult.uiState);
      setPaymentStatusMsg(data.verificationResult.message);
    } catch {
      setPaymentUiState('VERIFICATION_TEMPORARILY_UNAVAILABLE');
      setPaymentStatusMsg(
        'Technical verification interruption. Your order reference is preserved—do not make a duplicate payment.'
      );
    } finally {
      setIsVerifying(false);
    }
  }

  const stageSteps: { num: CheckoutStage; label: string }[] = [
    { num: 1, label: '1. Delivery Info' },
    { num: 2, label: '2. Order Review' },
    { num: 3, label: '3. QR Payment' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme-border pb-5">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-theme-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <h1 className="mt-1 text-2xl font-extrabold text-theme-text">
            O.P.T. Collective — Dedicated QR Checkout
          </h1>
        </div>

        <ol className="flex items-center gap-2 font-mono text-xs">
          {stageSteps.map((step: { num: CheckoutStage; label: string }) => (
            <li
              key={step.num}
              className={`rounded-full px-3 py-1 font-bold transition ${
                stage === step.num
                  ? 'bg-theme-accent text-theme-accent-fg'
                  : stage > step.num
                  ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border border-theme-border bg-white/5 text-theme-muted'
              }`}
            >
              {step.label}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <HeartHandshake className="h-4 w-4 shrink-0" />
          <span>Independent Student-Engineered Hardware Studio // Direct Hub Dispatch</span>
        </div>
        <p className="mt-1 leading-relaxed text-amber-100/90">
          We keep our ergonomic gear ₹400–₹700 more affordable by shipping directly from vetted partner hubs and using zero-fee QR verification. If you love our precision aesthetic, share <strong>The O.P.T. Collective</strong> with your study & driving circle!
        </p>
      </div>

      {formError && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-xs font-semibold text-rose-200">
          {formError}
        </div>
      )}

      {stage === 1 && (
        <GlassCard className="p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
            Stage 1 // Customer Delivery Information (No Account Required)
          </h2>

          <form
            onSubmit={handleStage1Submit}
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="block text-xs font-medium text-theme-text">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                required
                autoComplete="name"
                value={delivery.fullName}
                onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })}
                placeholder="e.g., Aarav Verma"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-theme-text">
                10-Digit Mobile Number (WhatsApp Updates) <span className="text-rose-400">*</span>
              </label>
              <input
                required
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={delivery.mobileNumber}
                onChange={(e) =>
                  setDelivery({
                    ...delivery,
                    mobileNumber: e.target.value.replace(/\D/g, ''),
                  })
                }
                placeholder="10-digit mobile number"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 font-mono text-xs text-theme-text"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-theme-text">
                Email Address{' '}
                <span className="text-theme-muted">(Optional — for PDF Receipt delivery)</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                value={delivery.email}
                onChange={(e) => setDelivery({ ...delivery, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-theme-text">
                Street Address / House & Floor <span className="text-rose-400">*</span>
              </label>
              <input
                required
                autoComplete="street-address"
                value={delivery.addressLine}
                onChange={(e) => setDelivery({ ...delivery, addressLine: e.target.value })}
                placeholder="House/Flat No., Building, Street"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-theme-text">
                Apartment, Suite, or Landmark <span className="text-theme-muted">(Optional)</span>
              </label>
              <input
                value={delivery.apartmentOrLandmark}
                onChange={(e) =>
                  setDelivery({ ...delivery, apartmentOrLandmark: e.target.value })
                }
                placeholder="Near Metro Station / Landmark"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-theme-text">
                City / District <span className="text-rose-400">*</span>
              </label>
              <input
                required
                autoComplete="address-level2"
                value={delivery.city}
                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                placeholder="City"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-theme-text">
                State <span className="text-rose-400">*</span>
              </label>
              <input
                required
                autoComplete="address-level1"
                value={delivery.state}
                onChange={(e) => setDelivery({ ...delivery, state: e.target.value })}
                placeholder="State"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-theme-text">
                6-Digit Indian PIN Code <span className="text-rose-400">*</span>
              </label>
              <input
                required
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={delivery.pincode}
                onChange={(e) =>
                  setDelivery({
                    ...delivery,
                    pincode: e.target.value.replace(/\D/g, ''),
                  })
                }
                placeholder="6-digit PIN"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 font-mono text-xs text-theme-text"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-theme-text">
                Delivery Instructions <span className="text-theme-muted">(Optional)</span>
              </label>
              <input
                value={delivery.deliveryInstructions}
                onChange={(e) =>
                  setDelivery({ ...delivery, deliveryInstructions: e.target.value })
                }
                placeholder="Gate code or preferred call window"
                className="mt-1 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 text-xs text-theme-text"
              />
            </div>

            <div className="sm:col-span-2 pt-3">
              <Button type="submit" variant="primary" size="lg" className="w-full">
                <span>Continue to Stage 2: Order Review</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      {stage === 2 && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-theme-border pb-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
              Stage 2 // Review Order & Confirm Delivery Snapshot
            </h2>
            <button
              type="button"
              onClick={() => setStage(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-theme-accent hover:underline"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Delivery Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="opt-matte-surface p-4 text-xs space-y-1.5">
              <span className="font-mono text-[10px] uppercase text-theme-muted">
                Delivery Destination
              </span>
              <p className="font-bold text-theme-text">{delivery.fullName}</p>
              <p className="text-theme-muted">{delivery.addressLine}</p>
              {delivery.apartmentOrLandmark && (
                <p className="text-theme-muted">{delivery.apartmentOrLandmark}</p>
              )}
              <p className="text-theme-muted">
                {delivery.city}, {delivery.state} — {delivery.pincode}
              </p>
              <p className="font-mono text-theme-accent pt-1">
                Mobile: +91 {delivery.mobileNumber}
              </p>
            </div>

            <div className="opt-matte-surface p-4 text-xs space-y-2">
              <span className="font-mono text-[10px] uppercase text-theme-muted">
                Order Items ({cart.length})
              </span>
              {cart.map((item: CartItem) => (
                <div
                  key={`${item.id}-${item.selectedVariantName || 'std'}`}
                  className="flex items-center justify-between border-b border-theme-border pb-2"
                >
                  <div>
                    <p className="font-semibold text-theme-text">{item.title}</p>
                    <p className="font-mono text-[10px] text-theme-muted">
                      {item.sku} • {item.selectedVariantName || 'Standard'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-theme-text">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 text-sm font-black text-theme-text">
                <span>Subtotal (Free Partner Hub Delivery)</span>
                <span className="text-theme-accent">₹{subtotal}</span>
              </div>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-theme-border bg-white/[0.02] p-3.5 text-xs text-theme-text">
            <input
              type="checkbox"
              checked={addressConfirmed}
              onChange={(e) => setAddressConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-theme-border"
            />
            <span>
              I confirm that my delivery address, 6-digit PIN code ({delivery.pincode}), and mobile number ({delivery.mobileNumber}) are accurate.
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => setStage(1)}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Delivery Form</span>
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={isCreatingOrder}
              onClick={handleConfirmOrderAndGenerateQr}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isCreatingOrder
                  ? 'Snapshotting Order & Preparing QR...'
                  : 'Confirm Order & Proceed to Stage 3 (QR Payment)'}
              </span>
            </Button>
          </div>
        </GlassCard>
      )}

      {stage === 3 && persistedOrder && persistedOrder.paymentSession && (
        <div className="space-y-6">
          <PaymentQrPanel
            session={persistedOrder.paymentSession}
            uiState={paymentUiState}
            statusMessage={paymentStatusMsg}
            device={device}
            isSubmittingVerification={isVerifying}
            onRequestVerification={handleRequestVerification}
          />

          <GlassCard className="p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase text-theme-accent flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Order Acknowledgement (Pre-Confirmation Record)
              </span>
              <span className="font-mono text-[11px] text-theme-muted">
                Status: {persistedOrder.paymentStatus}
              </span>
            </div>
            <p className="text-theme-muted leading-relaxed">
              Your order reference{' '}
              <strong className="text-theme-text">{persistedOrder.orderReference}</strong> has been saved. You can track verification and fulfillment anytime on the Order Tracking page using your Order Reference and the last 4 digits of your phone number (
              <strong>{persistedOrder.delivery.mobileNumber.slice(-4)}</strong>).
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={`/track?ref=${persistedOrder.orderReference}&pin=${persistedOrder.delivery.mobileNumber.slice(-4)}`}
                className="inline-flex items-center gap-1.5 rounded-opt-btn bg-theme-accent px-4 py-2 text-xs font-bold text-theme-accent-fg"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Open Live Order Tracking & Receipt Page</span>
              </Link>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  PaymentStatus,
  FulfillmentStatus,
  OrderLineSnapshot,
} from '@/types/order-lifecycle.types';
import { getCustomerTrackingTimeline } from '@/features/orders/orderStateMachine';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

interface MaskedOrderLookupView {
  orderReference: string;
  createdAtIso: string;
  maskedCustomerName: string;
  cityStatePin: string;
  itemsSnapshot: OrderLineSnapshot[];
  payableAmountInr: string;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  receiptNumber?: string;
  confirmedPaymentReference?: string;
  paymentConfirmedAtIso?: string;
  trackingId?: string;
  courierPartner?: string;
  eventHistory: { timestampIso: string; statusLabel: string; note: string }[];
}

export default function CustomerOrderTrackingPage() {
  const [orderRefInput, setOrderRefInput] = useState<string>('OPT-2026-DEMO-9012');
  const [mobileLast4Input, setMobileLast4Input] = useState<string>('0000');
  const [orderData, setOrderData] = useState<MaskedOrderLookupView | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  async function fetchOrderStatus(refToFetch: string, pinToFetch: string) {
    if (!refToFetch.trim() || !pinToFetch.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/orders?orderReference=${encodeURIComponent(
          refToFetch.trim()
        )}&token=${encodeURIComponent(pinToFetch.trim())}`
      );
      const data = await res.json();
      if (!res.ok || !data.order) {
        setOrderData(null);
        setErrorMsg(data.error || 'Could not locate order with those credentials.');
        return;
      }
      setOrderData(data.order);
    } catch {
      setErrorMsg('Network error while retrieving order status.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      const pinParam = params.get('pin');
      if (refParam && pinParam) {
        setOrderRefInput(refParam);
        setMobileLast4Input(pinParam);
        fetchOrderStatus(refParam, pinParam);
      }
    }
  }, []);

  const timeline = orderData
    ? getCustomerTrackingTimeline(orderData.paymentStatus, orderData.fulfillmentStatus)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-8">
      <div>
        <span className="font-mono text-xs font-bold uppercase text-theme-accent">
          PRIVACY-SHIELDED ORDER TRACKING & RECEIPT DESK
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-theme-text">
          Track Your O.P.T. Collective Order & Download Receipt
        </h1>
        <p className="mt-1 text-xs text-theme-muted">
          Enter your Order Reference and the last 4 digits of your mobile number. Personal names are automatically masked for your privacy.
        </p>
      </div>

      {/* Secure Lookup Form */}
      <GlassCard className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrderStatus(orderRefInput, mobileLast4Input);
          }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-12"
        >
          <input
            placeholder="Order Reference (e.g., OPT-2026-DEMO-9012)"
            value={orderRefInput}
            onChange={(e) => setOrderRefInput(e.target.value)}
            className="sm:col-span-6 rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 font-mono text-xs text-theme-text"
          />
          <input
            placeholder="Last 4 digits of Mobile (e.g., 0000)"
            maxLength={20}
            value={mobileLast4Input}
            onChange={(e) => setMobileLast4Input(e.target.value)}
            className="sm:col-span-3 rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 font-mono text-xs text-theme-text"
          />
          <div className="sm:col-span-3">
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              <Search className="h-3.5 w-3.5" />
              <span>{loading ? 'Checking...' : 'Track Order'}</span>
            </Button>
          </div>
        </form>

        {errorMsg && (
          <p className="mt-3 text-xs font-semibold text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </p>
        )}
      </GlassCard>

      {orderData && (
        <div className="space-y-6">
          {/* Privacy-Masked Order Summary */}
          <GlassCard className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-theme-accent">
                    {orderData.orderReference}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(orderData.orderReference);
                      setCopiedRef(true);
                      setTimeout(() => setCopiedRef(false), 2000);
                    }}
                    className="rounded border border-theme-border p-1 text-theme-muted hover:text-theme-text"
                    title="Copy Order Reference"
                  >
                    {copiedRef ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-theme-muted mt-0.5">
                  Customer (Encrypted Display): <strong className="text-theme-text font-mono">{orderData.maskedCustomerName}</strong> • {orderData.cityStatePin}
                </p>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="block text-theme-muted">Payment: {orderData.paymentStatus}</span>
                <span className="block text-theme-accent font-bold">
                  Fulfillment: {orderData.fulfillmentStatus}
                </span>
              </div>
            </div>

            {/* 7-Stage Progress Timeline */}
            <div>
              <h2 className="font-mono text-xs font-bold uppercase text-theme-accent mb-4">
                7-Stage Order & Partner Hub Dispatch Lifecycle
              </h2>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-7">
                {timeline.map((step) => (
                  <div
                    key={step.step}
                    className={`rounded-lg border p-3 text-xs transition ${
                      step.completed
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                        : 'border-theme-border bg-black/30 text-theme-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span>0{step.step}</span>
                      {step.completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                    <p className="mt-1.5 font-semibold leading-snug">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Payment Receipt vs Pre-Payment Acknowledgement */}
            <div className="opt-matte-surface p-5 space-y-4">
              {orderData.paymentStatus === 'CONFIRMED' ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-border pb-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                        OFFICIAL CONFIRMED PAYMENT RECEIPT
                      </span>
                      <p className="font-mono text-xs text-theme-muted mt-0.5">
                        Receipt No: {orderData.receiptNumber || `RCPT-${orderData.orderReference}`} • Confirmed Ref: {orderData.confirmedPaymentReference || 'Verified'}
                      </p>
                    </div>
                    <Button variant="primary" size="sm" onClick={() => window.print()}>
                      <Printer className="h-3.5 w-3.5" />
                      <span>Download / Print Receipt PDF</span>
                    </Button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {orderData.itemsSnapshot.map((item: OrderLineSnapshot) => (
                      <div key={item.sku} className="flex justify-between">
                        <span>
                          {item.title} ({item.selectedVariant}) × {item.quantity}
                        </span>
                        <span className="font-mono font-bold">₹{item.lineTotalInr}</span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-theme-border pt-2 text-sm font-black text-theme-accent">
                      <span>Total Confirmed Paid</span>
                      <span className="font-mono">₹{orderData.payableAmountInr}</span>
                    </div>
                    <p className="pt-2 text-[10px] text-theme-muted">
                      Payment Receipt issued by The O.P.T. Collective against verified payment record. (Note: Standard payment receipt; not a GST tax invoice).
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-xs space-y-1.5">
                  <span className="font-mono font-bold text-amber-300 uppercase">
                    Pre-Payment Order Acknowledgement (Receipt Locked Until Payment Confirmation)
                  </span>
                  <p className="text-theme-muted">
                    Official PDF payment receipts are unlocked automatically as soon as your ₹{orderData.payableAmountInr} QR payment is confirmed by the verification ledger.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
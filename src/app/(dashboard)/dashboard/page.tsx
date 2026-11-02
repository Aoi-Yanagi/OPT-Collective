'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  PackageCheck,
  CheckCircle2,
  XCircle,
  MessageSquareShare,
  Video,
  RefreshCw,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import {
  FulfillmentStatus,
  OrderRecord,
  OrderLineSnapshot,
} from '@/types/order-lifecycle.types';

interface PendingReviewItem {
  id: string;
  productSku: string;
  orderReference: string;
  customerName: string;
  rating: number;
  text: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_REVIEWS: PendingReviewItem[] = [
  {
    id: 'rev-101',
    productSku: 'OPT-DESK-001',
    orderReference: 'OPT-2026-4102',
    customerName: 'Rohan K.',
    rating: 5,
    text: 'Zero wobble on my 16-inch laptop and keeps the base cool during lectures.',
    status: 'PENDING',
  },
];

const WEEKLY_PERFORMANCE_BARS = [
  { day: 'Mon', grossInr: 1198, netProfitInr: 818 },
  { day: 'Tue', grossInr: 1847, netProfitInr: 1257 },
  { day: 'Wed', grossInr: 1498, netProfitInr: 1024 },
  { day: 'Thu', grossInr: 2396, netProfitInr: 1636 },
  { day: 'Fri', grossInr: 2995, netProfitInr: 2045 },
  { day: 'Sat', grossInr: 3594, netProfitInr: 2454 },
  { day: 'Sun', grossInr: 4193, netProfitInr: 2863 },
];

export default function AdminOverviewAndFulfillmentPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [expandedRef, setExpandedRef] = useState<string | null>(
    'OPT-2026-DEMO-9012'
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PendingReviewItem[]>(INITIAL_REVIEWS);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [selectedPromptType, setSelectedPromptType] = useState<
    'VERIFIED_RECEIPT' | 'HUB_DISPATCHED' | 'UNBOXING_SHIELD'
  >('VERIFIED_RECEIPT');

  const fetchLiveOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch {
      // Ignore fetch error
    }
  }, []);

  useEffect(() => {
    fetchLiveOrders();
  }, [fetchLiveOrders]);

  function copyText(key: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  }

  function copyFullFulfillmentPacket(order: OrderRecord) {
    const itemsText = order.itemsSnapshot
      .map(
        (i: OrderLineSnapshot) =>
          `${i.title} [${i.sku}] | Variant: ${i.selectedVariant} | Qty: ${i.quantity}`
      )
      .join('\n');

    const packet = [
      `=== O.P.T. COLLECTIVE FULFILLMENT PACKET ===`,
      `Order Ref: ${order.orderReference}`,
      itemsText,
      `--- CUSTOMER DELIVERY ---`,
      `Name: ${order.delivery.fullName}`,
      `Mobile: ${order.delivery.mobileNumber}`,
      `Address: ${order.delivery.addressLine}, ${order.delivery.city}, ${order.delivery.state} - ${order.delivery.pincode}`,
      `Instructions: ${order.delivery.deliveryInstructions || 'None'}`,
    ].join('\n');

    copyText(`full-${order.orderReference}`, packet);
  }

  async function handleAdminOrderUpdate(
    orderReference: string,
    updates: {
      nextPaymentStatus?: OrderRecord['paymentStatus'];
      nextFulfillmentStatus?: FulfillmentStatus;
      trackingId?: string;
    }
  ) {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderReference,
        ...updates,
      }),
    });
    if (res.ok) {
      await fetchLiveOrders();
    }
  }

  function buildAutomatedWhatsAppPrompt(order: OrderRecord): string {
    const itemTitles = order.itemsSnapshot
      .map((i: OrderLineSnapshot) => i.title)
      .join(', ');
    const trackUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/track?ref=${order.orderReference}&pin=${order.delivery.mobileNumber.slice(-4)}`
        : `/track?ref=${order.orderReference}`;

    const prompts = {
      VERIFIED_RECEIPT: `Hi ${order.delivery.fullName}! Your QR payment of ₹${order.payableAmountInr} for *${itemTitles}* is authoritatively confirmed. Official Order Ref: *${order.orderReference}*. View & download your PDF receipt here: ${trackUrl}`,
      HUB_DISPATCHED: `Great news ${order.delivery.fullName}! Your O.P.T. Collective order (*${order.orderReference}*) has been dispatched from our partner hub in neutral packaging. Courier Tracking ID: *${order.trackingId || 'Updating Shortly'}*. Live status: ${trackUrl}`,
      UNBOXING_SHIELD: `Hi ${order.delivery.fullName}, your O.P.T. Collective parcel (*${order.orderReference}*) is arriving soon! Please record a quick 30-second unboxing video while opening the outer packet to activate your 7-Day Free Replacement Shield.`,
    };
    return `https://wa.me/91${order.delivery.mobileNumber}?text=${encodeURIComponent(
      prompts[selectedPromptType]
    )}`;
  }

  function moderateReview(id: string, status: 'APPROVED' | 'REJECTED') {
    setReviews((prev: PendingReviewItem[]) =>
      prev.map((r: PendingReviewItem) => (r.id === id ? { ...r, status } : r))
    );
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Graphical Performance Telemetry */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-border pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-theme-accent" />
            <h2 className="font-mono text-xs font-bold uppercase text-theme-accent">
              Graphical Performance Telemetry // Gross Revenue vs. Net Margin
            </h2>
          </div>
          <span className="font-mono text-xs text-theme-muted">
            Avg Net Margin: 68.4% • Target: ≥₹15,000 / Month
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-end">
          <div className="lg:col-span-8 opt-matte-surface p-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted mb-3">
              <span>7-Day Trajectory (Emerald = Net Profit • Slate = Supplier COGS)</span>
              <span className="text-emerald-400 font-bold">7-Day Net Profit: ₹12,097</span>
            </div>
            <svg viewBox="0 0 560 170" className="w-full h-40 overflow-visible">
              {WEEKLY_PERFORMANCE_BARS.map((bar, idx: number) => {
                const x = idx * 78 + 20;
                const grossHeight = Math.round((bar.grossInr / 4500) * 120);
                const profitHeight = Math.round((bar.netProfitInr / 4500) * 120);
                return (
                  <g key={bar.day}>
                    <rect
                      x={x}
                      y={135 - grossHeight}
                      width="22"
                      height={grossHeight}
                      rx="4"
                      fill="rgba(148, 163, 184, 0.28)"
                    />
                    <rect
                      x={x + 24}
                      y={135 - profitHeight}
                      width="22"
                      height={profitHeight}
                      rx="4"
                      fill="#10b981"
                    />
                    <text
                      x={x + 23}
                      y={128 - profitHeight}
                      textAnchor="middle"
                      fill="#10b981"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      +₹{bar.netProfitInr}
                    </text>
                    <text
                      x={x + 23}
                      y="154"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {bar.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="lg:col-span-4 opt-matte-surface p-4 space-y-3 text-xs">
            <span className="font-mono text-[10px] uppercase text-theme-muted block">
              Category Share Breakdown
            </span>
            {[
              { label: 'O.P.T. // DESK (Ergonomic WFH)', pct: 54, color: 'bg-cyan-400' },
              { label: 'O.P.T. // DRIVE (Car Cabin)', pct: 31, color: 'bg-amber-400' },
              { label: 'O.P.T. // VAULT (Festive Combos)', pct: 15, color: 'bg-yellow-400' },
            ].map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-theme-text font-medium">{cat.label}</span>
                  <span className="font-mono text-theme-accent">{cat.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Section 2: Live Order Verification & Human-in-the-Loop Fulfillment Queue */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
              Live Order Verification &amp; Fulfillment Queue ({orders.length})
            </h2>
            <p className="text-xs text-theme-muted">
              Every order created in <code>/checkout</code> appears here automatically for authoritative payment confirmation and supplier dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPromptType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSelectedPromptType(
                  e.target.value as
                    | 'VERIFIED_RECEIPT'
                    | 'HUB_DISPATCHED'
                    | 'UNBOXING_SHIELD'
                )
              }
              className="rounded-lg border border-theme-border bg-black/50 px-2.5 py-1.5 font-mono text-xs text-theme-text"
            >
              <option value="VERIFIED_RECEIPT">Prompt: Payment Confirmed + Receipt Link</option>
              <option value="HUB_DISPATCHED">Prompt: Partner Hub Dispatched + Tracking</option>
              <option value="UNBOXING_SHIELD">Prompt: 30s Unboxing Shield Reminder</option>
            </select>

            <Button variant="outline" size="sm" onClick={fetchLiveOrders}>
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sync Queue</span>
            </Button>
          </div>
        </div>

        {orders.map((order: OrderRecord) => {
          const isExpanded = expandedRef === order.orderReference;
          const estimatedSupplierCost = Math.round(order.subtotalInr * 0.32);
          const netMargin = order.subtotalInr - estimatedSupplierCost;

          return (
            <GlassCard key={order.orderReference} className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
                <div>
                  <span className="font-mono text-sm font-black text-theme-accent">
                    {order.orderReference}
                  </span>
                  <span className="ml-3 text-sm font-bold text-theme-text">
                    {order.delivery.fullName}
                  </span>
                  <span className="ml-2 font-mono text-xs text-theme-muted">
                    (Payable: ₹{order.payableAmountInr})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-0.5 font-mono text-[11px] font-bold ${
                      order.paymentStatus === 'CONFIRMED'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    Payment: {order.paymentStatus}
                  </span>

                  <span className="rounded-full bg-theme-accent/15 px-3 py-0.5 font-mono text-[11px] font-bold text-theme-accent">
                    Est. Margin: +₹{netMargin}
                  </span>

                  {order.paymentStatus !== 'CONFIRMED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleAdminOrderUpdate(order.orderReference, {
                          nextPaymentStatus: 'CONFIRMED',
                        })
                      }
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Confirm Payment (Unlock Receipt)</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedRef(isExpanded ? null : order.orderReference)
                    }
                  >
                    <PackageCheck className="h-3.5 w-3.5" />
                    <span>Prepare Supplier Order</span>
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 pt-2 text-xs">
                  {/* Column 1: Items Snapshot & Supplier Portal */}
                  <div className="opt-matte-surface p-4 space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
                      1. Ordered Hardware Snapshot
                    </span>
                    {order.itemsSnapshot.map((item: OrderLineSnapshot) => (
                      <div key={`${item.sku}-${item.selectedVariant}`} className="border-b border-theme-border pb-2">
                        <p className="font-bold text-theme-text">{item.title}</p>
                        <p className="font-mono text-[11px] text-theme-muted">
                          SKU: {item.sku} • Variant: {item.selectedVariant} • Qty: {item.quantity}
                        </p>
                      </div>
                    ))}
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href="https://deodap.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-theme-accent px-2.5 py-1.5 font-bold text-theme-accent-fg"
                      >
                        <span>Open DeoDap</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href="https://www.meesho.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded border border-theme-border bg-white/5 px-2.5 py-1.5 font-semibold text-theme-text"
                      >
                        <span>Open Meesho</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Customer Delivery Packet */}
                  <div className="opt-matte-surface p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
                        2. Customer Delivery Packet
                      </span>
                      <button
                        type="button"
                        onClick={() => copyFullFulfillmentPacket(order)}
                        className="inline-flex items-center gap-1 rounded border border-theme-accent/40 bg-theme-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-theme-accent"
                      >
                        {copiedKey === `full-${order.orderReference}` ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Copied Full Packet!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Full Fulfillment Details</span>
                          </>
                        )}
                      </button>
                    </div>

                    {[
                      { label: 'Name', val: order.delivery.fullName },
                      { label: 'Phone', val: order.delivery.mobileNumber },
                      { label: 'Address', val: order.delivery.addressLine },
                      {
                        label: 'City / State',
                        val: `${order.delivery.city}, ${order.delivery.state}`,
                      },
                      { label: 'PIN Code', val: order.delivery.pincode },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between border-b border-theme-border pb-1"
                      >
                        <span className="truncate pr-2">
                          <strong className="text-theme-muted">{row.label}:</strong> {row.val}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyText(`${order.orderReference}-${row.label}`, row.val)
                          }
                          className="shrink-0 text-theme-muted hover:text-theme-accent"
                        >
                          {copiedKey === `${order.orderReference}-${row.label}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Column 3: Fulfillment Transition & Automated Client Prompts */}
                  <div className="opt-matte-surface p-4 space-y-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
                      3. Fulfillment State &amp; Automated Client Prompt
                    </span>
                    <input
                      placeholder="Paste Courier Tracking ID..."
                      value={
                        trackingInputs[order.orderReference] ??
                        order.trackingId ??
                        ''
                      }
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTrackingInputs({
                          ...trackingInputs,
                          [order.orderReference]: e.target.value,
                        })
                      }
                      className="w-full rounded border border-theme-border bg-black/50 px-2.5 py-1.5 font-mono text-xs text-theme-text"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={order.fulfillmentStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          handleAdminOrderUpdate(order.orderReference, {
                            nextFulfillmentStatus: e.target.value as FulfillmentStatus,
                            trackingId:
                              trackingInputs[order.orderReference] ?? order.trackingId,
                          })
                        }
                        className="flex-1 rounded border border-theme-border bg-black/60 px-2.5 py-1.5 font-mono text-xs text-theme-text"
                      >
                        <option value="NOT_STARTED">NOT_STARTED</option>
                        <option value="READY_FOR_MERCHANT">READY_FOR_MERCHANT</option>
                        <option value="SUPPLIER_ORDER_PENDING">SUPPLIER_ORDER_PENDING</option>
                        <option value="SUPPLIER_ORDER_PLACED">SUPPLIER_ORDER_PLACED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="BLOCKED">BLOCKED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>

                      <a
                        href={buildAutomatedWhatsAppPrompt(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300"
                      >
                        <MessageSquareShare className="h-3.5 w-3.5" />
                        <span>Send Prompt</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Section 3: Insta / FB / YouTube Short-Form Content Prompt Studio (From Handwritten Diagram) */}
      <GlassCard className="p-6 space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-theme-accent">
          <Video className="h-4 w-4" />
          <span>Insta / FB / YouTube Content Creation &amp; Comment-to-DM Hook Studio</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs">
          {[
            {
              sku: 'OPT-DESK-001',
              hook: 'POV: Your laptop neck pain disappears in 3 seconds with 6061 Aircraft Aluminum.',
              cta: 'Comment "DESK" & I’ll DM you the direct ₹599 Partner-Hub link (40% off showroom price).',
            },
            {
              sku: 'OPT-DRIVE-001',
              hook: 'Stop dropping your phone and keys into the car seat abyss on Indian highways.',
              cta: 'Comment "DRIVE" for the StealthFit Driver + Co-Driver Pair link.',
            },
            {
              sku: 'OPT-DESK-003',
              hook: 'When was the last time you deep-cleaned your mechanical switches and AirPods mesh?',
              cta: 'Comment "CLEAN" for the 7-in-1 Detailing Kit at ₹449.',
            },
          ].map((script) => (
            <div key={script.sku} className="opt-matte-surface p-3.5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-theme-accent">
                <span>{script.sku} // REEL &amp; SHORT SCRIPT</span>
                <button
                  type="button"
                  onClick={() =>
                    copyText(`reel-${script.sku}`, `${script.hook}\n\n${script.cta}`)
                  }
                  className="underline"
                >
                  {copiedKey === `reel-${script.sku}` ? 'Copied!' : 'Copy Hook'}
                </button>
              </div>
              <p className="font-semibold text-theme-text">&ldquo;{script.hook}&rdquo;</p>
              <p className="text-[11px] text-theme-muted">{script.cta}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Section 4: Review Moderation Queue */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
          Verified-Purchase Review Moderation Queue (PENDING → APPROVED / REJECTED)
        </h2>
        <div className="space-y-3">
          {reviews.map((rev: PendingReviewItem) => (
            <div
              key={rev.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-theme-border bg-black/30 p-3.5 text-xs"
            >
              <div>
                <span className="font-mono font-bold text-theme-accent">{rev.productSku}</span>
                <span className="ml-2 font-semibold text-theme-text">{rev.customerName}</span>
                <span className="ml-2 font-mono text-amber-400">{'★'.repeat(rev.rating)}</span>
                <span className="ml-2 font-mono text-[10px] text-theme-muted">
                  (Order: {rev.orderReference} • Status: {rev.status})
                </span>
                <p className="mt-1 text-theme-muted">&ldquo;{rev.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moderateReview(rev.id, 'APPROVED')}
                  className="inline-flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  onClick={() => moderateReview(rev.id, 'REJECTED')}
                  className="inline-flex items-center gap-1 rounded border border-rose-500/40 bg-rose-500/15 px-2.5 py-1 text-[11px] font-bold text-rose-300"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
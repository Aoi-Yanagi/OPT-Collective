'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  BarChart3,
  PackageCheck,
  CheckCircle2,
  XCircle,
  MessageSquareShare,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { FulfillmentStatus, PaymentStatus } from '@/types/order-lifecycle.types';

interface FulfillmentTaskRow {
  taskId: string;
  orderReference: string;
  customerName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  deliveryInstructions: string;
  sku: string;
  productTitle: string;
  selectedVariant: string;
  quantity: number;
  paidAmountInr: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  preferredSupplier: string;
  backupSupplier: string;
  supplierProductUrl: string;
  supplierSku: string;
  supplierCostInr: number;
  internalNotes: string;
  supplierOrderId: string;
  trackingNumber: string;
}

interface PendingReviewItem {
  id: string;
  productSku: string;
  orderReference: string;
  customerName: string;
  rating: number;
  text: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const DEMO_FULFILLMENT_TASKS: FulfillmentTaskRow[] = [
  {
    taskId: 'TASK-9012-A',
    orderReference: 'OPT-2026-DEMO-9012',
    customerName: '[DEMO] Vikramaditya Rao',
    phone: '9000000000',
    addressLine: 'Demo Tech Park, Unit 4B, Hazratganj',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    deliveryInstructions: 'Leave at security desk',
    sku: 'OPT-DESK-001',
    productTitle: 'AeroLift 6-Axis Aluminum Laptop Riser',
    selectedVariant: 'Obsidian Matte',
    quantity: 1,
    paidAmountInr: 599,
    paymentStatus: 'CONFIRMED',
    fulfillmentStatus: 'READY_FOR_MERCHANT',
    preferredSupplier: 'DeoDap Wholesale',
    backupSupplier: 'Meesho Supplier Network',
    supplierProductUrl: 'https://deodap.in/search?q=aluminum+laptop+stand',
    supplierSku: 'DD-ALU-6AXIS-01',
    supplierCostInr: 190,
    internalNotes: 'Verify Obsidian Matte color selection before checkout.',
    supplierOrderId: '',
    trackingNumber: '',
  },
];

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
  const [tasks, setTasks] = useState<FulfillmentTaskRow[]>(DEMO_FULFILLMENT_TASKS);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('TASK-9012-A');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PendingReviewItem[]>(INITIAL_REVIEWS);

  function copyText(key: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  }

  function copyFullFulfillmentPacket(t: FulfillmentTaskRow) {
    const packet = [
      `=== O.P.T. COLLECTIVE FULFILLMENT PACKET ===`,
      `Order Ref: ${t.orderReference} (${t.taskId})`,
      `Product: ${t.productTitle} [${t.sku}]`,
      `Variant: ${t.selectedVariant} | Qty: ${t.quantity}`,
      `Supplier SKU: ${t.supplierSku} (${t.preferredSupplier})`,
      `--- CUSTOMER DELIVERY ---`,
      `Name: ${t.customerName}`,
      `Mobile: ${t.phone}`,
      `Address: ${t.addressLine}, ${t.city}, ${t.state} - ${t.pincode}`,
      `Instructions: ${t.deliveryInstructions || 'None'}`,
    ].join('\n');
    copyText(`full-${t.taskId}`, packet);
  }

  function updateTaskField(
    taskId: string,
    field: 'supplierOrderId' | 'trackingNumber' | 'fulfillmentStatus',
    value: string
  ) {
    setTasks((prev: FulfillmentTaskRow[]) =>
      prev.map((t: FulfillmentTaskRow) =>
        t.taskId === taskId ? { ...t, [field]: value } : t
      )
    );
  }

  function moderateReview(id: string, status: 'APPROVED' | 'REJECTED') {
    setReviews((prev: PendingReviewItem[]) =>
      prev.map((r: PendingReviewItem) => (r.id === id ? { ...r, status } : r))
    );
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Graphical Performance Analytics (SVG Bar Chart + Division Split) */}
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
          {/* SVG Bar Chart */}
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
                    {/* Gross Bar */}
                    <rect
                      x={x}
                      y={135 - grossHeight}
                      width="22"
                      height={grossHeight}
                      rx="4"
                      fill="rgba(148, 163, 184, 0.28)"
                    />
                    {/* Net Profit Bar */}
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

          {/* Division Revenue Split */}
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

      {/* Section 2: Human-in-the-Loop Order Fulfillment Workspace (Prepare Supplier Order) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
            Human-in-the-Loop Fulfillment Queue ({tasks.length})
          </h2>
          <span className="font-mono text-[11px] text-theme-muted">
            Explicit Merchant Approval Required Before Supplier Purchase
          </span>
        </div>

        {tasks.map((t: FulfillmentTaskRow) => {
          const isExpanded = expandedTaskId === t.taskId;
          const netMargin = t.paidAmountInr - t.supplierCostInr;

          return (
            <GlassCard key={t.taskId} className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border pb-3">
                <div>
                  <span className="font-mono text-sm font-black text-theme-accent">
                    {t.orderReference}
                  </span>
                  <span className="ml-2 font-mono text-xs text-theme-muted">
                    ({t.taskId})
                  </span>
                  <span className="ml-3 text-sm font-bold text-theme-text">
                    {t.customerName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 font-mono text-[11px] font-bold text-emerald-300">
                    Payment: {t.paymentStatus}
                  </span>
                  <span className="rounded-full bg-theme-accent/15 px-3 py-0.5 font-mono text-[11px] font-bold text-theme-accent">
                    Net Margin: +₹{netMargin}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setExpandedTaskId(isExpanded ? null : t.taskId)
                    }
                  >
                    <PackageCheck className="h-3.5 w-3.5" />
                    <span>Prepare Supplier Order</span>
                  </Button>
                </div>
              </div>

              {/* Consolidated Fulfillment Packet Panel */}
              {isExpanded && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 pt-2 text-xs">
                  {/* Column 1: Product Information */}
                  <div className="opt-matte-surface p-4 space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
                      1. Product Information
                    </span>
                    <p className="font-bold text-theme-text">{t.productTitle}</p>
                    <p className="font-mono text-[11px] text-theme-muted">
                      O.P.T. SKU: {t.sku} | Supplier SKU: {t.supplierSku}
                    </p>
                    <p className="text-theme-muted">
                      Variant: <strong className="text-theme-text">{t.selectedVariant}</strong> • Qty:{' '}
                      <strong className="text-theme-text">{t.quantity}</strong>
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={t.supplierProductUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-theme-accent px-3 py-1.5 font-bold text-theme-accent-fg"
                      >
                        <span>Open Supplier Product</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Customer Delivery Information with Individual Copy Buttons */}
                  <div className="opt-matte-surface p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
                        2. Customer Delivery Packet
                      </span>
                      <button
                        type="button"
                        onClick={() => copyFullFulfillmentPacket(t)}
                        className="inline-flex items-center gap-1 rounded border border-theme-accent/40 bg-theme-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-theme-accent"
                      >
                        {copiedKey === `full-${t.taskId}` ? (
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
                      { label: 'Name', val: t.customerName },
                      { label: 'Phone', val: t.phone },
                      { label: 'Address', val: t.addressLine },
                      { label: 'City / State', val: `${t.city}, ${t.state}` },
                      { label: 'PIN Code', val: t.pincode },
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
                          onClick={() => copyText(`${t.taskId}-${row.label}`, row.val)}
                          className="shrink-0 text-theme-muted hover:text-theme-accent"
                          title={`Copy ${row.label}`}
                        >
                          {copiedKey === `${t.taskId}-${row.label}` ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Column 3: Private Merchant Info & Status Recording */}
                  <div className="opt-matte-surface p-4 space-y-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
                      3. Private Procurement & Status Update
                    </span>
                    <p className="font-mono text-[11px]">
                      Supplier Cost: <strong className="text-theme-text">₹{t.supplierCostInr}</strong> • Preferred:{' '}
                      <strong className="text-theme-accent">{t.preferredSupplier}</strong> (Backup: {t.backupSupplier})
                    </p>
                    <p className="text-[11px] text-theme-muted italic">{t.internalNotes}</p>

                    <input
                      placeholder="Record Supplier Order ID (after purchase)..."
                      value={t.supplierOrderId}
                      onChange={(e) =>
                        updateTaskField(t.taskId, 'supplierOrderId', e.target.value)
                      }
                      className="w-full rounded border border-theme-border bg-black/50 px-2.5 py-1.5 font-mono text-xs text-theme-text"
                    />
                    <input
                      placeholder="Record Courier Tracking Number..."
                      value={t.trackingNumber}
                      onChange={(e) =>
                        updateTaskField(t.taskId, 'trackingNumber', e.target.value)
                      }
                      className="w-full rounded border border-theme-border bg-black/50 px-2.5 py-1.5 font-mono text-xs text-theme-text"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={t.fulfillmentStatus}
                        onChange={(e) =>
                          updateTaskField(
                            t.taskId,
                            'fulfillmentStatus',
                            e.target.value as FulfillmentStatus
                          )
                        }
                        className="flex-1 rounded border border-theme-border bg-black/60 px-2.5 py-1.5 font-mono text-xs text-theme-text"
                      >
                        <option value="READY_FOR_MERCHANT">READY_FOR_MERCHANT</option>
                        <option value="SUPPLIER_ORDER_PENDING">SUPPLIER_ORDER_PENDING</option>
                        <option value="SUPPLIER_ORDER_PLACED">SUPPLIER_ORDER_PLACED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="BLOCKED">BLOCKED (Supplier Unavailable)</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>

                      <a
                        href={`https://wa.me/91${t.phone}?text=${encodeURIComponent(
                          `Hi ${t.customerName}, your O.P.T. Collective Order (${t.orderReference}) status is now ${t.fulfillmentStatus}. Tracking Ref: ${
                            t.trackingNumber || 'Assigned shortly'
                          }.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300"
                      >
                        <MessageSquareShare className="h-3.5 w-3.5" />
                        <span>Ping Buyer</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Section 3: Customer Review Moderation Queue */}
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
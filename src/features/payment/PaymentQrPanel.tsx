'use client';

import React, { useState } from 'react';
import {
  QrCode,
  Download,
  Maximize2,
  Minimize2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  RefreshCw,
  Upload,
  Lock,
} from 'lucide-react';
import {
  PaymentSession,
  PaymentUiPresentationState,
} from '@/types/order-lifecycle.types';
import {
  scanPaymentReceiptImage,
  simulateForensicPreset,
} from '@/features/forensics/receiptForensics';
import { ForensicsScanResult } from '@/types/checkout.types';
import { DeviceConfig } from '@/hooks/useDeviceProfile';
import { Button } from '@/components/ui/Button';

interface PaymentQrPanelProps {
  session: PaymentSession;
  uiState: PaymentUiPresentationState;
  statusMessage: string;
  device: DeviceConfig;
  isSubmittingVerification: boolean;
  onRequestVerification: (params: {
    customerSubmittedRef: string;
    forensics: ForensicsScanResult | null;
  }) => void;
}

const UI_STATE_BADGES: Record<
  PaymentUiPresentationState,
  { label: string; colorClass: string }
> = {
  PREPARING_QR: {
    label: 'Preparing QR...',
    colorClass: 'border-sky-400/40 bg-sky-500/10 text-sky-300',
  },
  QR_AVAILABLE: {
    label: 'QR Available — Ready to Scan',
    colorClass: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  },
  WAITING_FOR_PAYMENT: {
    label: 'Waiting for Payment',
    colorClass: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
  },
  VERIFICATION_IN_PROGRESS: {
    label: 'Verification in Progress...',
    colorClass: 'border-sky-400/40 bg-sky-500/10 text-sky-300',
  },
  PAYMENT_CONFIRMED: {
    label: 'Payment Confirmed ✓',
    colorClass: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-200',
  },
  PAYMENT_NOT_CONFIRMED: {
    label: 'Payment Not Confirmed',
    colorClass: 'border-rose-500/50 bg-rose-500/15 text-rose-200',
  },
  VERIFICATION_TEMPORARILY_UNAVAILABLE: {
    label: 'Verification Temporarily Unavailable (Order Preserved)',
    colorClass: 'border-amber-500/50 bg-amber-500/15 text-amber-200',
  },
  QR_EXPIRED: {
    label: 'QR Session Expired',
    colorClass: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  },
  MANUAL_REVIEW_REQUIRED: {
    label: 'Queued for Authoritative Verification Review',
    colorClass: 'border-amber-400/50 bg-amber-500/15 text-amber-200',
  },
};

export function PaymentQrPanel({
  session,
  uiState,
  statusMessage,
  device,
  isSubmittingVerification,
  onRequestVerification,
}: PaymentQrPanelProps) {
  const [isFullscreenQr, setIsFullscreenQr] = useState<boolean>(false);
  const [customerRef, setCustomerRef] = useState<string>('');
  const [forensics, setForensics] = useState<ForensicsScanResult | null>(null);
  const [isScanningImage, setIsScanningImage] = useState<boolean>(false);

  const badge = UI_STATE_BADGES[uiState] || UI_STATE_BADGES.QR_AVAILABLE;

  async function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanningImage(true);
    try {
      const result = await scanPaymentReceiptImage(file);
      setForensics(result);
      if (result.extractedUtr) {
        setCustomerRef(result.extractedUtr);
      }
    } finally {
      setIsScanningImage(false);
    }
  }

  function handleSaveQrSvg() {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="480" viewBox="0 0 420 480">
      <rect width="420" height="480" rx="20" fill="#07090e"/>
      <rect x="30" y="30" width="360" height="360" rx="16" fill="#ffffff"/>
      <text x="210" y="210" font-family="monospace" font-size="16" font-weight="bold" fill="#07090e" text-anchor="middle">O.P.T. COLLECTIVE QR</text>
      <text x="210" y="235" font-family="monospace" font-size="14" fill="#059669" text-anchor="middle">Order: ${session.orderReference}</text>
      <text x="210" y="260" font-family="monospace" font-size="18" font-weight="bold" fill="#07090e" text-anchor="middle">INR ${session.payableAmountInr}</text>
      <text x="210" y="435" font-family="monospace" font-size="13" fill="#10b981" text-anchor="middle">Scan with any UPI App • Exact: ₹${session.payableAmountInr}</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OPT-QR-${session.orderReference}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Pinned Order Reference & Exact Payable Banner */}
      <div className="opt-matte-surface flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <span className="font-mono text-[11px] uppercase text-theme-muted block">
            Durable Order Reference
          </span>
          <strong className="font-mono text-base font-black text-theme-text">
            {session.orderReference}
          </strong>
        </div>

        <div className="text-right">
          <span className="font-mono text-[11px] uppercase text-theme-muted block">
            Exact Payable Amount
          </span>
          <strong className="font-mono text-2xl font-black text-theme-accent">
            ₹{session.payableAmountInr}
          </strong>
        </div>
      </div>

      {/* Live Payment State Indicator */}
      <div className={`rounded-xl border px-4 py-3 text-xs ${badge.colorClass}`}>
        <div className="flex items-center justify-between font-mono font-bold">
          <span>STATUS // {badge.label}</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="h-3.5 w-3.5" />
            Session: {session.paymentSessionId}
          </span>
        </div>
        <p className="mt-1 text-[11px] opacity-90">{statusMessage}</p>
      </div>

      {/* Dedicated QR Presentation Panel (Desktop vs Mobile Optimized) */}
      <div className="opt-glass p-6 text-center space-y-4">
        <div className="flex items-center justify-between text-xs text-theme-muted font-mono">
          <span>MERCHANT: {session.merchantDisplayName}</span>
          <span>MODE: {device.paymentMode}</span>
        </div>

        <div
          className={`mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-theme-accent/50 bg-white p-5 text-slate-950 shadow-2xl transition-all ${
            isFullscreenQr ? 'h-80 w-80 sm:h-96 sm:w-96' : 'h-60 w-60 sm:h-64 sm:w-64'
          }`}
        >
          <QrCode className="h-full w-full text-slate-950" />
          <span className="mt-1 font-mono text-xs font-black text-slate-900">
            ₹{session.payableAmountInr} • {session.orderReference}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={handleSaveQrSvg}>
            <Download className="h-3.5 w-3.5" />
            <span>Save / Download QR</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreenQr((prev) => !prev)}
          >
            {isFullscreenQr ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Standard QR Size</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen QR View</span>
              </>
            )}
          </Button>
        </div>

        {device.isTouchDevice ? (
          <p className="mx-auto max-w-md text-xs leading-relaxed text-theme-muted">
            <strong>Mobile Scanning Instructions:</strong> Tap <em>Save / Download QR</em> above and use the &ldquo;Scan from Gallery / Upload QR&rdquo; option inside your UPI app (where supported), or scan this screen from a second device.
          </p>
        ) : (
          <p className="mx-auto max-w-md text-xs leading-relaxed text-theme-muted">
            <strong>Desktop Scanning Instructions:</strong> Open any UPI application on your smartphone, scan the merchant QR above, and complete the exact{' '}
            <strong className="text-theme-accent">₹{session.payableAmountInr}</strong> transfer.
          </p>
        )}
      </div>

      {/* Confidential Payment Integration Slot */}
      <div className="opt-matte-surface p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-theme-accent" />
            <h3 className="font-mono text-xs font-bold uppercase text-theme-text">
              PaymentIntegrationSlot // Verification Boundary
            </h3>
          </div>
          <span className="font-mono text-[10px] text-theme-muted">
            {session.integrationConfigured
              ? 'Live Verifier Connected'
              : 'Authoritative Queue Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-theme-text">
              1. Upload Payment Receipt Screenshot (AI Integrity Pre-Check)
            </label>
            <label className="mt-1.5 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-theme-accent/50 bg-theme-accent/5 p-3 text-xs hover:bg-theme-accent/10 transition">
              <span className="flex items-center gap-2 text-theme-muted">
                <Upload className="h-4 w-4 text-theme-accent" />
                {isScanningImage ? 'Scanning Binary Header...' : 'Choose UPI Screenshot'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
              />
              <span className="rounded bg-theme-accent px-2 py-0.5 text-[10px] font-bold text-theme-accent-fg">
                Browse
              </span>
            </label>

            {/* Quick Forensics Test Controls */}
            <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  const res = simulateForensicPreset('AUTHENTIC');
                  setForensics(res);
                  if (res.extractedUtr) setCustomerRef(res.extractedUtr);
                }}
                className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300"
              >
                Test Clean Screenshot
              </button>
              <button
                type="button"
                onClick={() => setForensics(simulateForensicPreset('EDITED_CANVA'))}
                className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-300"
              >
                Test Edited (Canva)
              </button>
              <button
                type="button"
                onClick={() => setForensics(simulateForensicPreset('AI_FAKE'))}
                className="rounded border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-rose-300"
              >
                Test AI Synthetic
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-theme-text">
              2. UPI Reference / UTR Number (Auto-Extracted or Optional)
            </label>
            <input
              placeholder="12-digit UPI Ref (auto-filled by OCR)"
              value={customerRef}
              onChange={(e) => setCustomerRef(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2.5 font-mono text-xs text-theme-text"
            />
            <p className="mt-1 text-[10px] text-theme-muted">
              Clicking below initiates server-side verification. It will never fabricate a fake payment confirmation.
            </p>
          </div>
        </div>

        {forensics && (
          <div
            className={`rounded-lg border p-3 text-xs ${
              forensics.passed
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                : 'border-rose-500/50 bg-rose-500/15 text-rose-100'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {forensics.passed ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                )}
                {forensics.headline} (Client Pre-Check Only — Server Decides Authority)
              </span>
              <span className="font-mono text-[10px]">Risk: {forensics.riskScore}/100</span>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmittingVerification}
          onClick={() =>
            onRequestVerification({
              customerSubmittedRef: customerRef,
              forensics,
            })
          }
        >
          <RefreshCw
            className={`h-4 w-4 ${isSubmittingVerification ? 'animate-spin' : ''}`}
          />
          <span>
            {isSubmittingVerification
              ? 'Initiating Server Payment Verification...'
              : 'I Have Completed Payment — Request Verification'}
          </span>
        </Button>
      </div>
    </div>
  );
}
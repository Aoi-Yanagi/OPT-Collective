'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Smartphone,
  QrCode,
  Upload,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Printer,
  X,
} from 'lucide-react';
import { CartItem } from '@/types/store.types';
import { ForensicsScanResult, ConfirmedOrderReceipt } from '@/types/checkout.types';
import { DeviceConfig } from '@/hooks/useDeviceProfile';
import { generateUniquePaisaAmount, buildUniversalUpiIntent } from '@/lib/upi';
import {
  scanPaymentReceiptImage,
  simulateForensicPreset,
} from '@/features/forensics/receiptForensics';
import { Button } from '@/components/ui/Button';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  device: DeviceConfig;
  onClearCart: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  device,
  onClearCart,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');

  const [verificationMode, setVerificationMode] = useState<
    'METHOD_A_SCREENSHOT_OCR' | 'METHOD_B_PAISA_LOCK'
  >('METHOD_A_SCREENSHOT_OCR');
  const [forensics, setForensics] = useState<ForensicsScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [paisaConfirmed, setPaisaConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ConfirmedOrderReceipt | null>(null);

  if (!isOpen) return null;

  const baseSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const exactPaisaAmount = generateUniquePaisaAmount(baseSubtotal, phone || '8824');

  const upiIntentUrl = buildUniversalUpiIntent({
    merchantVpa: process.env.NEXT_PUBLIC_MERCHANT_UPI_ID || 'optcollective@paytm',
    merchantName: 'The OPT Collective',
    exactAmount: exactPaisaAmount,
    transactionNote: 'OPT Collective Gear Order',
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    setErrorMsg(null);
    try {
      const scanRes = await scanPaymentReceiptImage(file);
      setForensics(scanRes);
    } finally {
      setIsScanning(false);
    }
  }

  function runPresetSimulation(preset: 'AUTHENTIC' | 'EDITED_CANVA' | 'AI_FAKE') {
    setErrorMsg(null);
    const res = simulateForensicPreset(preset);
    setForensics(res);
  }

  async function handleCompleteOrder() {
    setErrorMsg(null);
    if (!customerName || !phone || !address || !pincode) {
      setErrorMsg('Please fill in your Name, 10-digit WhatsApp Number, Address, and Pin Code.');
      return;
    }

    const isVerified =
      (verificationMode === 'METHOD_A_SCREENSHOT_OCR' && forensics?.passed) ||
      (verificationMode === 'METHOD_B_PAISA_LOCK' && paisaConfirmed);

    if (!isVerified) {
      setErrorMsg(
        'Please complete the 1-tap screenshot scan or confirm the exact paisa payment first.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          address,
          pincode,
          items,
          baseSubtotal,
          exactPaisaAmount,
          verificationMethod: verificationMode,
          utrNumber: forensics?.extractedUtr || `PAISA-LOCK-${exactPaisaAmount.split('.')[1]}`,
          forensicsPassed: true,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.receipt) {
        setErrorMsg(data.error || 'Could not verify order. Please try again.');
        return;
      }

      setReceipt(data.receipt);
      onClearCart();
    } catch {
      setErrorMsg('Network error while generating receipt. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md">
      <div className="opt-glass relative max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5 sm:p-7 text-theme-text shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-theme-border pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-theme-accent">
              THE O.P.T. COLLECTIVE // SECURE UPI DESK
            </span>
            <h2 className="text-lg font-extrabold text-theme-text">
              {receipt ? `Order Confirmed: ${receipt.orderId}` : 'Zero-Fee UPI Verification Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-theme-border p-1.5 text-theme-muted hover:text-theme-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ================================================================
            VIEW 1: OFFICIAL GENERATED RECEIPT (POST-VERIFICATION)
           ================================================================ */}
        {receipt ? (
          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-theme-accent/40 bg-theme-accent/10 p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-theme-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  {receipt.verificationBadge}
                </span>
                <span className="font-mono text-xs text-theme-muted">{receipt.timestamp}</span>
              </div>

              <h3 className="mt-3 font-mono text-xl font-black text-theme-text">
                RECEIPT #{receipt.orderId}
              </h3>
              <p className="mt-1 text-xs text-theme-muted">
                Shipped in neutral, unbranded packaging. An email copy has been queued for{' '}
                <strong className="text-theme-text">{receipt.email || receipt.phone}</strong>.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-theme-border pt-3 text-xs">
                <div>
                  <span className="text-theme-muted block">Customer:</span>
                  <strong className="text-theme-text">{receipt.customerName}</strong>
                </div>
                <div>
                  <span className="text-theme-muted block">Amount Paid:</span>
                  <strong className="font-mono text-theme-accent">₹{receipt.exactAmountPaid}</strong>
                </div>
                <div>
                  <span className="text-theme-muted block">Reference / UTR:</span>
                  <strong className="font-mono text-theme-text">{receipt.utrNumber}</strong>
                </div>
                <div>
                  <span className="text-theme-muted block">Delivery Pin Code:</span>
                  <strong className="text-theme-text">{receipt.pincode}</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={receipt.whatsappConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-opt-btn bg-emerald-500 px-4 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Receipt to WhatsApp for Live Tracking</span>
              </a>

              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4" />
                <span>Print / Save PDF</span>
              </Button>
            </div>
          </div>
        ) : (
          /* ================================================================
             VIEW 2: ACTIVE CHECKOUT & AI FORENSICS VERIFICATION FLOW
             ================================================================ */
          <div className="mt-4 space-y-5">
            {/* Cute Student Founder Cooperation Message */}
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <HeartHandshake className="h-4 w-4 shrink-0" />
                <span>A Tiny Favor from a New Student-Built Studio! 🌱</span>
              </div>
              <p className="mt-1.5 leading-relaxed text-amber-100/90">
                Hi! I’m a student building <strong>The O.P.T. Collective</strong> from scratch. To keep our gear ₹300–₹500 cheaper than big marketplaces, we skip expensive 2% payment gateways. Please cooperate with our quick 1-tap verification below—you don’t even have to type a UTR code, and your official Order ID & receipt generate in 2 seconds!
              </p>
            </div>

            {/* Step 1: Delivery Details */}
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
                Step 1 // Delivery & Receipt Destination
              </h3>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input
                  placeholder="Full Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text focus:border-theme-accent focus:outline-none"
                />
                <input
                  placeholder="10-Digit WhatsApp Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                  className="rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text focus:border-theme-accent focus:outline-none"
                />
                <input
                  placeholder="Email Address (for PDF Receipt)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text focus:border-theme-accent focus:outline-none"
                />
                <input
                  placeholder="6-Digit Pin Code *"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  className="rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text focus:border-theme-accent focus:outline-none"
                />
                <input
                  placeholder="Complete Flat / House No., Street, Landmark & City *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="sm:col-span-2 rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text focus:border-theme-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2: Adaptive Payment Routing (Mobile Universal Call vs Desktop Dynamic QR) */}
            <div className="rounded-xl border border-theme-border bg-black/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-theme-accent">
                    Step 2 // {device.paymentMode === 'UPI_INTENT_MOBILE' ? 'Same-Phone Universal UPI Call' : 'Desktop Dynamic QR Scan'}
                  </span>
                  <p className="text-[11px] text-theme-muted">
                    Exact Paisa-Locked Total (auto-matches your phone number):
                  </p>
                </div>
                <span className="rounded-lg border border-theme-accent/40 bg-theme-accent/15 px-3 py-1 font-mono text-lg font-black text-theme-accent">
                  ₹{exactPaisaAmount}
                </span>
              </div>

              {device.paymentMode === 'UPI_INTENT_MOBILE' ? (
                <div className="mt-3">
                  <a
                    href={upiIntentUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-opt-btn bg-theme-accent py-3 text-xs font-extrabold text-theme-accent-fg shadow-lg hover:opacity-95 transition"
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>Tap to Pay ₹{exactPaisaAmount} via GPay / PhonePe / Paytm</span>
                  </a>
                  <p className="mt-1.5 text-center text-[11px] text-theme-muted">
                    Opens your phone’s native payment app chooser with ₹{exactPaisaAmount} pre-filled.
                  </p>
                </div>
              ) : (
                <div className="mt-3 flex flex-col items-center gap-4 rounded-lg border border-theme-border bg-black/50 p-4 sm:flex-row">
                  <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg bg-white p-2 text-slate-950">
                    <QrCode className="h-16 w-16" />
                    <span className="font-mono text-[9px] font-bold">₹{exactPaisaAmount}</span>
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-theme-text">
                      Desktop Browser Detected ({device.osAttr.toUpperCase()})
                    </p>
                    <p className="mt-1 leading-relaxed text-theme-muted">
                      Since desktop browsers don’t have UPI apps installed, scan this dynamic QR with Google Pay, PhonePe, or Paytm on your phone. The exact{' '}
                      <strong className="text-theme-accent">₹{exactPaisaAmount}</strong> amount is pre-encoded!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Zero-Typing Verification (Method A Forensics vs Method B Paisa Lock) */}
            <div className="rounded-xl border border-theme-border bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase text-theme-accent">
                  Step 3 // Instant Verification (Zero UTR Typing!)
                </span>
                <div className="flex gap-1 rounded-lg border border-theme-border bg-black/40 p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setVerificationMode('METHOD_A_SCREENSHOT_OCR')}
                    className={`rounded-md px-2 py-1 font-semibold transition ${
                      verificationMode === 'METHOD_A_SCREENSHOT_OCR'
                        ? 'bg-theme-accent text-theme-accent-fg'
                        : 'text-theme-muted'
                    }`}
                  >
                    Method A: 1-Tap Screenshot
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMode('METHOD_B_PAISA_LOCK')}
                    className={`rounded-md px-2 py-1 font-semibold transition ${
                      verificationMode === 'METHOD_B_PAISA_LOCK'
                        ? 'bg-theme-accent text-theme-accent-fg'
                        : 'text-theme-muted'
                    }`}
                  >
                    Method B: .XX Paisa Match
                  </button>
                </div>
              </div>

              {verificationMode === 'METHOD_A_SCREENSHOT_OCR' ? (
                <div className="mt-3 space-y-3">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-theme-accent/50 bg-theme-accent/5 p-3 hover:bg-theme-accent/10 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Upload className="h-4 w-4 text-theme-accent" />
                      <div>
                        <span className="font-semibold text-theme-text block">
                          {isScanning ? 'Scanning EXIF & Reading UTR...' : 'Upload Payment Screenshot'}
                        </span>
                        <span className="text-[10px] text-theme-muted">
                          AI Forensics checks authenticity & auto-reads your 12-digit UTR
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="rounded bg-theme-accent px-2.5 py-1 text-[10px] font-bold text-theme-accent-fg">
                      Select Image
                    </span>
                  </label>

                  {/* Built-in Forensics Test Bar for Your Laptop Testing */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="font-mono text-theme-muted">Simulate AI Guard:</span>
                    <button
                      type="button"
                      onClick={() => runPresetSimulation('AUTHENTIC')}
                      className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300 hover:bg-emerald-500/20"
                    >
                      ✓ Test Authentic UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => runPresetSimulation('EDITED_CANVA')}
                      className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-300 hover:bg-amber-500/20"
                    >
                      ⚠ Test Edited (Canva/PS)
                    </button>
                    <button
                      type="button"
                      onClick={() => runPresetSimulation('AI_FAKE')}
                      className="rounded border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-rose-300 hover:bg-rose-500/20"
                    >
                      ✕ Test AI Fake Receipt
                    </button>
                  </div>

                  {/* Forensics Scan Verdict Box */}
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
                          {forensics.headline}
                        </span>
                        <span className="font-mono text-[10px]">
                          Risk Score: {forensics.riskScore}/100
                        </span>
                      </div>

                      {forensics.warningMessage && (
                        <p className="mt-1.5 text-[11px] leading-relaxed text-rose-200">
                          {forensics.warningMessage}
                        </p>
                      )}

                      <ul className="mt-2 space-y-0.5 font-mono text-[10px] opacity-90">
                        {forensics.technicalFlags.map((flag, idx) => (
                          <li key={idx}>• {flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-theme-border bg-black/40 p-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 shrink-0 text-theme-accent mt-0.5" />
                    <div>
                      <p className="font-semibold text-theme-text">
                        How Method B (.XX Unique Paisa Lock) Works:
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-theme-muted">
                        Because your total is locked to the unique amount{' '}
                        <strong className="text-theme-accent">₹{exactPaisaAmount}</strong>, our bank alert listener matches your payment automatically by the exact{' '}
                        <strong className="text-theme-accent">
                          .{exactPaisaAmount.split('.')[1]} paisa
                        </strong>{' '}
                        fingerprint—no screenshot or UTR typing required!
                      </p>
                      <label className="mt-2.5 flex cursor-pointer items-center gap-2 font-semibold text-theme-accent">
                        <input
                          type="checkbox"
                          checked={paisaConfirmed}
                          onChange={(e) => setPaisaConfirmed(e.target.checked)}
                          className="rounded border-theme-border"
                        />
                        <span>I have paid the exact ₹{exactPaisaAmount} amount on my UPI app</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-200">
                {errorMsg}
              </p>
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              onClick={handleCompleteOrder}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? 'Verifying & Generating Official Order ID...'
                  : `Verify & Generate Order Receipt (₹${exactPaisaAmount})`}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
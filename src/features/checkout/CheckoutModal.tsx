'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { CartItem } from '@/types/store.types';
import { DeviceConfig } from '@/hooks/useDeviceProfile';
import { Button } from '@/components/ui/Button';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  device: DeviceConfig;
  onClearCart: () => void;
}

/**
 * Legacy Modal Bridge — Routes shoppers directly to the dedicated 3-stage QR checkout (/checkout)
 * and uses the strict QR_DESKTOP_PANEL | QR_MOBILE_SAVE_SCAN paymentMode union.
 */
export function CheckoutModal({
  isOpen,
  onClose,
  items,
  device,
}: CheckoutModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const isMobileQrMode = device.paymentMode === 'QR_MOBILE_SAVE_SCAN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="opt-glass relative w-full max-w-lg p-6 text-theme-text shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-theme-accent">
              THE O.P.T. COLLECTIVE // {isMobileQrMode ? 'MOBILE SAVE/SCAN QR' : 'DESKTOP QR PANEL'}
            </span>
            <h2 className="text-lg font-extrabold text-theme-text">
              Dedicated 3-Stage QR Checkout
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-theme-border p-1.5 text-theme-muted hover:text-theme-text"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="opt-matte-surface p-4 text-xs space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="text-theme-muted">Items in Bag ({items.length})</span>
            <strong className="text-base text-theme-accent">₹{subtotal}</strong>
          </div>
          <p className="text-theme-muted leading-relaxed">
            {isMobileQrMode
              ? 'Mobile QR Mode active: Proceed to enter your delivery address, review your order snapshot, and save/scan the official Merchant QR.'
              : 'Desktop QR Panel active: Proceed to enter your delivery address, confirm your order snapshot, and scan the official Merchant QR.'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Authoritative Server Verification</span>
          </span>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              router.push('/checkout');
            }}
          >
            <QrCode className="h-4 w-4" />
            <span>Open 3-Stage Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
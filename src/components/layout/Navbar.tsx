'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Cpu, Search } from 'lucide-react';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import { DivisionKey } from '@/types/theme.types';
import { DeviceConfig } from '@/hooks/useDeviceProfile';
import { OptLogoMark } from '@/components/ui/OptLogoMark';
import { SocialHeaderMenu } from '@/features/social/SocialHub';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  device: DeviceConfig;
}

const NAV_ITEMS: { division: DivisionKey; label: string; href: string }[] = [
  { division: 'ALL', label: 'ALL GEAR', href: '/' },
  { division: 'DESK', label: 'O.P.T. // DESK', href: '/category/desk' },
  { division: 'DRIVE', label: 'O.P.T. // DRIVE', href: '/category/drive' },
  { division: 'VAULT', label: 'O.P.T. // FESTIVE VAULT', href: '/category/vault' },
];

export function Navbar({ cartCount, onOpenCart, device }: NavbarProps) {
  const { activeDivision, selectDivisionWithTheme } = useOptTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-theme-border bg-theme-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link
          href="/"
          onClick={() => selectDivisionWithTheme('ALL')}
          className="flex items-center gap-3 group"
        >
          <OptLogoMark
            size={40}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div>
            <span className="block text-sm font-extrabold tracking-wider text-theme-text">
              THE O.P.T. COLLECTIVE
            </span>
            <span className="flex items-center gap-1 text-[10px] text-theme-muted">
              <Cpu className="h-3 w-3 text-theme-accent" />
              {device.label}
            </span>
          </div>
        </Link>

        {/* Desktop Division Links */}
        <nav
          aria-label="Product Divisions"
          className="hidden md:flex items-center gap-1 rounded-full border border-theme-border bg-white/[0.03] p-1"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.division}
              href={item.href}
              onClick={() => selectDivisionWithTheme(item.division)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                activeDivision === item.division
                  ? 'bg-theme-accent text-theme-accent-fg font-bold shadow-sm'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Track Order, Non-Intrusive Social Hub, Trust Pill & Bag */}
        <div className="flex items-center gap-2">
          <Link
            href="/track"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-theme-border bg-white/5 px-3 py-1.5 text-[11px] font-medium text-theme-muted hover:border-theme-accent hover:text-theme-text transition"
          >
            <Search className="h-3 w-3 text-theme-accent" />
            <span>Track Order</span>
          </Link>

          <SocialHeaderMenu />

          <div className="hidden lg:flex items-center gap-1 rounded-full border border-theme-accent/30 bg-theme-accent/10 px-2.5 py-1 text-[10px] text-theme-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>QR Verified</span>
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="flex items-center gap-2 rounded-opt-btn border border-theme-border bg-white/5 px-3.5 py-2 text-xs font-semibold text-theme-text hover:border-theme-accent transition"
          >
            <ShoppingBag className="h-4 w-4 text-theme-accent" />
            <span>Bag</span>
            <span className="rounded-full bg-theme-accent px-1.5 py-0.5 text-[10px] font-bold text-theme-accent-fg">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Scrollable Division & Tracking Pills */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto border-t border-theme-border px-4 py-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.division}
            href={item.href}
            onClick={() => selectDivisionWithTheme(item.division)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ${
              activeDivision === item.division
                ? 'bg-theme-accent text-theme-accent-fg font-bold'
                : 'border border-theme-border text-theme-muted'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/track"
          className="shrink-0 rounded-full border border-theme-border px-3 py-1 text-[11px] font-medium text-theme-muted"
        >
          Track Order
        </Link>
      </div>
    </header>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ShieldCheck, Search } from 'lucide-react';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import type { DivisionKey } from '@/types/theme.types';
import type { DeviceConfig } from '@/hooks/useDeviceProfile';
import { OptLogoMark } from '@/components/ui/OptLogoMark';
import { ThemeStudio } from '@/components/ui/ThemeStudio';
import { SocialHeaderMenu } from '@/features/social/SocialHub';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  device: DeviceConfig;
}

const NAV_ITEMS: { division: DivisionKey; label: string; href: string }[] = [
  { division: 'ALL', label: 'Discover', href: '/' },
  { division: 'DESK', label: 'Desk / Studio', href: '/category/desk' },
  { division: 'DRIVE', label: 'Drive / Cabin', href: '/category/drive' },
  { division: 'VAULT', label: 'The Vault', href: '/category/vault' },
];

const PILL_TRANSITION = {
  type: 'spring' as const,
  stiffness: 460,
  damping: 36,
  mass: 0.72,
};

function CollectionLink({
  item,
  active,
  layoutId,
  onSelect,
  compact = false,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  layoutId: string;
  onSelect: (division: DivisionKey) => void;
  compact?: boolean;
}) {
  return (
    <Link
      href={item.href}
      onClick={() => onSelect(item.division)}
      aria-current={active ? 'page' : undefined}
      className={`relative isolate inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors duration-200 ${
        compact ? 'px-3 py-1.5 text-[10px]' : 'px-3.5 py-2 text-[10px]'
      } ${active ? 'text-theme-accent-fg' : 'text-theme-muted hover:text-theme-text'}`}
    >
      {active && (
        <motion.span
          layoutId={layoutId}
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-theme-accent shadow-[0_4px_16px_var(--glow-ambient)]"
          transition={PILL_TRANSITION}
          aria-hidden="true"
        />
      )}
      <span className="relative z-10">{item.label}</span>
    </Link>
  );
}

export function Navbar({ cartCount, onOpenCart, device }: NavbarProps) {
  const { activeDivision, selectDivisionWithTheme } = useOptTheme();

  return (
    <header className="opt-global-nav sticky top-0 z-40 isolate border-b border-theme-border">
      <div className="mx-auto flex min-h-[68px] max-w-[1480px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => selectDivisionWithTheme('ALL')}
          aria-label="The O.P.T. Collective home"
          className="group flex min-w-0 shrink-0 items-center gap-2.5"
        >
          <OptLogoMark size={38} className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
          <span className="min-w-0">
            <span className="block truncate text-[10px] font-bold tracking-[0.16em] text-theme-text sm:text-[11px]">THE O.P.T. COLLECTIVE</span>
            <span className="mt-0.5 hidden text-[9px] tracking-wide text-theme-muted sm:block">Objects for better everyday rituals</span>
          </span>
        </Link>

        <nav aria-label="Product collections" className="hidden min-w-0 items-center gap-1 rounded-full border border-theme-border bg-theme-matte/60 p-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <CollectionLink
              key={item.division}
              item={item}
              active={activeDivision === item.division}
              layoutId="opt-collection-pill-desktop"
              onSelect={selectDivisionWithTheme}
            />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/track"
            aria-label="Track an order"
            title="Track an order"
            className="hidden h-10 items-center gap-1.5 rounded-full border border-theme-border px-3 text-[10px] font-medium text-theme-muted transition hover:border-theme-accent/60 hover:text-theme-text sm:inline-flex"
          >
            <Search className="h-3.5 w-3.5 text-theme-accent" />
            <span className="hidden xl:inline">Track</span>
          </Link>
          <div className="hidden sm:block"><ThemeStudio /></div>
          <div className="hidden md:block"><SocialHeaderMenu /></div>
          <span className="hidden items-center gap-1 rounded-full border border-theme-accent/25 bg-theme-accent/5 px-2.5 py-2 font-mono text-[9px] text-theme-accent xl:inline-flex" title={device.label}>
            <ShieldCheck className="h-3.5 w-3.5" /> QR checkout
          </span>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-theme-accent px-3.5 text-xs font-semibold text-theme-accent-fg shadow-[0_8px_24px_var(--glow-ambient)] transition hover:-translate-y-0.5 hover:brightness-105 sm:px-4"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/15 px-1 font-mono text-[10px]">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-theme-border/70 px-4 py-2 sm:px-6 lg:hidden">
        <nav aria-label="Browse collections" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_ITEMS.map((item) => (
            <CollectionLink
              key={item.division}
              item={item}
              active={activeDivision === item.division}
              layoutId="opt-collection-pill-mobile"
              onSelect={selectDivisionWithTheme}
              compact
            />
          ))}
        </nav>
        <div className="sm:hidden"><ThemeStudio /></div>
        <div className="md:hidden"><SocialHeaderMenu /></div>
        <Link href="/track" className="shrink-0 rounded-full border border-theme-border px-3 py-1.5 text-[10px] font-medium text-theme-muted">Track</Link>
      </div>
    </header>
  );
}

export default Navbar;

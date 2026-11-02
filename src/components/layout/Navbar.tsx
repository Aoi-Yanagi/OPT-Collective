'use client';

import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Cpu, Search } from 'lucide-react';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import type { DivisionKey } from '@/types/theme.types';
import type { DeviceConfig } from '@/hooks/useDeviceProfile';
import { SocialHeaderMenu } from '@/features/social/SocialHub';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  device: DeviceConfig;
}

const NAV_ITEMS: { division: DivisionKey; label: string; href: string }[] = [
  { division: 'ALL', label: 'All gear', href: '/' },
  { division: 'DESK', label: 'Desk', href: '/category/desk' },
  { division: 'DRIVE', label: 'Drive', href: '/category/drive' },
  { division: 'VAULT', label: 'Vault', href: '/category/vault' },
];

export function Navbar({ cartCount, onOpenCart, device }: NavbarProps) {
  const { activeDivision, selectDivisionWithTheme } = useOptTheme();

  return (
    <header className="opt-global-nav sticky top-0 z-40 border-b border-theme-border">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" onClick={() => selectDivisionWithTheme('ALL')} className="group flex min-w-0 items-center gap-3">
          <span className="opt-brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-theme-accent/40 bg-theme-accent/10 font-mono text-sm font-black tracking-tighter text-theme-accent transition group-hover:rotate-[-5deg] group-hover:scale-105">OPT.</span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-bold tracking-[0.13em] text-theme-text sm:text-xs">THE O.P.T. COLLECTIVE</span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[9px] text-theme-muted">
              <Cpu className="h-3 w-3 text-theme-accent" />
              <span className="truncate">{device.label}</span>
            </span>
          </span>
        </Link>

        <nav aria-label="Product divisions" className="hidden items-center gap-1 rounded-full border border-theme-border bg-black/10 p-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.division}
              href={item.href}
              onClick={() => selectDivisionWithTheme(item.division)}
              aria-current={activeDivision === item.division ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-[11px] font-medium transition ${activeDivision === item.division ? 'bg-theme-accent text-theme-accent-fg shadow-sm' : 'text-theme-muted hover:bg-white/[0.045] hover:text-theme-text'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link href="/track" aria-label="Track an order" className="hidden min-h-9 items-center gap-1.5 rounded-full border border-theme-border px-3 text-[10px] font-medium text-theme-muted transition hover:border-theme-accent/50 hover:text-theme-text sm:inline-flex">
            <Search className="h-3.5 w-3.5 text-theme-accent" />
            <span>Track order</span>
          </Link>
          <div className="hidden xl:block"><SocialHeaderMenu /></div>
          <span className="hidden items-center gap-1 rounded-full border border-theme-accent/25 bg-theme-accent/5 px-2.5 py-1.5 font-mono text-[9px] text-theme-accent xl:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" /> QR checkout
          </span>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-theme-accent/35 bg-theme-accent px-3.5 text-xs font-semibold text-theme-accent-fg transition hover:brightness-110 sm:px-4"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/15 px-1 font-mono text-[10px]">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-theme-border/70 px-4 py-2 lg:hidden sm:px-6">
        <nav aria-label="Browse divisions" className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.division}
              href={item.href}
              onClick={() => selectDivisionWithTheme(item.division)}
              aria-current={activeDivision === item.division ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium transition ${activeDivision === item.division ? 'bg-theme-accent text-theme-accent-fg' : 'border border-theme-border text-theme-muted'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="shrink-0"><SocialHeaderMenu /></div>
        <Link href="/track" className="shrink-0 rounded-full border border-theme-border px-3 py-1.5 text-[10px] font-medium text-theme-muted">Track</Link>
      </div>
    </header>
  );
}

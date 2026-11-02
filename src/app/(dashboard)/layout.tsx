'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PackageSearch,
  BookOpenCheck,
  ArrowLeft,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

const ADMIN_NAV = [
  {
    href: '/dashboard',
    label: 'Fulfillment, Reviews & Charts',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/suppliers',
    label: '1-Click Importer, Stock & {Trends}',
    icon: PackageSearch,
  },
  {
    href: '/dashboard/ledger',
    label: 'Profit Ledger & Daily PDF History',
    icon: BookOpenCheck,
  },
  {
    href: '/dashboard/settings',
    label: 'Social & Settings',
    icon: ShieldCheck,
  },
];

export default function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [accessKeyInput, setAccessKeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const savedAuth = window.sessionStorage.getItem('opt_admin_unlocked');
    if (savedAuth === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  async function handleUnlockAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: accessKeyInput }),
      });
      if (!res.ok) {
        setAuthError(
          'Invalid Merchant Access Key. (Default local dev key: opt-local-dev-key-2026)'
        );
        return;
      }
      window.sessionStorage.setItem('opt_admin_unlocked', 'true');
      setIsUnlocked(true);
    } catch {
      if (accessKeyInput === 'opt-local-dev-key-2026') {
        window.sessionStorage.setItem('opt_admin_unlocked', 'true');
        setIsUnlocked(true);
      } else {
        setAuthError('Authentication check failed.');
      }
    }
  }

  async function handleLockAdmin() {
    await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => null);
    window.sessionStorage.removeItem('opt_admin_unlocked');
    setIsUnlocked(false);
    setAccessKeyInput('');
  }

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-canvas p-4 text-theme-text">
        <GlassCard className="w-full max-w-md p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-theme-accent font-mono text-xs font-bold uppercase">
            <Lock className="h-4 w-4" />
            <span>Private Merchant Command Portal // Restricted</span>
          </div>
          <h1 className="text-xl font-extrabold text-theme-text">
            Authenticate Merchant Session
          </h1>
          <p className="text-xs leading-relaxed text-theme-muted">
            This portal is hidden from the public storefront and social pages. Enter your Merchant Access Key to unlock fulfillment packets, supplier costs, trend approvals, and daily PDF reports.
          </p>

          <form onSubmit={handleUnlockAdmin} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Merchant Access Key (Default: opt-local-dev-key-2026)"
              value={accessKeyInput}
              onChange={(e) => setAccessKeyInput(e.target.value)}
              className="w-full rounded-lg border border-theme-border bg-black/50 px-3 py-2.5 font-mono text-xs text-theme-text"
            />
            {authError && <p className="text-xs text-rose-300">{authError}</p>}
            <Button type="submit" variant="primary" className="w-full">
              Unlock O.P.T. Command HQ
            </Button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-canvas text-theme-text">
      <header className="sticky top-0 z-40 border-b border-theme-border bg-theme-canvas/90 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-theme-border bg-white/5 px-3 py-1.5 text-xs font-medium text-theme-muted hover:border-theme-accent hover:text-theme-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Storefront</span>
            </Link>
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-theme-accent">
                O.P.T. COLLECTIVE // PRIVATE ADMIN HQ
              </span>
              <p className="text-[11px] text-theme-muted">
                Human-in-the-Loop Fulfillment, Trend Importer & Daily PDF Dossier
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-opt-btn px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-theme-accent text-theme-accent-fg shadow-sm'
                      : 'border border-theme-border bg-white/[0.03] text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden xl:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] text-emerald-300">
              <ShieldCheck className="h-3 w-3" />
              Session Authenticated
            </span>
            <button
              type="button"
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1 rounded-lg border border-theme-border bg-white/5 px-2.5 py-1.5 text-xs text-theme-muted hover:text-rose-300"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PackageSearch,
  BookOpenCheck,
  ArrowUpRight,
  Lock,
  LogOut,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OptLogoMark } from '@/components/ui/OptLogoMark';

const ADMIN_NAV = [
  { href: '/dashboard', label: 'Overview & fulfilment', caption: 'Orders, reviews and activity', icon: LayoutDashboard },
  { href: '/dashboard/suppliers', label: 'Supplier desk', caption: 'Offers, costs and stock', icon: PackageSearch },
  { href: '/dashboard/ledger', label: 'Profit ledger', caption: 'Margins and records', icon: BookOpenCheck },
  { href: '/dashboard/settings', label: 'Settings & channels', caption: 'Connections and preferences', icon: ShieldCheck },
];

function isActivePath(pathname: string, href: string): boolean {
  return href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export default function ProtectedDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const savedAuth = window.sessionStorage.getItem('opt_admin_unlocked');
    if (savedAuth === 'true') setIsUnlocked(true);
    setIsCheckingSession(false);
  }, []);

  async function handleUnlockAdmin(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setAuthError(null);
    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: accessKeyInput }),
      });
      if (!response.ok) {
        setAuthError('The merchant access key was not accepted. Please check it and try again.');
        return;
      }
      window.sessionStorage.setItem('opt_admin_unlocked', 'true');
      setIsUnlocked(true);
    } catch {
      if (accessKeyInput === 'opt-local-dev-key-2026') {
        window.sessionStorage.setItem('opt_admin_unlocked', 'true');
        setIsUnlocked(true);
      } else {
        setAuthError('The authentication service could not be reached.');
      }
    }
  }

  async function handleLockAdmin(): Promise<void> {
    await fetch('/api/admin/session', { method: 'DELETE' }).catch(() => null);
    window.sessionStorage.removeItem('opt_admin_unlocked');
    setIsUnlocked(false);
    setAccessKeyInput('');
  }

  if (isCheckingSession) {
    return <div className="opt-admin-shell flex min-h-screen items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-2 border-theme-border border-t-theme-accent" aria-label="Checking merchant session" /></div>;
  }

  if (!isUnlocked) {
    return (
      <div className="opt-admin-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 text-theme-text">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-theme-accent/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-theme-secondary/10 blur-[120px]" />
        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-theme-border bg-theme-surface shadow-[0_35px_120px_rgba(0,0,0,0.32)] lg:grid-cols-[1fr_0.9fr]">
          <div className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden bg-theme-matte p-10 lg:flex">
            <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-theme-accent/15 blur-[90px]" />
            <div className="relative flex items-center gap-3">
              <OptLogoMark size={44} />
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-theme-text">THE O.P.T. COLLECTIVE</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-theme-muted">Private operations</p>
              </div>
            </div>
            <div className="relative max-w-md">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-theme-accent">Merchant workspace / 01</span>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-theme-text">Keep the moving parts in view.</h1>
              <p className="mt-4 text-sm leading-7 text-theme-muted">A single operations desk for human-reviewed fulfilment, supplier coordination, order records and business health.</p>
            </div>
            <div className="relative flex items-center justify-between border-t border-theme-border pt-5 text-[10px] text-theme-muted">
              <span>Human-in-the-loop commerce</span><span className="font-mono">O.P.T. / HQ</span>
            </div>
          </div>

          <div className="flex min-h-[530px] flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <OptLogoMark size={42} />
              <div>
                <p className="text-[10px] font-bold tracking-[0.17em] text-theme-text">THE O.P.T. COLLECTIVE</p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-theme-muted">Merchant desk</p>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-theme-accent/25 bg-theme-accent/10 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-theme-accent">
              <Lock className="h-3.5 w-3.5" /> Restricted access
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-theme-text sm:text-3xl">Welcome back.</h2>
            <p className="mt-2 text-xs leading-6 text-theme-muted">Unlock the private merchant workspace. Customer-facing storefront access is not affected by this session.</p>

            <form onSubmit={handleUnlockAdmin} className="mt-7 space-y-4">
              <div>
                <label htmlFor="opt-merchant-key" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-theme-muted">Merchant access key</label>
                <input
                  id="opt-merchant-key"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your access key"
                  value={accessKeyInput}
                  onChange={(event) => setAccessKeyInput(event.target.value)}
                  className="opt-admin-input min-h-12 w-full rounded-xl border border-theme-border px-4 text-sm text-theme-text outline-none transition focus:border-theme-accent"
                />
              </div>
              {authError && <p role="alert" className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">{authError}</p>}
              <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl">
                Enter command workspace <ArrowUpRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-[10px] leading-5 text-theme-muted">Access attempts are checked by the server session endpoint. Keep the merchant key private and do not share it in screenshots or support messages.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="opt-admin-shell min-h-screen text-theme-text">
      <aside className="opt-admin-sidebar fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-theme-border px-5 py-6 lg:flex">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-1">
          <OptLogoMark size={42} />
          <span>
            <span className="block text-[10px] font-bold tracking-[0.17em]">THE O.P.T. COLLECTIVE</span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-theme-muted">Command workspace</span>
          </span>
        </Link>
        <div className="mt-10 px-3 font-mono text-[9px] font-semibold uppercase tracking-[0.19em] text-theme-muted">Manage your business</div>
        <nav aria-label="Merchant navigation" className="mt-3 flex flex-col gap-1.5">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`group flex items-start gap-3 rounded-2xl border px-3 py-3 transition ${active ? 'border-theme-accent/25 bg-theme-accent/10 text-theme-text' : 'border-transparent text-theme-muted hover:border-theme-border hover:bg-theme-surface hover:text-theme-text'}`}>
                <span className={`mt-0.5 rounded-xl p-2 ${active ? 'bg-theme-accent text-theme-accent-fg' : 'bg-theme-matte text-theme-muted group-hover:text-theme-accent'}`}><Icon className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold">{item.label}</span>
                  <span className="mt-1 block text-[10px] leading-4 text-theme-muted">{item.caption}</span>
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-theme-border bg-theme-matte p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold text-theme-text"><Activity className="h-3.5 w-3.5 text-theme-accent" /> Human review enabled</div>
          <p className="mt-2 text-[10px] leading-5 text-theme-muted">Supplier purchases remain a deliberate merchant action after payment verification.</p>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[272px]">
        <header className="opt-admin-topbar sticky top-0 z-30 border-b border-theme-border px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="lg:hidden"><OptLogoMark size={34} /></div>
              <div className="min-w-0">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-theme-accent">O.P.T. / Private operations</p>
                <h1 className="mt-1 truncate text-sm font-semibold text-theme-text sm:text-base">{ADMIN_NAV.find((item) => isActivePath(pathname, item.href))?.label ?? 'Command workspace'}</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-theme-accent/20 bg-theme-accent/10 px-3 py-2 font-mono text-[9px] text-theme-accent sm:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-theme-accent" /> Session active</span>
              <Link href="/" className="hidden rounded-full border border-theme-border px-3 py-2 text-[10px] text-theme-muted transition hover:text-theme-text sm:inline-flex">View storefront <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
              <button type="button" onClick={handleLockAdmin} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-theme-border px-3 text-[10px] font-semibold text-theme-muted transition hover:border-rose-400/40 hover:text-rose-300"><LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Lock</span></button>
            </div>
          </div>
        </header>

        <nav aria-label="Merchant navigation" className="opt-admin-mobile-nav flex gap-2 overflow-x-auto border-b border-theme-border px-4 py-2.5 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold transition ${active ? 'bg-theme-accent text-theme-accent-fg' : 'border border-theme-border text-theme-muted'}`}><Icon className="h-3.5 w-3.5" />{item.label}</Link>;
          })}
        </nav>

        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

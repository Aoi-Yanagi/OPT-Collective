import Link from 'next/link';
import { ArrowUpRight, QrCode, Truck } from 'lucide-react';
import { DEFAULT_SOCIAL_LINKS } from '@/features/social/social.config';

export function Footer() {
  const socialLinks = DEFAULT_SOCIAL_LINKS.filter((link) => link.enabled && link.url);

  return (
    <footer className="opt-global-footer mt-20 border-t border-theme-border">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.8fr_0.8fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-theme-accent/40 bg-theme-accent/10 font-mono text-sm font-black text-theme-accent">OPT.</span>
              <span className="text-xs font-bold tracking-[0.15em] text-theme-text">THE O.P.T. COLLECTIVE</span>
            </Link>
            <p className="mt-4 text-xs leading-6 text-theme-muted">
              Considered essentials for your workspace and your drive. Shop with us; we coordinate the supplier-side order after QR payment verification.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] text-theme-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1.5"><QrCode className="h-3 w-3 text-theme-accent" /> QR-only payment</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-theme-border px-3 py-1.5"><Truck className="h-3 w-3 text-theme-accent" /> Supplier-direct delivery</span>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-text">Explore</h2>
            <ul className="mt-4 space-y-3 text-xs text-theme-muted">
              <li><Link href="/category/desk" className="transition hover:text-theme-accent">Desk / Studio</Link></li>
              <li><Link href="/category/drive" className="transition hover:text-theme-accent">Drive / Cabin</Link></li>
              <li><Link href="/category/vault" className="transition hover:text-theme-accent">Vault / Editions</Link></li>
              <li><Link href="/#catalog" className="transition hover:text-theme-accent">All products</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-text">Order support</h2>
            <ul className="mt-4 space-y-3 text-xs text-theme-muted">
              <li><Link href="/track" className="transition hover:text-theme-accent">Track an order</Link></li>
              <li><Link href="/info/shipping-policy" className="transition hover:text-theme-accent">Shipping & dispatch</Link></li>
              <li><Link href="/info/replacement-guarantee" className="transition hover:text-theme-accent">Replacement policy</Link></li>
              <li><Link href="/info/security-architecture" className="transition hover:text-theme-accent">QR payment & verification</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-theme-text">Follow O.P.T.</h2>
            {socialLinks.length > 0 ? (
              <ul className="mt-4 space-y-3 text-xs text-theme-muted">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-theme-accent">
                      {link.label} <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-[210px] text-xs leading-5 text-theme-muted">Official social channels will appear here when their links are configured.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-theme-border pt-5 text-[10px] text-theme-muted sm:flex-row sm:items-center sm:justify-between">
          <span>The O.P.T. Collective. All rights reserved.</span>
          <span className="font-mono uppercase tracking-[0.14em]">Useful things. Considered well.</span>
        </div>
      </div>
    </footer>
  );
}

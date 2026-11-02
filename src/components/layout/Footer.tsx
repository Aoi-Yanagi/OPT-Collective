'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, CheckCircle, ExternalLink } from 'lucide-react';
import { OptLogoMark } from '@/components/ui/OptLogoMark';
import { DEFAULT_SOCIAL_LINKS, SocialPlatformLink } from '@/features/social/social.config';

export function Footer() {
  const activeSocials = DEFAULT_SOCIAL_LINKS.filter(
    (s: SocialPlatformLink) => s.enabled && s.url
  );

  return (
    <footer className="mt-20 border-t border-theme-border bg-black/40 py-12 text-xs text-theme-muted print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <OptLogoMark size={34} />
              <h4 className="font-mono text-sm font-bold text-theme-text">
                THE O.P.T. COLLECTIVE
              </h4>
            </div>
            <p className="leading-relaxed">
              Optimal Performance Tools for your workspace and daily drive. Curated &amp; stress-tested in India with Direct Partner Hub Dispatch and zero-fee QR verification.
            </p>
          </div>

          <div>
            <h5 className="font-mono font-semibold uppercase text-theme-text">
              Divisions &amp; Tracking
            </h5>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/category/desk" className="hover:text-theme-accent">
                  O.P.T. // DESK (WFH &amp; Study)
                </Link>
              </li>
              <li>
                <Link href="/category/drive" className="hover:text-theme-accent">
                  O.P.T. // DRIVE (Car Interior)
                </Link>
              </li>
              <li>
                <Link href="/category/vault" className="hover:text-theme-accent">
                  O.P.T. // FESTIVE VAULT
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-theme-accent text-theme-accent font-semibold">
                  Track Order &amp; Download Receipt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono font-semibold uppercase text-theme-text">
              Policies &amp; Buyer Shield
            </h5>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/info/shipping-policy" className="hover:text-theme-accent">
                  Direct Partner Hub Dispatch (4–6 Days)
                </Link>
              </li>
              <li>
                <Link href="/info/replacement-guarantee" className="hover:text-theme-accent">
                  7-Day Unboxing Replacement Shield
                </Link>
              </li>
              <li>
                <Link href="/info/privacy-security" className="hover:text-theme-accent">
                  Privacy &amp; QR Security Charter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono font-semibold uppercase text-theme-text">
              Security &amp; Official Channels
            </h5>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-theme-text">
                <Shield className="h-4 w-4 text-theme-accent" />
                <span>Dedicated 3-Stage QR Checkout</span>
              </div>
              <div className="flex items-center gap-2 text-theme-text">
                <Lock className="h-4 w-4 text-theme-accent" />
                <span>Privacy-Masked Order Tracking</span>
              </div>
              <div className="flex items-center gap-2 text-theme-text">
                <CheckCircle className="h-4 w-4 text-theme-accent" />
                <span>Neutral Unbranded Outer Parcels</span>
              </div>
            </div>

            {activeSocials.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-theme-border pt-3">
                {activeSocials.map((soc: SocialPlatformLink) => (
                  <a
                    key={soc.id}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-theme-border bg-white/5 px-2 py-1 text-[10px] text-theme-text hover:border-theme-accent"
                  >
                    <span>{soc.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-theme-accent" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-theme-border pt-6 text-center text-[11px]">
          © {new Date().getFullYear()} The O.P.T. Collective (Optimal Performance Tools). Engineered for 60fps Multi-OS Adaptive Commerce.
        </div>
      </div>
    </footer>
  );
}
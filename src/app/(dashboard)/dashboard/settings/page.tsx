'use client';

import React, { useState } from 'react';
import {
  DEFAULT_SOCIAL_LINKS,
  SocialPlatformLink,
} from '@/features/social/social.config';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import {
  Settings,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Bot,
} from 'lucide-react';

export default function MerchantSettingsPage() {
  const [socialLinks, setSocialLinks] =
    useState<SocialPlatformLink[]>(DEFAULT_SOCIAL_LINKS);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  function updateSocialField(
    id: SocialPlatformLink['id'],
    field: 'url' | 'handle' | 'enabled',
    value: string | boolean
  ) {
    setSocialLinks((prev: SocialPlatformLink[]) =>
      prev.map((item: SocialPlatformLink) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function handleSaveSocialConfig(e: React.FormEvent) {
    e.preventDefault();
    try {
      window.localStorage.setItem(
        'opt_social_links_config',
        JSON.stringify(socialLinks)
      );
      setSavedBanner(
        '✓ Social links configuration saved! Enabled links are now active in the global Header and Footer.'
      );
      setTimeout(() => setSavedBanner(null), 4000);
    } catch {
      setSavedBanner('Saved in active session.');
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-xs font-bold uppercase text-theme-accent flex items-center gap-1.5">
          <Settings className="h-4 w-4" />
          MERCHANT CONFIGURATION // SOCIAL HUB &amp; INTEGRATION BOUNDARIES
        </span>
        <h1 className="mt-1 text-2xl font-extrabold text-theme-text">
          Storefront Social Channels &amp; Confidential Integration Status
        </h1>
      </div>

      {savedBanner && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-xs font-bold text-emerald-200">
          {savedBanner}
        </div>
      )}

      {/* Centralized Social Links Manager */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-theme-border pb-3">
          <Globe className="h-4 w-4 text-theme-accent" />
          <h2 className="font-mono text-xs font-bold uppercase text-theme-accent">
            Centralized SocialLinksConfig (Header Popover &amp; Footer)
          </h2>
        </div>
        <p className="text-xs text-theme-muted">
          Only links explicitly enabled with a valid URL below are rendered on the public storefront. No intrusive popups or floating icons are ever shown.
        </p>

        <form onSubmit={handleSaveSocialConfig} className="space-y-4">
          {socialLinks.map((platform: SocialPlatformLink) => (
            <div
              key={platform.id}
              className="opt-matte-surface grid grid-cols-1 gap-3 p-4 sm:grid-cols-12 items-center text-xs"
            >
              <div className="sm:col-span-3">
                <strong className="text-theme-text block">{platform.label}</strong>
                <span className="font-mono text-[10px] uppercase text-theme-muted">
                  ID: {platform.id}
                </span>
              </div>

              <div className="sm:col-span-3">
                <input
                  placeholder="@handle"
                  value={platform.handle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSocialField(platform.id, 'handle', e.target.value)
                  }
                  className="w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2 font-mono text-xs text-theme-text"
                />
              </div>

              <div className="sm:col-span-4">
                <input
                  placeholder={`https://${platform.id}.com/...`}
                  value={platform.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSocialField(platform.id, 'url', e.target.value)
                  }
                  className="w-full rounded-lg border border-theme-border bg-black/40 px-3 py-2 text-xs text-theme-text"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <label className="inline-flex cursor-pointer items-center gap-2 font-mono text-xs">
                  <input
                    type="checkbox"
                    checked={platform.enabled}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSocialField(platform.id, 'enabled', e.target.checked)
                    }
                    className="h-4 w-4 rounded border-theme-border"
                  />
                  <span
                    className={
                      platform.enabled ? 'text-emerald-400 font-bold' : 'text-theme-muted'
                    }
                  >
                    {platform.enabled ? 'Active' : 'Hidden'}
                  </span>
                </label>
              </div>
            </div>
          ))}

          <Button type="submit" variant="primary" size="md">
            <CheckCircle2 className="h-4 w-4" />
            <span>Save Social Hub Configuration</span>
          </Button>
        </form>
      </GlassCard>

      {/* Integration Slot & Bot Channels Status */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard className="p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold uppercase text-theme-accent">
            <Lock className="h-4 w-4" />
            <span>Confidential PaymentIntegrationSlot Boundary</span>
          </div>
          <p className="text-theme-muted leading-relaxed">
            Connected via <code className="text-theme-text">src/features/payment/paymentIntegrationBoundary.ts</code>. Customer checkout is strictly locked to <strong>Merchant QR Only</strong>. Never fabricates payment success on client button clicks.
          </p>
          <div className="rounded-lg border border-theme-border bg-black/40 p-3 font-mono text-[11px] space-y-1">
            <div>Adapter ID: opt-confidential-slot-v1</div>
            <div className="text-emerald-400">
              Mode: Authoritative Server Verification Queue
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold uppercase text-theme-accent">
            <Bot className="h-4 w-4" />
            <span>4-Channel Multi-Bot Notification Bus</span>
          </div>
          <p className="text-theme-muted leading-relaxed">
            Configured in <code className="text-theme-text">src/features/notifications/botRouter.ts</code>. Routes live events to dedicated Telegram Bot chats and your Google Sheets ledger webhook:
          </p>
          <ul className="font-mono text-[11px] space-y-1 text-theme-text">
            <li>• ORDERS_INTAKE (Stage 2 Order Snapshots)</li>
            <li>• PAYMENT_VERIFICATION (Stage 3 QR &amp; Forensics)</li>
            <li>• FULFILLMENT_OPS (Supplier Dispatch &amp; Tracking)</li>
            <li>• CATALOG_WAITLIST (Stock-Out &amp; Restock Alerts)</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
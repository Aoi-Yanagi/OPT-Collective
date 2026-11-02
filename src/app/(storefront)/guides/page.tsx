'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  OPT_EDITORIAL_GUIDES,
  EditorialGuideArticle,
} from '@/features/guides/guides.data';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';

export default function EditorialGuidesHubPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');

  const filteredGuides: EditorialGuideArticle[] =
    selectedDivision === 'ALL'
      ? OPT_EDITORIAL_GUIDES
      : OPT_EDITORIAL_GUIDES.filter(
          (g: EditorialGuideArticle) => g.division === selectedDivision
        );

  const adsensePublisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 border-b border-theme-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-theme-accent/40 bg-theme-accent/10 px-3 py-1 font-mono text-[11px] font-bold uppercase text-theme-accent">
            <BookOpen className="h-3.5 w-3.5" />
            <span>O.P.T. COLLECTIVE // EDITORIAL &amp; HARDWARE TESTING LAB</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text sm:text-4xl">
            Ergonomic Guides, Cabin Teardowns &amp; Viral Gear Tests
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-theme-muted sm:text-sm">
            Research-backed guides on posture engineering, laptop thermal management, and Indian road essentials—paired with direct partner-hub hardware benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {['ALL', 'DESK', 'DRIVE', 'VAULT'].map((div: string) => (
            <button
              key={div}
              type="button"
              onClick={() => setSelectedDivision(div)}
              className={`rounded-full px-3.5 py-1.5 font-bold transition ${
                selectedDivision === div
                  ? 'bg-theme-accent text-theme-accent-fg'
                  : 'border border-theme-border bg-white/5 text-theme-muted hover:text-theme-text'
              }`}
            >
              {div === 'ALL' ? 'All Guides' : `O.P.T. // ${div}`}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide: EditorialGuideArticle) => (
          <GlassCard
            key={guide.id}
            interactive
            className="flex flex-col justify-between overflow-hidden"
          >
            <div>
              <Link href={`/guides/${guide.slug}`} className="block">
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg border border-theme-border bg-black/50">
                  <img
                    src={guide.heroImage}
                    alt={guide.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-black/85 px-2.5 py-1 font-mono text-[10px] font-bold text-theme-accent">
                    {guide.categoryTag}
                  </span>
                </div>
              </Link>

              <div className="flex items-center justify-between font-mono text-[11px] text-theme-muted">
                <span>DIVISION // {guide.division}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-theme-accent" />
                  {guide.readTimeMinutes} min read
                </span>
              </div>

              <Link href={`/guides/${guide.slug}`} className="group mt-2 block">
                <h2 className="text-base font-extrabold text-theme-text group-hover:text-theme-accent transition-colors">
                  {guide.title}
                </h2>
              </Link>

              <p className="mt-2 text-xs leading-relaxed text-theme-muted">
                {guide.subtitle}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {guide.targetKeywords.slice(0, 2).map((kw: string) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 rounded border border-theme-border bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-theme-muted"
                  >
                    <Tag className="h-2.5 w-2.5 text-theme-accent" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-theme-border pt-4">
              <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-theme-muted block">
                    Tested Benchmark Unit
                  </span>
                  <strong className="text-theme-text">
                    {guide.featuredProductTitle}
                  </strong>
                </div>
                <span className="font-mono font-black text-theme-accent">
                  ₹{guide.featuredProductPriceInr}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-accent hover:underline"
                >
                  <span>Read Full Technical Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={`/product/${guide.featuredProductSlug}`}
                  className="rounded-lg border border-theme-border bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold text-theme-text hover:border-theme-accent"
                >
                  Inspect Unit →
                </Link>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Compliant Display Ad / Sponsor Boundary (Isolated to Editorial Hub, Never on Checkout) */}
      <div className="opt-matte-surface p-5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-theme-accent" />
            <span className="font-mono text-[11px] font-bold uppercase text-theme-accent">
              {adsensePublisherId
                ? `Editorial Sponsor & AdSense Slot Active (${adsensePublisherId})`
                : 'Editorial Partner & Display Monetisation Slot (AdSense Ready)'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Zero-Clutter Policy: Never Shown on Product Checkout Pages
          </span>
        </div>
      </div>
    </div>
  );
}
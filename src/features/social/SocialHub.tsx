'use client';

import React, { useState } from 'react';
import { Share2, ExternalLink, Check, Copy, Globe } from 'lucide-react';
import { DEFAULT_SOCIAL_LINKS, SocialPlatformLink } from './social.config';

export function SocialHeaderMenu({ customLinks }: { customLinks?: SocialPlatformLink[] }) {
  const [open, setOpen] = useState(false);
  const links = (customLinks || DEFAULT_SOCIAL_LINKS).filter((l) => l.enabled && l.url);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Official Social Channels"
        className="inline-flex items-center gap-1.5 rounded-full border border-theme-border bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-theme-muted hover:border-theme-accent hover:text-theme-text transition"
      >
        <Globe className="h-3.5 w-3.5 text-theme-accent" />
        <span className="hidden xl:inline">Channels</span>
      </button>

      {open && (
        <div className="opt-glass absolute right-0 mt-2 w-60 p-3 shadow-2xl z-50">
          <div className="flex items-center justify-between border-b border-theme-border pb-2">
            <span className="font-mono text-[10px] font-bold uppercase text-theme-accent">
              Official O.P.T. Channels
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-[10px] text-theme-muted hover:text-theme-text"
            >
              Close
            </button>
          </div>

          {links.length === 0 ? (
            <p className="py-3 text-[11px] text-theme-muted">
              Social channels can be enabled anytime in Merchant Settings.
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {links.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-theme-text hover:bg-white/5 transition"
                  >
                    <div>
                      <span className="font-semibold block">{item.label}</span>
                      <span className="font-mono text-[10px] text-theme-muted">{item.handle}</span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-theme-accent" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Product & Store Share Button using native device Web Share API with copy-link fallback.
 */
export function ProductShareButton({
  title,
  text,
  urlPath,
}: {
  title: string;
  text: string;
  urlPath: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl =
      typeof window !== 'undefined' ? `${window.location.origin}${urlPath}` : urlPath;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User cancelled or share failed; fall back to clipboard copy
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className="inline-flex items-center gap-1.5 rounded-opt-btn border border-theme-border bg-white/5 px-3 py-2 text-xs font-medium text-theme-muted hover:border-theme-accent hover:text-theme-text transition"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-300">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-theme-accent" />
          <span>Share Gear</span>
        </>
      )}
    </button>
  );
}
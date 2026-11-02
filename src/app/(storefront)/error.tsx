'use client';

import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default function StorefrontErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto my-16 max-w-lg px-4">
      <div className="opt-glass p-6 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-theme-accent" />
        <h2 className="mt-3 text-base font-semibold text-theme-text">
          Module Isolated — Storefront Remains Safe
        </h2>
        <p className="mt-1.5 text-xs text-theme-muted">
          A temporary hiccup occurred in this section ({error.message || 'Render Exception'}). Other pages and your shopping bag are unaffected.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 inline-flex items-center gap-2 rounded-opt-btn bg-theme-accent px-4 py-2 text-xs font-bold text-theme-accent-fg transition hover:opacity-90"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reload This Module
        </button>
      </div>
    </div>
  );
}
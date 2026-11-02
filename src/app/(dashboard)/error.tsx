'use client';

import React from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

export default function DashboardErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto my-12 max-w-lg">
      <div className="opt-glass p-6 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-amber-400" />
        <h2 className="mt-2 text-base font-bold text-theme-text">
          Dashboard Module Fault Isolated
        </h2>
        <p className="mt-1 text-xs text-theme-muted">
          {error.message || 'An error occurred in the dashboard view.'} Your public storefront and customer checkout remain 100% online.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 inline-flex items-center gap-1.5 rounded-opt-btn bg-theme-accent px-4 py-2 text-xs font-bold text-theme-accent-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Module</span>
        </button>
      </div>
    </div>
  );
}
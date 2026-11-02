'use client';

import React, { useCallback, useState } from 'react';
import { Check, Moon, Palette, Shuffle, Sun } from 'lucide-react';
import { useOptTheme } from '@/features/theme-engine/ThemeContext';
import { OptDialog } from './OptDialog';

export function ThemeStudio() {
  const [open, setOpen] = useState(false);
  const { palette, randomizeTheme, setThemeMode, resetTheme } = useOptTheme();
  const closeStudio = useCallback(() => setOpen(false), []);

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={randomizeTheme}
          title="Generate a new curated colour mood"
          className="opt-mood-button inline-flex min-h-10 items-center gap-2 rounded-full border border-theme-border px-3 py-2 text-[11px] font-semibold text-theme-text transition hover:-translate-y-0.5 hover:border-theme-accent hover:bg-theme-accent/10"
        >
          <Shuffle className="h-3.5 w-3.5 text-theme-accent" />
          <span className="hidden sm:inline">New mood</span>
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open theme studio"
          aria-haspopup="dialog"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme-border text-theme-muted transition hover:border-theme-accent hover:text-theme-accent"
        >
          <Palette className="h-4 w-4" />
        </button>
      </div>

      <OptDialog
        open={open}
        onClose={closeStudio}
        title="Set the atmosphere."
        description="Choose a light or dark foundation, then let the palette engine find a considered combination of surface, accent and finish."
        eyebrow="O.P.T. / THEME STUDIO"
        size="lg"
        footer={(
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={resetTheme} className="min-h-10 rounded-full px-4 text-xs font-medium text-theme-muted transition hover:text-theme-text">Restore signature mood</button>
            <button type="button" onClick={() => { randomizeTheme(); closeStudio(); }} className="opt-primary-cta inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold">
              <Shuffle className="h-3.5 w-3.5" /> Find another mood
            </button>
          </div>
        )}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-theme-border bg-theme-matte p-1.5">
            <button
              type="button"
              aria-pressed={palette.mode === 'day'}
              onClick={() => setThemeMode('day')}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${palette.mode === 'day' ? 'bg-theme-accent text-theme-accent-fg shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
            >
              <Sun className="h-4 w-4" /> Daylight
            </button>
            <button
              type="button"
              aria-pressed={palette.mode === 'night'}
              onClick={() => setThemeMode('night')}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${palette.mode === 'night' ? 'bg-theme-accent text-theme-accent-fg shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
            >
              <Moon className="h-4 w-4" /> After hours
            </button>
          </div>

          <div className="opt-palette-preview relative overflow-hidden rounded-[1.35rem] border border-theme-border p-5 sm:p-6" style={{ background: palette.canvas }}>
            <div className="pointer-events-none absolute -right-10 -top-20 h-52 w-52 rounded-full blur-3xl" style={{ background: palette.glow }} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: palette.accent }}>CURRENT PALETTE</p>
                <h3 className="mt-1 text-lg font-semibold" style={{ color: palette.text }}>{palette.name}</h3>
                <p className="mt-1 text-xs" style={{ color: palette.muted }}>{palette.surfaceName} surface · {palette.finish} finish · {palette.mode} mode</p>
              </div>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: palette.accent, color: palette.accentForeground }}><Check className="h-4 w-4" /></span>
            </div>
            <div className="relative mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-xl border p-3" style={{ background: palette.surface, borderColor: palette.border }}>
                <span className="block h-5 w-5 rounded-full" style={{ background: palette.accent }} />
                <span className="mt-3 block text-[10px] font-semibold" style={{ color: palette.text }}>Accent</span>
              </div>
              <div className="rounded-xl border p-3" style={{ background: palette.elevated, borderColor: palette.border }}>
                <span className="block h-5 w-5 rounded-full" style={{ background: palette.secondaryAccent }} />
                <span className="mt-3 block text-[10px] font-semibold" style={{ color: palette.text }}>Highlight</span>
              </div>
              <div className="rounded-xl border p-3" style={{ background: palette.matte, borderColor: palette.border }}>
                <span className="block h-5 w-5 rounded-full" style={{ background: palette.text }} />
                <span className="mt-3 block text-[10px] font-semibold" style={{ color: palette.text }}>Ink</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-theme-text">A different feeling, one shuffle away.</h3>
              <p className="mt-1 text-xs leading-5 text-theme-muted">384 curated combinations across 8 surface families, 8 accent families, 3 finishes and 2 modes.</p>
            </div>
            <button type="button" onClick={randomizeTheme} className="opt-secondary-cta inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-xs font-semibold">
              <Shuffle className="h-3.5 w-3.5" /> Shuffle palette
            </button>
          </div>
        </div>
      </OptDialog>
    </>
  );
}

export default ThemeStudio;

'use client';

import React from 'react';
import { Palette, Lock, Sparkles, MonitorSmartphone } from 'lucide-react';
import { AVAILABLE_THEMES, useOptTheme } from '@/features/theme-engine/ThemeContext';
import { DevicePlatform } from '@/types/theme.types';

interface ThemeBarProps {
  currentPlatform: DevicePlatform;
  onOverridePlatform: (p: DevicePlatform | null) => void;
}

export function ThemeBar({ currentPlatform, onOverridePlatform }: ThemeBarProps) {
  const { activeTheme, behaviorMode, setManualTheme, setBehaviorMode } = useOptTheme();

  return (
    <div className="border-b border-theme-border bg-black/40 px-4 py-2 text-[11px]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Theme Mode Toggle: Category-Adaptive vs Parent-Locked */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-theme-muted">
            <Palette className="h-3.5 w-3.5 text-theme-accent" />
            Theme Engine:
          </span>

          <button
            onClick={() =>
              setBehaviorMode(behaviorMode === 'category-adaptive' ? 'parent-locked' : 'category-adaptive')
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-theme-border bg-white/5 px-2.5 py-1 font-medium text-theme-text hover:border-theme-accent"
          >
            {behaviorMode === 'parent-locked' ? (
              <>
                <Lock className="h-3 w-3 text-theme-accent" />
                <span>Parent Theme Locked</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 text-theme-accent" />
                <span>Auto Category Theme</span>
              </>
            )}
          </button>

          {/* Direct Theme Swatches */}
          <div className="flex items-center gap-1 pl-1">
            {AVAILABLE_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setManualTheme(t.id)}
                title={`${t.name} — ${t.tagline}`}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 transition ${
                  activeTheme === t.id
                    ? 'border-theme-accent bg-white/10 text-theme-text font-semibold'
                    : 'border-transparent text-theme-muted hover:text-theme-text'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: t.previewHex }}
                />
                <span className="hidden sm:inline">{t.id.replace('opt-', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* OS & Device Simulator */}
        <div className="flex items-center gap-2">
          <MonitorSmartphone className="h-3.5 w-3.5 text-theme-accent" />
          <select
            value={currentPlatform}
            onChange={(e) => onOverridePlatform(e.target.value as DevicePlatform)}
            className="rounded border border-theme-border bg-black/60 px-2 py-0.5 text-[11px] text-theme-text focus:outline-none"
          >
            <option value="windows-desktop">Windows Desktop (QR + 3D)</option>
            <option value="macos-desktop">macOS Desktop (Frosted + 3D)</option>
            <option value="android-mobile">Android Phone (UPI Call + 60fps)</option>
            <option value="ios-mobile">iPhone iOS (UPI Call + 60fps)</option>
            <option value="android-desktop-override">Android [Desktop Site Mode]</option>
            <option value="ios-desktop-override">iPhone [Desktop Site Mode]</option>
          </select>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeSchemeId, ThemeBehaviorMode, DivisionKey, ThemeDefinition } from '@/types/theme.types';
import {
  DEFAULT_PALETTE,
  getPaletteById,
  getRandomPalette,
  THEME_PALETTES,
} from './palette-engine';
import type { ThemeMode, ThemePalette } from './palette-engine';

const THEME_STORAGE_KEY = 'opt_collective_palette_v3';

export const AVAILABLE_THEMES: ThemeDefinition[] = [
  { id: 'opt-parent', name: 'O.P.T. Signature', tagline: 'Evergreen on Obsidian', mappedDivision: 'ALL', previewHex: '#10b981' },
  { id: 'desk-cyan', name: 'Desk / Studio', tagline: 'Cobalt and mist', mappedDivision: 'DESK', previewHex: '#315D8A' },
  { id: 'drive-amber', name: 'Drive / Cabin', tagline: 'Terracotta and espresso', mappedDivision: 'DRIVE', previewHex: '#96563D' },
  { id: 'vault-gold', name: 'Vault / Editions', tagline: 'Ochre and plum', mappedDivision: 'VAULT', previewHex: '#E1C477' },
  { id: 'minimal-light', name: 'Daylight Studio', tagline: 'Paper and evergreen', previewHex: '#245C4C' },
];

interface ThemeContextValue {
  activeTheme: ThemeSchemeId;
  behaviorMode: ThemeBehaviorMode;
  activeDivision: DivisionKey;
  palette: ThemePalette;
  randomizeTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  resetTheme: () => void;
  setManualTheme: (theme: ThemeSchemeId) => void;
  setBehaviorMode: (mode: ThemeBehaviorMode) => void;
  selectDivisionWithTheme: (division: DivisionKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const LEGACY_THEME_PALETTES: Record<ThemeSchemeId, string> = {
  'opt-parent': DEFAULT_PALETTE.id,
  'desk-cyan': 'night-slate-cobalt-glass',
  'drive-amber': 'night-espresso-terracotta-matte',
  'vault-gold': 'night-plum-ochre-paper',
  'minimal-light': 'day-porcelain-evergreen-paper',
};

const DIVISION_TO_THEME: Record<DivisionKey, ThemeSchemeId> = {
  ALL: 'opt-parent',
  DESK: 'desk-cyan',
  DRIVE: 'drive-amber',
  VAULT: 'vault-gold',
};

function applyPalette(palette: ThemePalette): void {
  const root = document.documentElement;
  const tokens: Record<string, string> = {
    '--bg-canvas': palette.canvas,
    '--bg-matte': palette.matte,
    '--bg-surface': palette.surface,
    '--bg-elevated': palette.elevated,
    '--text-primary': palette.text,
    '--text-secondary': palette.muted,
    '--accent-primary': palette.accent,
    '--accent-primary-fg': palette.accentForeground,
    '--accent-secondary': palette.secondaryAccent,
    '--border-subtle': palette.border,
    '--glow-ambient': palette.glow,
  };
  Object.entries(tokens).forEach(([key, value]) => root.style.setProperty(key, value));
  root.dataset.theme = 'custom';
  root.dataset.themeMode = palette.mode;
  root.dataset.themeFinish = palette.finish;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeSchemeId>('opt-parent');
  const [behaviorMode, setBehaviorModeState] = useState<ThemeBehaviorMode>('parent-locked');
  const [activeDivision, setActiveDivision] = useState<DivisionKey>('ALL');
  const [palette, setPalette] = useState<ThemePalette>(DEFAULT_PALETTE);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedId = window.localStorage.getItem(THEME_STORAGE_KEY);
      const savedPalette = savedId ? getPaletteById(savedId) : undefined;
      if (savedPalette) {
        setPalette(savedPalette);
        setActiveTheme(savedPalette.mode === 'day' ? 'minimal-light' : 'opt-parent');
      }
    } catch {
      // Private browsing and storage restrictions should not block theme use.
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    applyPalette(palette);
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, palette.id);
    } catch {
      // The theme remains active for this page even when persistence is unavailable.
    }
  }, [palette, hasHydrated]);

  function activatePalette(nextPalette: ThemePalette): void {
    setPalette(nextPalette);
    setActiveTheme(nextPalette.mode === 'day' ? 'minimal-light' : 'opt-parent');
  }

  function randomizeTheme(): void {
    activatePalette(getRandomPalette(palette.id));
  }

  function setThemeMode(mode: ThemeMode): void {
    if (palette.mode === mode) return;
    activatePalette(getRandomPalette(palette.id, mode));
  }

  function resetTheme(): void {
    activatePalette(DEFAULT_PALETTE);
  }

  function setManualTheme(theme: ThemeSchemeId): void {
    setActiveTheme(theme);
    const nextPalette = getPaletteById(LEGACY_THEME_PALETTES[theme]);
    if (nextPalette) setPalette(nextPalette);
  }

  function handleBehaviorChange(mode: ThemeBehaviorMode): void {
    setBehaviorModeState(mode);
    if (mode === 'category-adaptive') {
      setManualTheme(DIVISION_TO_THEME[activeDivision]);
    }
  }

  function selectDivisionWithTheme(division: DivisionKey): void {
    setActiveDivision(division);
    if (behaviorMode === 'category-adaptive') {
      setManualTheme(DIVISION_TO_THEME[division]);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        behaviorMode,
        activeDivision,
        palette,
        randomizeTheme,
        setThemeMode,
        resetTheme,
        setManualTheme,
        setBehaviorMode: handleBehaviorChange,
        selectDivisionWithTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useOptTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useOptTheme must be used inside ThemeProvider');
  return context;
}

export { THEME_PALETTES };
export type { ThemeMode, ThemePalette };

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeSchemeId, ThemeBehaviorMode, DivisionKey, ThemeDefinition } from '@/types/theme.types';

export const AVAILABLE_THEMES: ThemeDefinition[] = [
  { id: 'opt-parent', name: 'O.P.T. Obsidian (Parent)', tagline: 'Signature Industrial Emerald', mappedDivision: 'ALL', previewHex: '#10b981' },
  { id: 'desk-cyan', name: 'O.P.T. // DESK Scheme', tagline: 'Deep Slate & Cyber Cyan', mappedDivision: 'DESK', previewHex: '#06b6d4' },
  { id: 'drive-amber', name: 'O.P.T. // DRIVE Scheme', tagline: 'Asphalt Carbon & Telemetry Amber', mappedDivision: 'DRIVE', previewHex: '#f59e0b' },
  { id: 'vault-gold', name: 'O.P.T. // VAULT Scheme', tagline: 'Festive Onyx & Royal Gold', mappedDivision: 'VAULT', previewHex: '#eab308' },
  { id: 'minimal-light', name: 'Daylight Studio', tagline: 'High-Contrast Alabaster', previewHex: '#059669' },
];

interface ThemeContextValue {
  activeTheme: ThemeSchemeId;
  behaviorMode: ThemeBehaviorMode;
  activeDivision: DivisionKey;
  setManualTheme: (theme: ThemeSchemeId) => void;
  setBehaviorMode: (mode: ThemeBehaviorMode) => void;
  selectDivisionWithTheme: (division: DivisionKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const DIVISION_TO_THEME: Record<DivisionKey, ThemeSchemeId> = {
  ALL: 'opt-parent',
  DESK: 'desk-cyan',
  DRIVE: 'drive-amber',
  VAULT: 'vault-gold',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeSchemeId>('opt-parent');
  const [behaviorMode, setBehaviorMode] = useState<ThemeBehaviorMode>('category-adaptive');
  const [activeDivision, setActiveDivision] = useState<DivisionKey>('ALL');

  // Sync active theme attribute to <html> root without re-rendering heavy trees
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  function setManualTheme(theme: ThemeSchemeId) {
    setActiveTheme(theme);
  }

  function handleBehaviorChange(mode: ThemeBehaviorMode) {
    setBehaviorMode(mode);
    if (mode === 'parent-locked') {
      setActiveTheme('opt-parent');
    } else {
      setActiveTheme(DIVISION_TO_THEME[activeDivision]);
    }
  }

  function selectDivisionWithTheme(division: DivisionKey) {
    setActiveDivision(division);
    if (behaviorMode === 'category-adaptive') {
      setActiveTheme(DIVISION_TO_THEME[division]);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        behaviorMode,
        activeDivision,
        setManualTheme,
        setBehaviorMode: handleBehaviorChange,
        selectDivisionWithTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useOptTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useOptTheme must be used inside ThemeProvider');
  return ctx;
}
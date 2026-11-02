export type ThemeMode = 'day' | 'night';
export type ThemeFinish = 'matte' | 'paper' | 'glass';

export interface ThemePalette {
  id: string;
  name: string;
  mode: ThemeMode;
  finish: ThemeFinish;
  surfaceName: string;
  accentName: string;
  canvas: string;
  matte: string;
  surface: string;
  elevated: string;
  text: string;
  muted: string;
  accent: string;
  accentForeground: string;
  secondaryAccent: string;
  border: string;
  glow: string;
}

interface SurfaceRecipe {
  id: string;
  name: string;
  canvas: string;
  matte: string;
  paper: string;
  elevated: string;
  borderDay: string;
  borderNight: string;
}

interface AccentRecipe {
  id: string;
  name: string;
  day: string;
  daySecondary: string;
  night: string;
  nightSecondary: string;
}

const SURFACES: Record<ThemeMode, SurfaceRecipe[]> = {
  day: [
    { id: 'porcelain', name: 'Porcelain', canvas: '#F3F0E9', matte: '#EAE6DE', paper: '#FBFAF6', elevated: '#FFFFFF', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(255,255,255,0.12)' },
    { id: 'linen', name: 'Linen', canvas: '#EEE8DE', matte: '#E4DCCF', paper: '#F8F4EC', elevated: '#FFFCF6', borderDay: 'rgba(68, 54, 38, 0.14)', borderNight: 'rgba(255,255,255,0.13)' },
    { id: 'mist', name: 'Mist', canvas: '#EDF0EC', matte: '#E1E7E0', paper: '#F8FAF6', elevated: '#FFFFFF', borderDay: 'rgba(38, 55, 46, 0.12)', borderNight: 'rgba(255,255,255,0.13)' },
    { id: 'shell', name: 'Shell', canvas: '#F2E9E5', matte: '#E8DCD7', paper: '#FBF5F1', elevated: '#FFFFFF', borderDay: 'rgba(72, 46, 44, 0.12)', borderNight: 'rgba(255,255,255,0.13)' },
    { id: 'fog', name: 'Fog', canvas: '#E9EEF1', matte: '#DDE5E9', paper: '#F5F8F9', elevated: '#FFFFFF', borderDay: 'rgba(35, 52, 65, 0.13)', borderNight: 'rgba(255,255,255,0.14)' },
    { id: 'dune', name: 'Dune', canvas: '#F0E9DA', matte: '#E6DCC8', paper: '#FAF5E9', elevated: '#FFFDF8', borderDay: 'rgba(70, 57, 36, 0.14)', borderNight: 'rgba(255,255,255,0.13)' },
    { id: 'sage', name: 'Sage', canvas: '#E8EEE5', matte: '#DCE5D8', paper: '#F4F8F0', elevated: '#FFFFFF', borderDay: 'rgba(42, 65, 45, 0.13)', borderNight: 'rgba(255,255,255,0.13)' },
    { id: 'cloud', name: 'Cloud', canvas: '#F0F0EE', matte: '#E4E5E2', paper: '#FAFAF8', elevated: '#FFFFFF', borderDay: 'rgba(42, 46, 43, 0.13)', borderNight: 'rgba(255,255,255,0.13)' },
  ],
  night: [
    { id: 'ink', name: 'Ink', canvas: '#0D1210', matte: '#141C18', paper: '#1B241F', elevated: '#202B25', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(230, 242, 235, 0.12)' },
    { id: 'pine', name: 'Pine', canvas: '#101914', matte: '#17231C', paper: '#202D25', elevated: '#26352C', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(210, 240, 220, 0.13)' },
    { id: 'slate', name: 'Slate', canvas: '#11171D', matte: '#1A232B', paper: '#222E37', elevated: '#2A3741', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(220, 235, 245, 0.13)' },
    { id: 'espresso', name: 'Espresso', canvas: '#18130F', matte: '#221A14', paper: '#2B211A', elevated: '#35281F', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(245, 224, 204, 0.13)' },
    { id: 'plum', name: 'Plum', canvas: '#17131B', matte: '#211A28', paper: '#2B2234', elevated: '#352A40', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(235, 218, 250, 0.14)' },
    { id: 'ocean', name: 'Ocean', canvas: '#0F181C', matte: '#162329', paper: '#1E3038', elevated: '#263B44', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(215, 240, 246, 0.13)' },
    { id: 'graphite', name: 'Graphite', canvas: '#151718', matte: '#1D2223', paper: '#282E2F', elevated: '#303839', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(230, 238, 238, 0.13)' },
    { id: 'olive', name: 'Olive', canvas: '#171A12', matte: '#222719', paper: '#2C3321', elevated: '#39412B', borderDay: 'rgba(35, 43, 38, 0.12)', borderNight: 'rgba(230, 239, 208, 0.13)' },
  ],
};

const ACCENTS: Record<ThemeMode, AccentRecipe[]> = {
  day: [
    { id: 'evergreen', name: 'Evergreen', day: '#245C4C', daySecondary: '#6C8F75', night: '#91D0AE', nightSecondary: '#B3C78A' },
    { id: 'cobalt', name: 'Cobalt', day: '#315D8A', daySecondary: '#7898B5', night: '#91B9E8', nightSecondary: '#A9C9D8' },
    { id: 'terracotta', name: 'Terracotta', day: '#96563D', daySecondary: '#C28B68', night: '#E4A17C', nightSecondary: '#E8C18E' },
    { id: 'mulberry', name: 'Mulberry', day: '#754A68', daySecondary: '#A7829B', night: '#C9A2C1', nightSecondary: '#E0B6B0' },
    { id: 'ochre', name: 'Ochre', day: '#80601F', daySecondary: '#B0924B', night: '#E1C477', nightSecondary: '#E8D69B' },
    { id: 'lagoon', name: 'Lagoon', day: '#286C6C', daySecondary: '#72A39B', night: '#83D0C5', nightSecondary: '#A6D8B3' },
    { id: 'rosewood', name: 'Rosewood', day: '#96505C', daySecondary: '#C28A8E', night: '#E2A1AF', nightSecondary: '#E8C0A7' },
    { id: 'moss', name: 'Moss', day: '#596B36', daySecondary: '#93A36C', night: '#C3D984', nightSecondary: '#D5D7A4' },
  ],
  night: [
    { id: 'evergreen', name: 'Evergreen', day: '#245C4C', daySecondary: '#6C8F75', night: '#91D0AE', nightSecondary: '#B3C78A' },
    { id: 'cobalt', name: 'Cobalt', day: '#315D8A', daySecondary: '#7898B5', night: '#91B9E8', nightSecondary: '#A9C9D8' },
    { id: 'terracotta', name: 'Terracotta', day: '#96563D', daySecondary: '#C28B68', night: '#E4A17C', nightSecondary: '#E8C18E' },
    { id: 'mulberry', name: 'Mulberry', day: '#754A68', daySecondary: '#A7829B', night: '#C9A2C1', nightSecondary: '#E0B6B0' },
    { id: 'ochre', name: 'Ochre', day: '#80601F', daySecondary: '#B0924B', night: '#E1C477', nightSecondary: '#E8D69B' },
    { id: 'lagoon', name: 'Lagoon', day: '#286C6C', daySecondary: '#72A39B', night: '#83D0C5', nightSecondary: '#A6D8B3' },
    { id: 'rosewood', name: 'Rosewood', day: '#96505C', daySecondary: '#C28A8E', night: '#E2A1AF', nightSecondary: '#E8C0A7' },
    { id: 'moss', name: 'Moss', day: '#596B36', daySecondary: '#93A36C', night: '#C3D984', nightSecondary: '#D5D7A4' },
  ],
};

const FINISHES: ThemeFinish[] = ['matte', 'paper', 'glass'];

function toRgba(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value;
  const number = Number.parseInt(full, 16);
  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function buildPalette(mode: ThemeMode, surface: SurfaceRecipe, accent: AccentRecipe, finish: ThemeFinish): ThemePalette {
  const isDay = mode === 'day';
  const foreground = isDay ? '#202720' : '#F1F3EF';
  const muted = isDay ? '#68736A' : '#A6B1A9';
  const accentColor = isDay ? accent.day : accent.night;
  const secondaryColor = isDay ? accent.daySecondary : accent.nightSecondary;
  const matte = surface.matte;
  const paper = surface.paper;
  const glass = isDay ? 'rgba(255, 255, 252, 0.78)' : 'rgba(255, 255, 255, 0.065)';
  const surfaceColor = finish === 'paper' ? paper : finish === 'glass' ? glass : matte;
  const elevated = finish === 'glass'
    ? (isDay ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.105)')
    : surface.elevated;
  return {
    id: `${mode}-${surface.id}-${accent.id}-${finish}`,
    name: `${accent.name} / ${surface.name}`,
    mode,
    finish,
    surfaceName: surface.name,
    accentName: accent.name,
    canvas: surface.canvas,
    matte,
    surface: surfaceColor,
    elevated,
    text: foreground,
    muted,
    accent: accentColor,
    accentForeground: isDay ? '#FFFFFF' : '#132018',
    secondaryAccent: secondaryColor,
    border: isDay ? surface.borderDay : surface.borderNight,
    glow: toRgba(accentColor, isDay ? 0.105 : 0.18),
  };
}

export const THEME_PALETTES: ThemePalette[] = (['day', 'night'] as const).flatMap((mode) =>
  SURFACES[mode].flatMap((surface) =>
    ACCENTS[mode].flatMap((accent) =>
      FINISHES.map((finish) => buildPalette(mode, surface, accent, finish))
    )
  )
);

export const DEFAULT_PALETTE_ID = 'night-ink-evergreen-matte';
export const DEFAULT_PALETTE = THEME_PALETTES.find((palette) => palette.id === DEFAULT_PALETTE_ID) ?? THEME_PALETTES[0];

export function getPaletteById(id: string): ThemePalette | undefined {
  return THEME_PALETTES.find((palette) => palette.id === id);
}

export function getRandomPalette(currentId?: string, mode?: ThemeMode): ThemePalette {
  const candidates = THEME_PALETTES.filter((palette) => palette.id !== currentId && (!mode || palette.mode === mode));
  const pool = candidates.length > 0 ? candidates : THEME_PALETTES;
  return pool[Math.floor(Math.random() * pool.length)];
}

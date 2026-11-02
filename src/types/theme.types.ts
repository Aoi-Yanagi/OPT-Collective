export type ThemeSchemeId = 'opt-parent' | 'desk-cyan' | 'drive-amber' | 'vault-gold' | 'minimal-light';

export type ThemeBehaviorMode = 'category-adaptive' | 'parent-locked';

export type DivisionKey = 'ALL' | 'DESK' | 'DRIVE' | 'VAULT';

export type DevicePlatform =
  | 'windows-desktop'
  | 'macos-desktop'
  | 'android-mobile'
  | 'ios-mobile'
  | 'android-desktop-override'
  | 'ios-desktop-override';

export interface ThemeDefinition {
  id: ThemeSchemeId;
  name: string;
  tagline: string;
  mappedDivision?: DivisionKey;
  previewHex: string;
}
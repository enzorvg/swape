/**
 * Swape "Modern Soft Tech" design tokens (docs/specs/cahier-des-charges.pdf, §6).
 * Single source of truth for web and mobile: never hard-code a color, radius or font.
 * Keep tokens.css in sync (a test checks it).
 */

export const colors = {
  primary: '#00BF63', // Vert Swape: main actions, Match, CTA, logo
  primarySoft: '#4CD98B', // Vert Doux
  primaryDeep: '#008C46', // Vert Profond
  background: '#F9F9F9', // Blanc Cassé
  surface: '#FFFFFF',
  text: '#1E1E1E', // Gris Anthracite
  textMuted: '#6B6B6B',
  border: '#E6E6E6',
  danger: '#E5484D', // Swipe left / refuse
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const fonts = {
  // Gliker is a licensed font: until its files are added, the fallback is used.
  display: 'Gliker',
  body: 'Poppins',
} as const;

export const shadows = {
  soft: '0 4px 20px rgba(30, 30, 30, 0.06)',
  card: '0 8px 30px rgba(30, 30, 30, 0.08)',
} as const;

export type ColorToken = keyof typeof colors;

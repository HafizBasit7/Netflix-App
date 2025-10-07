import { ThemeColors } from './types';

export const NetflixDarkTheme: ThemeColors = {
  primary: '#E50914',
  primaryDark: '#B2070F',
  background: '#141414',
  cardBackground: '#2F2F2F',
  text: '#FFFFFF',
  textSecondary: '#E5E5E5',
  textMuted: '#808080',
  success: '#5FAF5F',
  warning: '#FFA500',
  border: '#404040',
  overlay: 'rgba(0,0,0,0.7)',
  shadow: 'rgba(0,0,0,0.5)',
};

export const NetflixLightTheme: ThemeColors = {
  primary: '#E50914',
  primaryDark: '#B2070F',
  background: '#FFFFFF',
  cardBackground: '#F8F8F8',
  text: '#141414',
  textSecondary: '#2F2F2F',
  textMuted: '#666666',
  success: '#5FAF5F',
  warning: '#FFA500',
  border: '#E0E0E0',
  overlay: 'rgba(255,255,255,0.7)',
  shadow: 'rgba(0,0,0,0.1)',
};

export const NetflixFonts = {
  regular: 'Helvetica Neue',
  bold: 'Helvetica Neue Bold',
  light: 'Helvetica Neue Light',
};

export const NetflixMetrics = {
  padding: 16,
  margin: 16,
  borderRadius: 8,
  shadowRadius: 8,
};

// Hook for using theme in components
export { ThemeProvider, ThemeContext } from './ThemeProvider';
export type { ThemeColors } from './types';
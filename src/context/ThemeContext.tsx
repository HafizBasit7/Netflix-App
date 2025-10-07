import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  background: string;
  cardBackground: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  success: string;
  warning: string;
}

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
};

export const NetflixLightTheme: ThemeColors = {
  primary: '#E50914',
  primaryDark: '#B2070F',
  background: '#FFFFFF',
  cardBackground: '#F5F5F5',
  text: '#141414',
  textSecondary: '#2F2F2F',
  textMuted: '#666666',
  success: '#5FAF5F',
  warning: '#FFA500',
};

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  colors: NetflixDarkTheme,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? NetflixDarkTheme : NetflixLightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
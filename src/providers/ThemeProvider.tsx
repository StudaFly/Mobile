import React, { createContext, useContext } from 'react';
import { colors, spacing, typography, radii, shadows } from '@/design-system/tokens';

const theme = { colors, spacing, typography, radii, shadows };

type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

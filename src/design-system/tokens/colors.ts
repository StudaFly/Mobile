export const colors = {
  darkBlue: '#213458',
  blue: '#33518A',
  gold: '#CC9C40',
  goldLight: '#FFCB5C',
  bg: '#F9FAFB',
  bgB2B: '#F0F4FA',
  white: '#FFFFFF',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
} as const;

export type Color = keyof typeof colors;

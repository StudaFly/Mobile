import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { colors } from '@/design-system/tokens';
import { IconProps } from './Icon.types';

export function Icon({ name, size = 24, color = colors.darkBlue, ...props }: IconProps) {
  const LucideIcon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon size={size} color={color} {...props} />;
}

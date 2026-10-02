import React from 'react';
import { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  label: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  iconRight?: React.ComponentProps<typeof Icon>['name'];
}

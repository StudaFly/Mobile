import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing, radii } from '@/design-system/tokens';
import { ButtonProps } from './Button.types';

const variantStyles = {
  primary: {
    container: { backgroundColor: colors.gold },
    label: { color: colors.white },
  },
  secondary: {
    container: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.blue },
    label: { color: colors.blue },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.blue },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    label: { color: colors.white },
  },
};

export function Button({ variant = 'primary', label, isLoading, fullWidth, style, ...props }: ButtonProps) {
  const { container, label: labelStyle } = variantStyles[variant];

  return (
    <TouchableScale
      style={[styles.base, container, fullWidth && styles.fullWidth, style]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <Text variant="label" style={labelStyle}>
          {label}
        </Text>
      )}
    </TouchableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.md,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
});

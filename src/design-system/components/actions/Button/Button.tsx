import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Text } from '@/design-system/primitives/Text';
import { Icon } from '@/design-system/primitives/Icon';
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

export function Button({ variant = 'primary', label, isLoading, fullWidth, style, iconRight, ...props }: ButtonProps) {
  const { container, label: labelStyle } = variantStyles[variant];

  return (
    <TouchableScale
      style={[styles.base, container, fullWidth && styles.fullWidth, style]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <View style={styles.content}>
          <Text variant="label" style={labelStyle}>
            {label}
          </Text>
          {iconRight && <Icon name={iconRight} size={16} color={labelStyle.color} />}
        </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

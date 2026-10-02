import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing, radii } from '@/design-system/tokens';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps { variant?: BadgeVariant; label: string; }

const variantColors: Record<BadgeVariant, string> = {
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.blue,
  neutral: colors.bgB2B,
};

export function Badge({ variant = 'neutral', label }: BadgeProps) {
  return (
    <View style={[styles.container, { backgroundColor: variantColors[variant] }]}>
      <Text variant="caption" style={styles.label}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.full },
  label: { color: colors.white },
});

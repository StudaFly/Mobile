import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';

export function AlertBanner({ danger, warning }: { danger: number; warning: number }) {
  if (!danger && !warning) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Icon name="AlertTriangle" size={18} color={colors.darkBlue} />
      <Text variant="label" style={styles.text}>
        {danger} étudiant(s) critique(s) · {warning} en retard
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.goldLight,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  text: { color: colors.darkBlue, flex: 1 },
});

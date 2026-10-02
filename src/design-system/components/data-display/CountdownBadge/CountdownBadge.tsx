import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';

interface CountdownBadgeProps { days: number; }

export function CountdownBadge({ days }: CountdownBadgeProps) {
  return (
    <View style={styles.container}>
      <Text variant="label" style={styles.text}>J-{days}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: colors.gold, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.full },
  text: { color: colors.white },
});

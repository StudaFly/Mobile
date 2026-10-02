import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../../primitives/Text';
import { colors, radii, spacing } from '../../../tokens';

export type TagCategory = 'admin' | 'finance' | 'housing' | 'health' | 'practical';

const categoryColors: Record<TagCategory, string> = {
  admin: colors.blue,
  finance: colors.gold,
  housing: colors.success,
  health: colors.danger,
  practical: colors.warning,
};

interface TagProps { category: TagCategory; label: string; }

export function Tag({ category, label }: TagProps) {
  return (
    <View style={[styles.container, { backgroundColor: `${categoryColors[category]}20` }]}>
      <Text variant="caption" style={{ color: categoryColors[category] }}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radii.sm },
});

import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing, radii } from '@/design-system/tokens';
interface TabItemProps { label: string; isActive: boolean; onPress: () => void; }
export function TabItem({ label, isActive, onPress }: TabItemProps) {
  return (
    <TouchableScale onPress={onPress} style={[styles.item, isActive && styles.active]}>
      <Text variant="label" style={{ color: isActive ? colors.white : colors.blue }}>{label}</Text>
    </TouchableScale>
  );
}
const styles = StyleSheet.create({
  item: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radii.full, marginRight: spacing.xs },
  active: { backgroundColor: colors.blue },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';

export function ProgressChart({ rows }: { rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map(([, n]) => n));
  return (
    <View style={styles.list}>
      {rows.map(([label, n]) => (
        <View key={label} style={styles.row}>
          <Text variant="caption" style={styles.label} numberOfLines={1}>{label}</Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${(n / max) * 100}%` }]} /></View>
          <Text variant="label" style={styles.value}>{n}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { width: 110, color: '#374151' },
  track: { flex: 1, height: 10, backgroundColor: colors.bgB2B, borderRadius: radii.full, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.blue },
  value: { width: 28, textAlign: 'right', color: colors.darkBlue },
});

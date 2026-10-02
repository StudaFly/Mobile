import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/design-system/components/data-display/Card';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { CATEGORY_META } from '@/features/checklist/categoryMeta';
import type { MobilityProgress } from '@/features/mobility/types/mobility.types';
import type { TaskCategory } from '@/features/checklist/types/task.types';

interface GlobalProgressProps {
  items: MobilityProgress['byCategory'];
  completedCount: number;
  totalCount: number;
}

export function GlobalProgress({ items, completedCount, totalCount }: GlobalProgressProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.titleRow}>
        <Text variant="heading3" style={styles.title} accessibilityRole="header">📊 Avancement</Text>
        <Text variant="caption" style={styles.muted}>{completedCount}/{totalCount} tâches</Text>
      </View>
      {items.map(({ category, label, done, total }) => {
        const meta = CATEGORY_META[category as TaskCategory];
        const isDone = done === total;
        return (
          <View
            key={category}
            style={styles.row}
            accessible
            accessibilityLabel={`${label} : ${done} sur ${total}`}
          >
            <View style={styles.rowLabels}>
              <Text variant="body" style={styles.label}>{label}</Text>
              <Text variant="label" style={[styles.count, isDone && { color: colors.success }]}>
                {done}/{total}{isDone ? ' ✓' : ''}
              </Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(done / total) * 100}%`, backgroundColor: meta.color }]} />
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.darkBlue },
  muted: { color: '#6B7280' },
  row: { gap: spacing.xs },
  rowLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#4B5563' },
  count: { color: '#6B7280' },
  track: { height: 6, backgroundColor: '#E5E7EB', borderRadius: radii.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.full },
});

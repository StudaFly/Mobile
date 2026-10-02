import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { CATEGORY_META } from '@/features/checklist/categoryMeta';
import type { TimelineTask } from '@/features/timeline/types/timeline.types';

interface NextDeadlinesProps {
  tasks: TimelineTask[];
  onPressTask?: (task: TimelineTask) => void;
  onSeeAll?: () => void;
}

export function deadlineLabel(days: number): { text: string; color: string; bg: string } {
  if (days < 0) return { text: `En retard de ${-days} j`, color: colors.danger, bg: '#FEF2F2' };
  if (days === 0) return { text: "Aujourd'hui", color: colors.danger, bg: '#FEF2F2' };
  if (days <= 7) return { text: `Dans ${days} jour${days > 1 ? 's' : ''}`, color: colors.warning, bg: '#FFFBEB' };
  return { text: `Dans ${days} jours`, color: colors.blue, bg: '#EEF2FF' };
}

export function NextDeadlines({ tasks, onPressTask, onSeeAll }: NextDeadlinesProps) {
  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text variant="heading3" style={styles.title} accessibilityRole="header">⚡ À faire en priorité</Text>
        {onSeeAll ? (
          <TouchableOpacity onPress={onSeeAll} accessibilityRole="button" hitSlop={12}>
            <Text variant="label" style={styles.seeAll}>Tout voir</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {tasks.length === 0 ? (
        <View style={styles.card}>
          <Text variant="body" style={styles.empty}>Aucune échéance à venir. Bravo ! 🎉</Text>
        </View>
      ) : (
        tasks.map((task) => {
          const meta = CATEGORY_META[task.category];
          const badge = deadlineLabel(task.daysUntilDeadline ?? 0);
          return (
            <TouchableOpacity
              key={task.id}
              style={styles.card}
              onPress={() => onPressTask?.(task)}
              accessibilityRole="button"
              accessibilityLabel={`${task.title}, ${badge.text}`}
            >
              <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
                <Icon name={meta.iconName} size={20} color={meta.color} />
              </View>
              <View style={styles.content}>
                <Text variant="bodyMedium" style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Icon name="Clock" size={12} color={badge.color} />
                  <Text variant="caption" style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                </View>
              </View>
              <Icon name="ChevronRight" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.darkBlue },
  seeAll: { color: colors.blue },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 64,
    ...shadows.sm,
  },
  iconBox: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: spacing.xs },
  taskTitle: { color: colors.darkBlue },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontWeight: '600' },
  empty: { color: '#6B7280', flex: 1, textAlign: 'center' },
});

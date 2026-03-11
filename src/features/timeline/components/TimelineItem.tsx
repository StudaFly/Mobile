import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import type { TimelineTask } from '../types/timeline.types';
import type { TaskCategory } from '@/features/checklist';

const CATEGORY_META: Record<
  TaskCategory,
  { label: string; iconName: string; color: string; bg: string }
> = {
  admin: { label: 'Admin', iconName: 'FileText', color: colors.blue, bg: '#EEF2FF' },
  finance: { label: 'Finance', iconName: 'CreditCard', color: colors.gold, bg: '#FFFBEB' },
  health: { label: 'Santé', iconName: 'Heart', color: colors.danger, bg: '#FEF2F2' },
  housing: { label: 'Logement', iconName: 'Home', color: colors.success, bg: '#F0FDF4' },
  practical: { label: 'Pratique', iconName: 'Smartphone', color: colors.warning, bg: '#FFFBEB' },
};

function formatDeadline(dateString: string): string {
  const date = new Date(dateString);
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function getDaysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

interface TimelineItemProps {
  task: TimelineTask;
  isFirst: boolean;
  isLast: boolean;
  onComplete: (id: string) => void;
}

export function TimelineItem({ task, isFirst, isLast, onComplete }: TimelineItemProps) {
  const meta = CATEGORY_META[task.category];
  const isUrgent = !task.isCompleted && task.priority === 1;
  const isOverdue = task.deadline ? getDaysUntil(task.deadline) < 0 : false;

  return (
    <View style={styles.wrapper}>
      {/* Timeline connector column */}
      <View style={styles.connectorCol}>
        <View style={[styles.lineTop, isFirst && styles.lineHidden]} />
        <TouchableOpacity
          onPress={() => !task.isCompleted && onComplete(task.id)}
          activeOpacity={0.8}
          style={[
            styles.circle,
            { backgroundColor: task.isCompleted ? meta.color : colors.white },
            { borderColor: meta.color },
            task.isCompleted && styles.circleCompleted,
          ]}
        >
          <Icon
            name={task.isCompleted ? 'Check' : meta.iconName}
            size={16}
            color={task.isCompleted ? colors.white : meta.color}
          />
        </TouchableOpacity>
        <View style={[styles.lineBottom, isLast && styles.lineHidden]} />
      </View>

      {/* Task card */}
      <View style={[styles.card, task.isCompleted && styles.cardDone]}>
        {/* Category tag + urgent badge */}
        <View style={styles.cardHeader}>
          <View style={[styles.categoryTag, { backgroundColor: meta.bg }]}>
            <Text variant="caption" style={[styles.categoryLabel, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>
          {isUrgent && (
            <View style={[styles.urgentBadge, isOverdue && styles.overdueBadge]}>
              <Text variant="caption" style={styles.urgentText}>
                {isOverdue ? 'En retard' : 'URGENT'}
              </Text>
            </View>
          )}
          {task.isCompleted && (
            <View style={styles.completedBadge}>
              <Text variant="caption" style={styles.completedText}>✓ Fait</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          variant="bodyMedium"
          style={[styles.title, task.isCompleted && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {/* Description */}
        {task.description && (
          <Text variant="caption" style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Deadline */}
        {task.deadline && (
          <View style={styles.deadlineRow}>
            <Icon name="Clock" size={12} color={isOverdue ? colors.danger : '#9CA3AF'} />
            <Text
              variant="caption"
              style={[styles.deadlineText, isOverdue && styles.deadlineOverdue]}
            >
              {formatDeadline(task.deadline)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const CIRCLE_SIZE = 36;
const LINE_WIDTH = 2;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  connectorCol: {
    width: CIRCLE_SIZE + spacing.md,
    alignItems: 'center',
  },
  lineTop: {
    width: LINE_WIDTH,
    flex: 1,
    backgroundColor: '#D1D5DB',
    minHeight: spacing.sm,
  },
  lineBottom: {
    width: LINE_WIDTH,
    flex: 1,
    backgroundColor: '#D1D5DB',
    minHeight: spacing.sm,
  },
  lineHidden: {
    backgroundColor: 'transparent',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  circleCompleted: {
    borderWidth: 0,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: spacing.md,
    marginLeft: spacing.sm,
    gap: 6,
    ...shadows.sm,
  },
  cardDone: {
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  urgentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    backgroundColor: '#FEF2F2',
  },
  overdueBadge: {
    backgroundColor: '#FEF2F2',
  },
  urgentText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    backgroundColor: '#F0FDF4',
  },
  completedText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: '#1F2937',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    color: '#6B7280',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    color: '#9CA3AF',
  },
  deadlineOverdue: {
    color: colors.danger,
  },
});

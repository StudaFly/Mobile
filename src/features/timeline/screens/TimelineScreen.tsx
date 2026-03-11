import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar';
import { Skeleton } from '@/design-system/components/feedback/Skeleton';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { useTimeline } from '../hooks/useTimeline';
import { CategoryFilter } from '../components/CategoryFilter';
import { TimelineItem } from '../components/TimelineItem';
import { TimelineSection } from '../components/TimelineSection';
import type { TimelineFilter } from '../types/timeline.types';

export function TimelineScreen() {
  const [activeFilter, setActiveFilter] = useState<TimelineFilter>('all');

  const {
    groups,
    completedCount,
    totalCount,
    progress,
    urgentTasks,
    daysUntilDeparture,
    isLoading,
  } = useTimeline(activeFilter);

  const handleComplete = () => {
    // TODO: wire to mutation when backend is ready
  };

  if (isLoading && totalCount === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.skeletonWrapper}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} style={styles.skeletonItem} />
          ))}
        </View>
      </ScreenWrapper>
    );
  }

  const allTasks = groups.flatMap((g) => g.tasks);

  return (
    <ScreenWrapper style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerInfo}>
            <Text variant="heading2" style={styles.headerTitle}>Ta Timeline</Text>
            <View style={styles.destinationRow}>
              <Icon name="MapPin" size={14} color="rgba(255,255,255,0.7)" />
              <Text variant="caption" style={styles.destinationText}>
                Barcelone · Erasmus
              </Text>
            </View>
          </View>
          <View style={styles.countdownBadge}>
            <Text variant="label" style={styles.countdownLabel}>J-</Text>
            <Text style={styles.countdownNumber}>{daysUntilDeparture}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text variant="caption" style={styles.progressText}>
              {completedCount}/{totalCount} tâches complétées
            </Text>
            <Text variant="caption" style={styles.progressPercent}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarWrapper}>
            <ProgressBar progress={progress * 100} />
          </View>
        </View>

        {/* Urgent alert banner */}
        {urgentTasks.length > 0 && (
          <View style={styles.urgentBanner}>
            <Icon name="AlertTriangle" size={16} color={colors.warning} />
            <Text variant="caption" style={styles.urgentBannerText}>
              {urgentTasks.length === 1
                ? '1 tâche urgente à traiter'
                : `${urgentTasks.length} tâches urgentes à traiter`}
            </Text>
          </View>
        )}
      </View>

      {/* Category filters */}
      <CategoryFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Timeline list */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Icon name="CheckCircle" size={48} color="#D1D5DB" />
            <Text variant="body" style={styles.emptyText}>Aucune tâche dans cette catégorie</Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.monthKey}>
              <TimelineSection label={group.monthLabel} />
              {group.tasks.map((task) => {
                const globalIndex = allTasks.findIndex((t) => t.id === task.id);
                return (
                  <TimelineItem
                    key={task.id}
                    task={task}
                    isFirst={globalIndex === 0}
                    isLast={globalIndex === allTasks.length - 1}
                    onComplete={handleComplete}
                  />
                );
              })}
            </View>
          ))
        )}
        <View style={styles.bottomPad} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.darkBlue,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerInfo: {
    gap: 4,
    flex: 1,
  },
  headerTitle: {
    color: colors.white,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  destinationText: {
    color: 'rgba(255,255,255,0.7)',
  },
  countdownBadge: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    minWidth: 64,
  },
  countdownLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  countdownNumber: {
    color: colors.white,
    fontSize: 22,
    fontFamily: 'DMSans_700Bold',
    lineHeight: 26,
  },
  progressSection: {
    gap: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: 'rgba(255,255,255,0.7)',
  },
  progressPercent: {
    color: colors.goldLight,
    fontFamily: 'DMSans_600SemiBold',
  },
  progressBarWrapper: {
    // ProgressBar has its own styling
  },
  urgentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.4)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  urgentBannerText: {
    color: colors.goldLight,
    flex: 1,
  },
  list: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },
  emptyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  skeletonWrapper: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  skeletonItem: {
    height: 88,
    borderRadius: 12,
  },
  bottomPad: {
    height: 32,
  },
});

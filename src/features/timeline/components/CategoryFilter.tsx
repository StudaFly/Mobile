import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import type { TimelineFilter } from '../types/timeline.types';
import { useReference } from '@/core/reference';

interface CategoryFilterProps {
  activeFilter: TimelineFilter;
  onFilterChange: (filter: TimelineFilter) => void;
}

export function CategoryFilter({ activeFilter, onFilterChange }: CategoryFilterProps) {
  const { taskCategories } = useReference();
  const FILTERS: { id: TimelineFilter; label: string }[] = [
    { id: 'all', label: 'Toutes' },
    ...taskCategories.map((c) => ({ id: c.key as TimelineFilter, label: c.label })),
  ];
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              onPress={() => onFilterChange(f.id)}
              activeOpacity={0.7}
              style={[styles.pill, isActive && styles.pillActive]}
            >
              <Text
                variant="label"
                style={[styles.pillLabel, isActive && styles.pillLabelActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
  },
  pillActive: {
    backgroundColor: colors.darkBlue,
  },
  pillLabel: {
    color: '#6B7280',
  },
  pillLabelActive: {
    color: colors.white,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import type { TimelineFilter } from '../types/timeline.types';

const FILTERS: { id: TimelineFilter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'admin', label: 'Admin' },
  { id: 'finance', label: 'Finance' },
  { id: 'health', label: 'Santé' },
  { id: 'housing', label: 'Logement' },
  { id: 'practical', label: 'Pratique' },
];

interface CategoryFilterProps {
  activeFilter: TimelineFilter;
  onFilterChange: (filter: TimelineFilter) => void;
}

export function CategoryFilter({ activeFilter, onFilterChange }: CategoryFilterProps) {
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

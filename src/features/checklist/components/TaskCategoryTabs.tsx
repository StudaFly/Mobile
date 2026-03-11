import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { TaskCategory } from '../types/task.types';

export type ChecklistTab = TaskCategory | 'all';

const TABS: { id: ChecklistTab; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'admin', label: 'Admin' },
  { id: 'finance', label: 'Finance' },
  { id: 'housing', label: 'Logement' },
  { id: 'health', label: 'Santé' },
  { id: 'practical', label: 'Pratique' },
];

interface TaskCategoryTabsProps {
  activeTab: ChecklistTab;
  onTabChange: (tab: ChecklistTab) => void;
  taskCounts: Record<ChecklistTab, number>;
}

export function TaskCategoryTabs({
  activeTab,
  onTabChange,
  taskCounts,
}: TaskCategoryTabsProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text
                variant="label"
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.badge,
                  isActive ? styles.badgeActive : styles.badgeInactive,
                ]}
              >
                <Text
                  variant="caption"
                  style={[
                    styles.badgeText,
                    isActive && styles.badgeTextActive,
                  ]}
                >
                  {taskCounts[tab.id]}
                </Text>
              </View>
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
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
  },
  tabActive: {
    backgroundColor: colors.darkBlue,
  },
  tabLabel: {
    color: '#6B7280',
  },
  tabLabelActive: {
    color: colors.white,
  },
  badge: {
    borderRadius: radii.full,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badgeInactive: {
    backgroundColor: '#E5E7EB',
  },
  badgeText: {
    color: '#6B7280',
    fontSize: 11,
  },
  badgeTextActive: {
    color: colors.white,
  },
});

import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { Skeleton } from '@/design-system/components/feedback/Skeleton';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { useReference } from '@/core/reference';
import { splitName } from '@/features/profile/hooks/useProfile';
import type { B2CNavigationProp } from '@/navigation/types';
import { useDashboard } from '../hooks/useDashboard';
import { WelcomeHeader } from '../components/WelcomeHeader';
import { NextDeadlines } from '../components/NextDeadlines';
import { GlobalProgress } from '../components/GlobalProgress';

const QUICK_ACCESS = [
  { key: 'Timeline', label: 'Timeline', iconName: 'Clock', bg: '#EEF2FF' },
  { key: 'Documents', label: 'Documents', iconName: 'FolderOpen', bg: '#F5F3FF' },
  { key: 'Guide', label: 'Guide', iconName: 'Map', bg: '#ECFDF5' },
  { key: 'JourJ', label: 'Jour J', iconName: 'Rocket', bg: '#FFFBEB' },
] as const;

export function DashboardScreen() {
  const navigation = useNavigation<B2CNavigationProp>();
  const {
    user,
    mobility,
    destination,
    mobilityId,
    daysUntilDeparture,
    completedCount,
    totalCount,
    percent,
    nextTasks,
    categoryProgress,
    isLoading,
    refetch,
    isRefetching,
  } = useDashboard();

  const { mobilityTypeLabel } = useReference();
  const firstName = user ? splitName(user.name).firstName : '';

  if (!mobilityId) {
    return (
      <ScreenWrapper style={styles.screen}>
        <EmptyState
          title={firstName ? `Bienvenue ${firstName} !` : 'Bienvenue !'}
          message="Configure ta mobilité pour générer ton parcours de préparation."
          ctaLabel="Créer ma mobilité"
          onCta={() => navigation.navigate('CreateMobility')}
        />
      </ScreenWrapper>
    );
  }

  if (isLoading && totalCount === 0) {
    return (
      <ScreenWrapper style={styles.screen}>
        <View style={styles.skeletons}>
          <Skeleton style={styles.skeletonHeader} />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} style={styles.skeletonItem} />
          ))}
        </View>
      </ScreenWrapper>
    );
  }

  const subtitle = [destination?.city, mobility ? mobilityTypeLabel(mobility.type) : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <WelcomeHeader
          firstName={firstName}
          avatarEmoji={user?.avatarEmoji}
          subtitle={subtitle}
          daysUntilDeparture={daysUntilDeparture}
          percent={percent}
          completedCount={completedCount}
          totalCount={totalCount}
          onSeeAll={() => navigation.navigate('Checklist')}
          onAvatarPress={() => navigation.navigate('Profile')}
        />

        <View style={styles.body}>
          <NextDeadlines
            tasks={nextTasks}
            onPressTask={() => navigation.navigate('Checklist')}
            onSeeAll={() => navigation.navigate('Timeline')}
          />

          {categoryProgress.length > 0 && (
            <GlobalProgress items={categoryProgress} completedCount={completedCount} totalCount={totalCount} />
          )}

          <View style={styles.quickSection}>
            <Text variant="heading3" style={styles.sectionTitle} accessibilityRole="header">🔗 Accès rapides</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACCESS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.quickItem}
                  onPress={() => navigation.navigate(item.key)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View style={[styles.quickIcon, { backgroundColor: item.bg }]}>
                    <Icon name={item.iconName} size={20} color={colors.darkBlue} />
                  </View>
                  <Text variant="bodyMedium" style={styles.quickLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bg },
  body: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { color: colors.darkBlue, textAlign: 'center' },
  quickSection: { gap: spacing.sm },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  quickItem: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 64,
    ...shadows.sm,
  },
  quickIcon: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { color: colors.darkBlue },
  skeletons: { padding: spacing.md, gap: spacing.sm },
  skeletonHeader: { height: 180, borderRadius: radii.lg },
  skeletonItem: { height: 72, borderRadius: radii.lg },
});

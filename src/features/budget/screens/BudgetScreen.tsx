import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { Skeleton } from '@/design-system/components/feedback/Skeleton';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import type { B2CNavigationProp } from '@/navigation/types';
import { useBudget } from '../hooks/useBudget';
import { BUDGET_CATEGORY_STYLE, BudgetCategoryRow, formatAmount } from '../components/BudgetCategoryRow';

export function BudgetScreen() {
  const navigation = useNavigation<B2CNavigationProp>();
  const { data: budget, mobility, isLoading, isError, error, refetch, isRefetching } = useBudget();

  if (!isLoading && !mobility) {
    return (
      <ScreenWrapper style={styles.screen}>
        <EmptyState
          title="Aucune mobilité configurée"
          message="Configure ta mobilité pour estimer ton budget sur place."
          ctaLabel="Créer ma mobilité"
          onCta={() => navigation.navigate('CreateMobility')}
        />
      </ScreenWrapper>
    );
  }

  if (isLoading) {
    return (
      <ScreenWrapper style={styles.screen}>
        <View style={styles.skeletons}>
          <Skeleton style={styles.skeletonHeader} />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} style={styles.skeletonItem} />
          ))}
        </View>
      </ScreenWrapper>
    );
  }

  if (isError || !budget) {
    return (
      <ScreenWrapper style={styles.screen}>
        <EmptyState
          title="Budget indisponible"
          message={getApiErrorMessage(error, "Pas encore d'estimation pour cette destination.")}
          ctaLabel="Réessayer"
          onCta={() => void refetch()}
        />
      </ScreenWrapper>
    );
  }

  const scaleMax = Math.max(...budget.breakdown.map((c) => c.amountMax), 0);
  const totalMax = budget.breakdown.reduce((sum, c) => sum + c.amountMax, 0);
  const months = mobility?.stayMonths ?? null;

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <View style={styles.header}>
          <Text variant="heading2" style={styles.headerTitle} accessibilityRole="header">Simulateur Budget</Text>
          <Text variant="caption" style={styles.headerSubtitle}>
            {budget.city} · données de référence
          </Text>
          <Text variant="body" style={styles.headerCaption}>Budget mensuel estimé</Text>
          <Text style={styles.total}>
            {formatAmount(budget.monthlyTotalMin, budget.monthlyTotalMax, budget.currency)}
          </Text>
          {months ? (
            <Text variant="caption" style={styles.headerSubtitle}>
              soit {formatAmount(budget.monthlyTotalMin * months, budget.monthlyTotalMax * months, budget.currency)} sur {months} mois
            </Text>
          ) : null}
        </View>

        <View style={styles.distribution}>
          <Text variant="bodyMedium" style={styles.sectionTitle} accessibilityRole="header">Répartition</Text>
          <View style={styles.stackedBar}>
            {budget.breakdown.map((c) => (
              <View
                key={c.key}
                style={{ flex: totalMax > 0 ? c.amountMax / totalMax : 1, backgroundColor: BUDGET_CATEGORY_STYLE[c.key]?.color ?? colors.blue }}
              />
            ))}
          </View>
          <View style={styles.legend}>
            {budget.breakdown.map((c) => (
              <View key={c.key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: BUDGET_CATEGORY_STYLE[c.key]?.color ?? colors.blue }]} />
                <Text variant="caption" style={styles.legendText}>{c.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.list}>
          {budget.breakdown.map((category) => (
            <BudgetCategoryRow key={category.key} category={category} scaleMax={scaleMax} />
          ))}
          {budget.tips.map((tip) => (
            <View key={tip} style={styles.tip}>
              <Text variant="body" style={styles.tipText}>💡 {tip}</Text>
            </View>
          ))}
          <Text variant="caption" style={styles.disclaimer}>
            Estimation indicative pour un étudiant (colocation ou studio), hors frais de départ.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.darkBlue,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  headerTitle: { color: colors.white },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)' },
  headerCaption: { color: 'rgba(255,255,255,0.8)', marginTop: spacing.md },
  total: { color: colors.goldLight, fontSize: 34, lineHeight: 42, fontWeight: '700', textAlign: 'center' },
  distribution: {
    backgroundColor: colors.white,
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: { color: colors.darkBlue, textAlign: 'center' },
  stackedBar: { flexDirection: 'row', height: 10, borderRadius: radii.full, overflow: 'hidden', gap: 3 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: radii.full },
  legendText: { color: '#4B5563' },
  list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  tip: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  tipText: { color: '#4B5563' },
  disclaimer: { color: '#6B7280', textAlign: 'center', marginTop: spacing.sm },
  skeletons: { padding: spacing.md, gap: spacing.sm },
  skeletonHeader: { height: 180, borderRadius: radii.lg },
  skeletonItem: { height: 76, borderRadius: radii.lg },
});

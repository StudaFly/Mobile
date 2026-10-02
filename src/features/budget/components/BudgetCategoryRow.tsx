import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import type { BudgetCategory, BudgetCategoryKey } from '../types/budget.types';

export const BUDGET_CATEGORY_STYLE: Record<BudgetCategoryKey, { iconName: string; color: string; bg: string }> = {
  housing: { iconName: 'Home', color: '#3B82F6', bg: '#EFF6FF' },
  food: { iconName: 'UtensilsCrossed', color: '#22C55E', bg: '#F0FDF4' },
  transport: { iconName: 'TrainFront', color: '#F59E0B', bg: '#FFFBEB' },
  leisure: { iconName: 'PartyPopper', color: '#EC4899', bg: '#FDF2F8' },
};

export function formatAmount(min: number, max: number, currency = 'EUR'): string {
  const fmt = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
}

interface BudgetCategoryRowProps {
  category: BudgetCategory;
  /** Largest amount among the categories, to scale the bar. */
  scaleMax: number;
}

export function BudgetCategoryRow({ category, scaleMax }: BudgetCategoryRowProps) {
  const style = BUDGET_CATEGORY_STYLE[category.key] ?? { iconName: 'Wallet', color: colors.blue, bg: '#EEF2FF' };
  const amount = formatAmount(category.amountMin, category.amountMax, category.currency);
  const width = scaleMax > 0 ? (category.amountMax / scaleMax) * 100 : 0;

  return (
    <View style={styles.card} accessible accessibilityLabel={`${category.label} : ${amount} par mois`}>
      <View style={[styles.iconBox, { backgroundColor: style.bg }]}>
        <Icon name={style.iconName} size={20} color={style.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.labels}>
          <Text variant="bodyMedium" style={styles.label}>{category.label}</Text>
          <Text variant="bodyMedium" style={styles.amount}>{amount}</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${width}%`, backgroundColor: style.color }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  iconBox: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: spacing.sm },
  labels: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  label: { color: colors.darkBlue, flexShrink: 1 },
  amount: { color: colors.darkBlue, fontWeight: '700' },
  track: { height: 6, backgroundColor: '#E5E7EB', borderRadius: radii.full, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radii.full },
});

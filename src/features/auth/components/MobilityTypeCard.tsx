import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Text } from '@/design-system/primitives/Text';
import { Icon } from '@/design-system/primitives/Icon';
import { colors, radii, spacing } from '@/design-system/tokens';
import { MobilityTypeOption } from '../types/auth.types';

interface MobilityTypeCardProps {
  value: MobilityTypeOption;
  label: string;
  iconName: React.ComponentProps<typeof Icon>['name'];
  selected: boolean;
  onSelect: (value: MobilityTypeOption) => void;
}

export function MobilityTypeCard({ value, label, iconName, selected, onSelect }: MobilityTypeCardProps) {
  return (
    <TouchableScale
      onPress={() => onSelect(value)}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <Icon name={iconName} size={28} color={selected ? colors.gold : colors.white} />
      <Text variant="label" style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
      {selected && <View style={styles.checkDot} />}
    </TouchableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.08)',
    minHeight: 96,
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(204,156,64,0.12)',
  },
  label: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
  },
  labelSelected: {
    color: colors.gold,
  },
  checkDot: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.gold,
  },
});

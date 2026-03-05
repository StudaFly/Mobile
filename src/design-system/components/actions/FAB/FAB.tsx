import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableScale } from '@/design-system/primitives/TouchableScale';
import { Icon } from '@/design-system/primitives/Icon';
import { colors, shadows, radii } from '@/design-system/tokens';

interface FABProps {
  onPress: () => void;
  iconName?: string;
}

export function FAB({ onPress, iconName = 'Plus' }: FABProps) {
  return (
    <TouchableScale style={styles.container} onPress={onPress}>
      <Icon name={iconName} size={24} color={colors.white} />
    </TouchableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});

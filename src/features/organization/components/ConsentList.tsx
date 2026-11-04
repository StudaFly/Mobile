import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { SHARED_DATA_LABELS } from '../labels';

interface ConsentListProps {
  schoolName: string;
  shared: string[];
  neverShared: string[];
}

export function ConsentList({ schoolName, shared, neverShared }: ConsentListProps) {
  return (
    <View style={styles.box}>
      <Text variant="label" style={styles.title}>{schoolName} pourra voir :</Text>
      {shared.map((key) => (
        <View key={key} style={styles.row}>
          <Icon name="Check" size={16} color={colors.success} />
          <Text variant="caption" style={styles.text}>{SHARED_DATA_LABELS[key] ?? key}</Text>
        </View>
      ))}
      <Text variant="label" style={[styles.title, styles.spaced]}>{schoolName} ne verra jamais :</Text>
      {neverShared.map((key) => (
        <View key={key} style={styles.row}>
          <Icon name="EyeOff" size={16} color={colors.danger} />
          <Text variant="caption" style={styles.text}>{SHARED_DATA_LABELS[key] ?? key}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.bgB2B, borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  title: { color: colors.darkBlue },
  spaced: { marginTop: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  text: { flex: 1, color: '#374151' },
});

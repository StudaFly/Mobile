import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';

interface TimelineSectionProps {
  label: string;
}

export function TimelineSection({ label }: TimelineSectionProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.line} />
      <View style={styles.labelWrapper}>
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  labelWrapper: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  label: {
    color: colors.blue,
    fontSize: 12,
  },
});

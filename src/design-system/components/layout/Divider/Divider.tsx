import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/design-system/tokens';
export function Divider() {
  return <View style={styles.divider} />;
}
const styles = StyleSheet.create({ divider: { height: 1, backgroundColor: colors.bgB2B, marginVertical: spacing.sm } });

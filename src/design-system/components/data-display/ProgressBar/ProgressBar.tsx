import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii } from '@/design-system/tokens';

interface ProgressBarProps { progress: number; }

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, progress))}%` }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  track: { height: 8, backgroundColor: colors.bgB2B, borderRadius: radii.full, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.gold, borderRadius: radii.full },
});

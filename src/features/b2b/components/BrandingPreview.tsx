import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';

export function BrandingPreview({ name, color }: { name: string; color: string }) {
  return (
    <View style={[styles.preview, { backgroundColor: /^#[0-9a-fA-F]{6}$/.test(color) ? color : colors.blue }]}>
      <Text variant="bodyMedium" style={styles.text}>Accompagné·e par {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { borderRadius: radii.md, padding: spacing.md },
  text: { color: colors.white },
});

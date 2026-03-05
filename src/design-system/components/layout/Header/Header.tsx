import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { IconButton } from '@/design-system/components/actions/IconButton';
import { colors, spacing } from '@/design-system/tokens';
import { HeaderProps } from './Header.types';
export function Header({ title, onBack, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBack && <IconButton iconName="ArrowLeft" onPress={onBack} />}
      <Text variant="heading3" style={styles.title}>{title}</Text>
      {rightAction ? rightAction : <View style={styles.placeholder} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.white },
  title: { flex: 1, textAlign: 'center' },
  placeholder: { width: 40 },
});

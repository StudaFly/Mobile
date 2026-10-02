import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from '@/design-system/components/actions/IconButton';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';

interface ComingSoonProps {
  title: string;
  message: string;
  onBack?: () => void;
}

export function ComingSoon({ title, message, onBack }: ComingSoonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {onBack ? (
          <IconButton iconName="ArrowLeft" onPress={onBack} accessibilityLabel="Retour" accessibilityRole="button" />
        ) : null}
        <Text variant="heading3" style={styles.title} accessibilityRole="header">{title}</Text>
      </View>
      <EmptyState title="Bientôt disponible 🚧" message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
  },
  title: { color: colors.darkBlue },
});

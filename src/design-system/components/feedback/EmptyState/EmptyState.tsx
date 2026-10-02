import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { Button } from '@/design-system/components/actions/Button';
import { colors, spacing } from '@/design-system/tokens';

interface EmptyStateProps {
  title: string;
  message?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ title, message, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text variant="heading3" style={styles.title}>{title}</Text>
      {message && (
        <Text variant="body" style={styles.message}>{message}</Text>
      )}
      {ctaLabel && onCta && (
        <View style={styles.ctaWrapper}>
          <Button label={ctaLabel} onPress={onCta} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    color: colors.darkBlue,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaWrapper: {
    width: '100%',
  },
});

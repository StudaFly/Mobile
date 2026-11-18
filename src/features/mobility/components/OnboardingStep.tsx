import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function OnboardingStep({ title, subtitle, children }: OnboardingStepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="heading2" style={styles.title}>{title}</Text>
        {subtitle && (
          <Text variant="body" style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.white,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    flex: 1,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import type { GuideSection } from '../types/guide.types';

const SECTION_ICONS: Record<string, string> = {
  overview: 'Info',
  housing: 'Home',
  transport: 'TrainFront',
  health: 'HeartPulse',
  culture: 'Palette',
};

interface GuideSectionCardProps {
  section: GuideSection;
}

export function GuideSectionCard({ section }: GuideSectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Icon name={SECTION_ICONS[section.key] ?? 'BookOpen'} size={20} color={colors.blue} />
      </View>
      <View style={styles.content}>
        <Text variant="bodyMedium" style={styles.title} accessibilityRole="header">{section.title}</Text>
        <Text variant="body" style={styles.text}>{section.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, gap: spacing.xs },
  title: { color: colors.darkBlue, fontWeight: '700' },
  text: { color: '#4B5563' },
});

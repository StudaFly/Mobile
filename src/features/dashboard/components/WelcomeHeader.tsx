import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';

interface WelcomeHeaderProps {
  firstName: string;
  avatarEmoji?: string | null;
  subtitle?: string;
  daysUntilDeparture: number | null;
  percent: number;
  completedCount: number;
  totalCount: number;
  onSeeAll?: () => void;
  onAvatarPress?: () => void;
}

function countdownLabel(days: number | null): { value: string; unit: string; caption: string } {
  if (days === null) return { value: '–', unit: '', caption: 'Départ dans' };
  if (days > 0) return { value: String(days), unit: days > 1 ? 'jours' : 'jour', caption: 'Départ dans' };
  if (days === 0) return { value: 'Jour J', unit: '', caption: "C'est aujourd'hui" };
  return { value: String(-days), unit: -days > 1 ? 'jours' : 'jour', caption: 'Sur place depuis' };
}

export function WelcomeHeader({
  firstName,
  avatarEmoji,
  subtitle,
  daysUntilDeparture,
  percent,
  completedCount,
  totalCount,
  onSeeAll,
  onAvatarPress,
}: WelcomeHeaderProps) {
  const countdown = countdownLabel(daysUntilDeparture);

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View style={styles.greeting}>
          <Text variant="body" style={styles.hello}>Bonjour 👋</Text>
          <Text variant="heading2" style={styles.name} accessibilityRole="header">
            {firstName ? `${firstName} !` : 'Bienvenue !'}
          </Text>
          {subtitle ? <Text variant="caption" style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={onAvatarPress}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir mon profil"
        >
          <Text style={styles.avatarEmoji}>{avatarEmoji || '🎓'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View>
            <Text variant="caption" style={styles.cardCaption}>{countdown.caption}</Text>
            <View style={styles.countdownRow}>
              <Text style={styles.countdownValue}>{countdown.value}</Text>
              {countdown.unit ? <Text variant="body" style={styles.countdownUnit}>{countdown.unit}</Text> : null}
            </View>
          </View>
          <View style={styles.progressBlock}>
            <Text variant="caption" style={styles.cardCaption}>Progression</Text>
            <Text style={styles.percent}>{percent}%</Text>
          </View>
        </View>
        <ProgressBar progress={percent} />
        <View style={styles.cardRow}>
          <Text variant="caption" style={styles.cardCaption}>
            {completedCount} tâche{completedCount > 1 ? 's' : ''} sur {totalCount} complétée{completedCount > 1 ? 's' : ''}
          </Text>
          {onSeeAll ? (
            <TouchableOpacity onPress={onSeeAll} accessibilityRole="button" hitSlop={12}>
              <Text variant="label" style={styles.seeAll}>Voir tout →</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.darkBlue,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { flex: 1, gap: 2 },
  hello: { color: 'rgba(255,255,255,0.8)' },
  name: { color: colors.white },
  subtitle: { color: 'rgba(255,255,255,0.7)' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  avatarEmoji: { fontSize: 24 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardCaption: { color: 'rgba(255,255,255,0.7)' },
  countdownRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  countdownValue: { color: colors.goldLight, fontSize: 36, lineHeight: 42, fontWeight: '700' },
  countdownUnit: { color: 'rgba(255,255,255,0.8)' },
  progressBlock: { alignItems: 'flex-end' },
  percent: { color: colors.white, fontSize: 26, lineHeight: 32, fontWeight: '700' },
  seeAll: { color: colors.goldLight },
});

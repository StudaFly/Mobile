import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Badge } from '@/design-system/components/data-display/Badge';
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { FOLLOW_UP } from '../labels';
import type { StudentSummary } from '../types/org.types';

export function StudentProgressCard({ student, onPress }: { student: StudentSummary; onPress?: () => void }) {
  const mobility = student.mobility;
  const followUp = student.followUp ? FOLLOW_UP[student.followUp] : null;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} accessibilityRole="button" accessibilityLabel={`Fiche de ${student.name}`}>
      <View style={styles.top}>
        <Text variant="bodyMedium" style={styles.name}>{student.name}</Text>
        {followUp ? <Badge variant={followUp.variant} label={followUp.label} /> : null}
      </View>
      <Text variant="caption" style={styles.muted}>
        {mobility ? `${mobility.city} · ${mobility.advisor ? mobility.advisor.name : 'non affecté'}` : 'Pas encore de mobilité'}
      </Text>
      {mobility ? (
        <View style={styles.progress}>
          <View style={styles.bar}><ProgressBar progress={mobility.progress} /></View>
          <Text variant="caption" style={styles.muted}>{mobility.tasksDone}/{mobility.tasksTotal}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.xs },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  name: { color: colors.darkBlue, flex: 1 },
  muted: { color: '#6B7280' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bar: { flex: 1 },
});

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { OrgHeader } from '../components/OrgHeader';
import { ProgressChart } from '../components/ProgressChart';
import { useStudents } from '../hooks/useStudents';
import { FOLLOW_UP, ZONE_LABELS } from '../labels';
import { orgService } from '../services/org.service';

function count(keys: (string | null | undefined)[]): [string, number][] {
  const map = new Map<string, number>();
  keys.forEach((k) => k && map.set(k, (map.get(k) ?? 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function StatsScreen() {
  const students = useStudents();
  const zones = useQuery({ queryKey: ['org', 'zones'], queryFn: orgService.zones, staleTime: Infinity });
  const list = students.data ?? [];
  const zoneOf = (code: string | null | undefined) => zones.data?.find((z) => !!code && z.countries.includes(code))?.key;
  const average = list.length ? Math.round(list.reduce((sum, s) => sum + (s.mobility?.progress ?? 0), 0) / list.length) : 0;

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <OrgHeader title="Statistiques" />
        <View style={styles.content}>
          <View style={styles.card}>
            <Text variant="heading2" style={styles.title}>{average}%</Text>
            <Text variant="caption" style={styles.muted}>Progression moyenne sur {list.length} étudiant(s)</Text>
          </View>
          <View style={styles.card}>
            <Text variant="label" style={styles.title}>TOP DESTINATIONS</Text>
            <ProgressChart rows={count(list.map((s) => s.mobility?.city)).slice(0, 6)} />
          </View>
          <View style={styles.card}>
            <Text variant="label" style={styles.title}>PAR ZONE</Text>
            <ProgressChart rows={count(list.map((s) => zoneOf(s.mobility?.countryCode))).map(([z, n]) => [ZONE_LABELS[z] ?? z, n])} />
          </View>
          <View style={styles.card}>
            <Text variant="label" style={styles.title}>PAR STATUT</Text>
            <ProgressChart rows={count(list.map((s) => s.followUp)).map(([f, n]) => [FOLLOW_UP[f]?.label ?? f, n])} />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgB2B },
  scroll: { paddingBottom: spacing.xxl },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.sm },
  title: { color: colors.darkBlue },
  muted: { color: '#6B7280' },
});

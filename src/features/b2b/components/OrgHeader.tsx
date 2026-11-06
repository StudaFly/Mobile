import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useOrg } from '../hooks/useB2BDashboard';
import { ZONE_LABELS } from '../labels';

export function OrgHeader({ title }: { title: string }) {
  const user = useAuthStore((s) => s.user);
  const org = useOrg();
  const perimeter = org.data
    ? org.data.myZones.length
      ? org.data.myZones.map((z) => ZONE_LABELS[z] ?? z).join(', ')
      : org.data.myCountries.join(', ')
    : '';
  return (
    <View style={styles.header}>
      <Text variant="caption" style={styles.org}>{org.data?.name ?? user?.organization?.name ?? ''} · {user?.orgRole === 'manager' ? 'Manager' : 'Conseiller·ère'}</Text>
      <Text variant="heading2" style={styles.title} accessibilityRole="header">{title}</Text>
      {perimeter ? (
        <View style={styles.badge}>
          <Text variant="caption" style={styles.badgeText}>Mon périmètre : {perimeter}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.darkBlue, padding: spacing.lg, gap: spacing.xs },
  org: { color: 'rgba(255,255,255,0.75)' },
  title: { color: colors.white },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.goldLight, borderRadius: radii.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeText: { color: colors.darkBlue },
});

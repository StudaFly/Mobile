import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { B2BStackParamList } from '@/navigation/types';
import { AlertBanner } from '../components/AlertBanner';
import { OrgHeader } from '../components/OrgHeader';
import { StudentProgressCard } from '../components/StudentProgressCard';
import { useB2BDashboard } from '../hooks/useB2BDashboard';
import { NotificationBellButton } from '@/features/notifications/components/NotificationBellButton';

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.kpi}>
      <Text variant="heading2" style={styles.kpiValue}>{value}</Text>
      <Text variant="caption" style={styles.muted}>{label}</Text>
    </View>
  );
}

export function B2BDashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<B2BStackParamList>>();
  const isManager = useAuthStore((s) => s.user?.orgRole === 'manager');
  const dashboard = useB2BDashboard();
  const priority = [...dashboard.danger, ...dashboard.warning].slice(0, 5);

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => void dashboard.refetch()} />}
        contentContainerStyle={styles.scroll}
      >
        <OrgHeader
          title="Tableau de bord"
          action={<NotificationBellButton onPress={() => navigation.navigate('Notifications')} />}
        />
        <View style={styles.content}>
          <AlertBanner danger={dashboard.danger.length} warning={dashboard.warning.length} />
          <View style={styles.kpis}>
            <Kpi label="Étudiants" value={dashboard.total} />
            <Kpi label="Critiques" value={dashboard.danger.length} />
            <Kpi label="En retard" value={dashboard.warning.length} />
            {isManager ? <Kpi label="Non affectés" value={dashboard.unassigned.length} /> : null}
          </View>
          <Text variant="label" style={styles.section}>À TRAITER EN PRIORITÉ</Text>
          {priority.length === 0 ? (
            <Text variant="body" style={styles.muted}>Tout le monde est en bonne voie.</Text>
          ) : (
            priority.map((student) => (
              <StudentProgressCard
                key={student.id}
                student={student}
                onPress={() => navigation.navigate('StudentDetail', { studentId: student.id })}
              />
            ))
          )}
          <View style={styles.code}>
            <Text variant="label" style={styles.muted}>CODE D'ÉCOLE</Text>
            <Text variant="heading3" style={styles.codeValue}>{dashboard.joinCode ?? '…'}</Text>
            <Text variant="caption" style={styles.muted}>À communiquer aux étudiants (Profil › Mon établissement).</Text>
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
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  kpi: { flexGrow: 1, flexBasis: '45%', backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md },
  kpiValue: { color: colors.darkBlue },
  muted: { color: '#6B7280' },
  section: { color: colors.darkBlue, marginTop: spacing.sm },
  code: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.xs },
  codeValue: { color: colors.darkBlue, letterSpacing: 3 },
});

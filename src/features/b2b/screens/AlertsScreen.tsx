import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';
import type { B2BStackParamList } from '@/navigation/types';
import { OrgHeader } from '../components/OrgHeader';
import { StudentProgressCard } from '../components/StudentProgressCard';
import { useStudents } from '../hooks/useStudents';
import type { StudentSummary } from '../types/org.types';

function Section({ title, students, onOpen }: { title: string; students: StudentSummary[]; onOpen: (id: string) => void }) {
  return (
    <View style={styles.section}>
      <Text variant="label" style={styles.sectionTitle}>{title} ({students.length})</Text>
      {students.length === 0 ? (
        <Text variant="caption" style={styles.muted}>Aucun étudiant.</Text>
      ) : (
        students.map((s) => <StudentProgressCard key={s.id} student={s} onPress={() => onOpen(s.id)} />)
      )}
    </View>
  );
}

export function AlertsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<B2BStackParamList>>();
  const students = useStudents();
  const list = students.data ?? [];
  const open = (studentId: string) => navigation.navigate('StudentDetail', { studentId });
  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <OrgHeader title="Alertes" />
        <View style={styles.content}>
          <Text variant="caption" style={styles.muted}>Critique : moins de 50 % à J-30 (seuil de l'établissement). En retard : au moins une tâche dépassée.</Text>
          <Section title="CRITIQUES" students={list.filter((s) => s.followUp === 'danger')} onOpen={open} />
          <Section title="EN RETARD" students={list.filter((s) => s.followUp === 'warning')} onOpen={open} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgB2B },
  scroll: { paddingBottom: spacing.xxl },
  content: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { color: colors.darkBlue },
  muted: { color: '#6B7280' },
});

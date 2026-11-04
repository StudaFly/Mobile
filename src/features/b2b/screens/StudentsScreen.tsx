import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import type { B2BStackParamList } from '@/navigation/types';
import { OrgHeader } from '../components/OrgHeader';
import { StudentProgressCard } from '../components/StudentProgressCard';
import { useStudents } from '../hooks/useStudents';
import { FOLLOW_UP } from '../labels';
import type { FollowUp } from '../types/org.types';

const FILTERS: { key: FollowUp | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'danger', label: FOLLOW_UP.danger.label },
  { key: 'warning', label: FOLLOW_UP.warning.label },
  { key: 'ok', label: FOLLOW_UP.ok.label },
];

export function StudentsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<B2BStackParamList>>();
  const students = useStudents();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FollowUp | 'all'>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (students.data ?? []).filter(
      (s) =>
        (filter === 'all' || s.followUp === filter) &&
        (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)),
    );
  }, [students.data, query, filter]);

  return (
    <ScreenWrapper style={styles.screen}>
      <OrgHeader title="Étudiants" />
      <View style={styles.controls}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Rechercher un étudiant" accessibilityLabel="Rechercher un étudiant" />
        <View style={styles.filters}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.filter, filter === f.key && styles.filterActive]}
              accessibilityRole="button"
              accessibilityLabel={`Filtre ${f.label}`}
              accessibilityState={{ selected: filter === f.key }}
            >
              <Text variant="label" style={filter === f.key ? styles.filterTextActive : styles.filterText}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        refreshing={students.isFetching}
        onRefresh={() => void students.refetch()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title="Aucun étudiant" message="Aucun étudiant ne correspond à ces filtres dans votre périmètre." />}
        renderItem={({ item }) => (
          <StudentProgressCard student={item} onPress={() => navigation.navigate('StudentDetail', { studentId: item.id })} />
        )}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgB2B },
  controls: { padding: spacing.lg, gap: spacing.sm },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  filter: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radii.full, backgroundColor: colors.white },
  filterActive: { backgroundColor: colors.darkBlue },
  filterText: { color: colors.darkBlue },
  filterTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm },
});

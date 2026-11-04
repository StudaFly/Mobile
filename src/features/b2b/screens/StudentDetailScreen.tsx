import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/design-system/components/actions/Button';
import { Badge } from '@/design-system/components/data-display/Badge';
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar';
import { Header } from '@/design-system/components/layout/Header';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import type { B2BStackParamList } from '@/navigation/types';
import { CATEGORY_LABELS, FOLLOW_UP, formatShortDate } from '../labels';
import { orgService } from '../services/org.service';

export function StudentDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<B2BStackParamList, 'StudentDetail'>>();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const student = useQuery({ queryKey: ['org', 'student', params.studentId], queryFn: () => orgService.student(params.studentId), retry: false });
  const notes = useQuery({ queryKey: ['org', 'notes', params.studentId], queryFn: () => orgService.notes(params.studentId), enabled: student.isSuccess });
  const addNote = useMutation({
    mutationFn: () => orgService.addNote(params.studentId, note.trim()),
    onSuccess: () => {
      setNote('');
      void queryClient.invalidateQueries({ queryKey: ['org', 'notes', params.studentId] });
    },
    onError: (err) => Alert.alert('Erreur', getApiErrorMessage(err)),
  });

  const s = student.data;
  return (
    <ScreenWrapper style={styles.screen}>
      <Header title={s?.name ?? 'Étudiant'} onBack={() => navigation.goBack()} />
      {student.isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : !s ? (
        <Text variant="body" style={styles.empty}>Étudiant introuvable ou hors de votre périmètre.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text variant="caption" style={styles.muted}>{s.email}{s.phone ? ` · ${s.phone}` : ''}</Text>
            {s.followUp ? <Badge variant={FOLLOW_UP[s.followUp].variant} label={FOLLOW_UP[s.followUp].label} /> : null}
          </View>
          {s.mobilities.map((m) => (
            <View key={m.id} style={styles.card}>
              <Text variant="bodyMedium" style={styles.title}>{m.city} · {m.type}</Text>
              <Text variant="caption" style={styles.muted}>Départ le {formatShortDate(m.departureDate)} · conseiller : {m.advisor?.name ?? 'non affecté'}</Text>
              <ProgressBar progress={m.progress} />
              <Text variant="caption" style={styles.muted}>{m.tasksDone}/{m.tasksTotal} tâches · {m.overdueTasks} en retard</Text>
              {m.categories.map((c) => (
                <View key={c.category} style={styles.categoryRow}>
                  <Text variant="caption">{CATEGORY_LABELS[c.category] ?? c.category}</Text>
                  <Text variant="label">{c.done}/{c.total}</Text>
                </View>
              ))}
              <Text variant="label" style={styles.title}>Documents (statut uniquement)</Text>
              {m.documents.length === 0 ? (
                <Text variant="caption" style={styles.muted}>Aucun document déposé.</Text>
              ) : (
                m.documents.map((d) => (
                  <Text key={d.id} variant="caption">✓ {d.category ?? 'Document'} — {formatShortDate(d.uploadedAt)}</Text>
                ))
              )}
            </View>
          ))}
          <View style={styles.card}>
            <Text variant="bodyMedium" style={styles.title}>Notes internes</Text>
            <Text variant="caption" style={styles.muted}>Incluses dans l'export RGPD de l'étudiant : restez factuel.</Text>
            <RNTextInput
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={5000}
              placeholder="Ajouter une note"
              accessibilityLabel="Nouvelle note"
              style={styles.input}
            />
            <Button label="Ajouter la note" onPress={() => addNote.mutate()} isLoading={addNote.isPending} disabled={!note.trim()} />
            {(notes.data ?? []).map((n) => (
              <View key={n.id} style={styles.note}>
                <Text variant="caption">{n.body}</Text>
                <Text variant="caption" style={styles.muted}>{n.author?.name ?? 'Ancien membre'} · {formatShortDate(n.createdAt)}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgB2B },
  loader: { marginTop: spacing.xxl },
  empty: { padding: spacing.lg },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.sm },
  title: { color: colors.darkBlue },
  muted: { color: '#6B7280' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  input: { minHeight: 80, borderWidth: 1, borderColor: colors.blue, borderRadius: radii.md, padding: spacing.sm, textAlignVertical: 'top' },
  note: { backgroundColor: colors.bg, borderRadius: radii.md, padding: spacing.sm, gap: 2 },
});

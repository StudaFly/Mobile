import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { Header } from '@/design-system/components/layout/Header';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { userService } from '@/features/profile/services/user.service';
import { ConsentList } from '../components/ConsentList';
import { SchoolBanner } from '../components/SchoolBanner';
import { PREMIUM_SOURCE_LABELS } from '../labels';
import { organizationService } from '../services/organization.service';

export function MyOrganizationScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const [code, setCode] = useState('');

  const refresh = async () => setUser(await userService.getMe(), token ?? '');
  const onError = (err: unknown) => Alert.alert('Erreur', getApiErrorMessage(err));
  const preview = useMutation({ mutationFn: () => organizationService.previewByCode(code.trim()), onError });
  const join = useMutation({
    mutationFn: () => organizationService.join(code.trim()),
    onSuccess: async (organization) => {
      await refresh();
      preview.reset();
      setCode('');
      Alert.alert('Bienvenue !', `Tu as rejoint ${organization.name}.`);
    },
    onError,
  });
  const leave = useMutation({ mutationFn: organizationService.leave, onSuccess: refresh, onError });

  if (!user) return null;
  const organization = user.organization;
  const premium = user.premium;

  const confirmLeave = () =>
    Alert.alert(
      "Quitter l'établissement ?",
      premium?.source === 'organization'
        ? `${organization?.name} ne verra plus ton suivi. Le Premium offert par ton école s'arrête immédiatement : il n'est pas conservé après un départ volontaire.`
        : `${organization?.name} ne verra plus ton suivi.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: () => leave.mutate() },
      ],
    );

  return (
    <ScreenWrapper>
      <Header title="Mon établissement" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text variant="label" style={styles.muted}>OFFRE</Text>
          <Text variant="bodyMedium">
            {premium?.active
              ? `⭐ Premium — ${PREMIUM_SOURCE_LABELS[premium.source ?? ''] ?? ''}`
              : 'Offre gratuite « Essentiel »'}
          </Text>
        </View>

        {organization ? (
          <View style={styles.card}>
            <SchoolBanner />
            <Text variant="caption" style={styles.muted}>
              Ton équipe Relations Internationales suit ta progression, sans jamais accéder au contenu de tes documents.
            </Text>
            <Button label="Quitter l'établissement" variant="danger" onPress={confirmLeave} isLoading={leave.isPending} />
          </View>
        ) : preview.data ? (
          <View style={styles.card}>
            <ConsentList
              schoolName={preview.data.organization.name}
              shared={preview.data.sharedWithSchool}
              neverShared={preview.data.neverShared}
            />
            <Button
              label={`J'accepte et je rejoins ${preview.data.organization.name}`}
              onPress={() => join.mutate()}
              isLoading={join.isPending}
              fullWidth
            />
            <Button label="Annuler" variant="ghost" onPress={() => preview.reset()} fullWidth />
          </View>
        ) : (
          <View style={styles.card}>
            <Text variant="body">Ton école utilise StudaFly ? Saisis le code qu'elle t'a communiqué.</Text>
            <TextInput
              label="Code d'école"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              placeholder="ABCDE-12345"
              accessibilityLabel="Code d'école"
            />
            <Button
              label="Continuer"
              onPress={() => preview.mutate()}
              isLoading={preview.isPending}
              disabled={code.trim().length < 4}
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.md },
  muted: { color: '#6B7280' },
});

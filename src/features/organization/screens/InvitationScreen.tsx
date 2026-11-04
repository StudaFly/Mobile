import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { Header } from '@/design-system/components/layout/Header';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import { secureStorage } from '@/core/storage/secureStorage';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { userService } from '@/features/profile/services/user.service';
import type { RootStackParamList } from '@/navigation/types';
import { ConsentList } from '../components/ConsentList';
import { organizationService } from '../services/organization.service';
import { useInvitationStore } from '../store/invitation.store';

export function InvitationScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Invitation'>>();
  const token = params.token;
  const { user, isAuthenticated, token: accessToken, setUser } = useAuthStore();
  const setPendingToken = useInvitationStore((s) => s.setPendingToken);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const invitation = useQuery({
    queryKey: ['invitation', token],
    queryFn: () => organizationService.previewInvitation(token),
    retry: false,
  });

  const close = () => (navigation.canGoBack() ? navigation.goBack() : undefined);

  const accept = useMutation({
    mutationFn: (body?: { name: string; password: string }) => organizationService.acceptInvitation(token, body),
    onSuccess: async (result) => {
      setPendingToken(null);
      if (result.auth) {
        await secureStorage.setToken(result.auth.accessToken);
        await secureStorage.setRefreshToken(result.auth.refreshToken);
        setUser(result.auth.user, result.auth.accessToken);
      } else {
        setUser(await userService.getMe(), accessToken ?? '');
      }
      Alert.alert('Bienvenue !', `Tu as rejoint ${result.organization.name}.`);
      close();
    },
    onError: (err) => Alert.alert('Erreur', getApiErrorMessage(err)),
  });

  if (invitation.isLoading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator style={styles.loader} size="large" />
      </ScreenWrapper>
    );
  }

  const data = invitation.data;
  const emailMatches = !!user && !!data && user.email.toLowerCase() === data.email.toLowerCase();

  return (
    <ScreenWrapper>
      <Header title="Invitation" onBack={navigation.canGoBack() ? close : undefined} />
      <ScrollView contentContainerStyle={styles.content}>
        {!data ? (
          <Text variant="body">Ce lien n'est pas valide. Demande à ton école de t'en renvoyer un.</Text>
        ) : (
          <View style={styles.card}>
            <Text variant="heading3" accessibilityRole="header">
              {data.kind === 'staff' ? `Rejoindre l'équipe de ${data.organization.name}` : `${data.organization.name} t'invite`}
            </Text>
            <Text variant="caption" style={styles.muted}>Invitation envoyée à {data.email}</Text>

            {data.status !== 'pending' ? (
              <Text variant="body">Cette invitation n'est plus utilisable.</Text>
            ) : data.kind === 'staff' ? (
              isAuthenticated ? (
                <Button label="Rejoindre l'équipe" onPress={() => accept.mutate(undefined)} isLoading={accept.isPending} disabled={!emailMatches} fullWidth />
              ) : (
                <>
                  <TextInput label="Nom complet" value={name} onChangeText={setName} accessibilityLabel="Nom complet" />
                  <TextInput label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry hint="8 caractères minimum" accessibilityLabel="Mot de passe" />
                  <Button
                    label="Créer mon compte et rejoindre l'équipe"
                    onPress={() => accept.mutate({ name, password })}
                    isLoading={accept.isPending}
                    disabled={!name.trim() || password.length < 8}
                    fullWidth
                  />
                </>
              )
            ) : !isAuthenticated ? (
              <>
                <Text variant="body">Connecte-toi ou crée ton compte étudiant avec l'adresse {data.email}, puis l'invitation se rouvrira.</Text>
                <Button
                  label="Se connecter"
                  onPress={() => {
                    setPendingToken(token);
                    close();
                  }}
                  fullWidth
                />
              </>
            ) : (
              <>
                <ConsentList schoolName={data.organization.name} shared={data.sharedWithSchool} neverShared={data.neverShared} />
                {!emailMatches && (
                  <Text variant="caption" style={styles.error}>Tu es connecté·e avec {user?.email} : cette invitation est réservée à {data.email}.</Text>
                )}
                <Button
                  label={`J'accepte et je rejoins ${data.organization.name}`}
                  onPress={() => accept.mutate(undefined)}
                  isLoading={accept.isPending}
                  disabled={!emailMatches}
                  fullWidth
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: spacing.xxl },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.md },
  muted: { color: '#6B7280' },
  error: { color: colors.danger },
});

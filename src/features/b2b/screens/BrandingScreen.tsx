import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/design-system/components/actions/Button';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { Header } from '@/design-system/components/layout/Header';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { colors, radii, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import { BrandingPreview } from '../components/BrandingPreview';
import { useOrg } from '../hooks/useB2BDashboard';
import { orgService } from '../services/org.service';

export function BrandingScreen() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const org = useOrg();
  const [color, setColor] = useState('#33518A');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (!org.data) return;
    setColor(org.data.branding?.primary_color ?? '#33518A');
    setLogoUrl(org.data.logoUrl ?? '');
  }, [org.data]);

  const save = useMutation({
    mutationFn: () => orgService.update({ logoUrl: logoUrl.trim() || null, branding: { ...org.data?.branding, primary_color: color } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['org'] });
      Alert.alert('Enregistré', 'Le branding est appliqué dans l’app de vos étudiants.');
    },
    onError: (err) => Alert.alert('Erreur', getApiErrorMessage(err)),
  });

  const valid = /^#[0-9a-fA-F]{6}$/.test(color);
  return (
    <ScreenWrapper style={styles.screen}>
      <Header title="Branding" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <BrandingPreview name={org.data?.name ?? ''} color={color} />
          <TextInput label="Couleur principale" value={color} onChangeText={setColor} autoCapitalize="none" error={valid ? undefined : 'Format attendu : #RRGGBB'} accessibilityLabel="Couleur principale" />
          <TextInput label="URL du logo" value={logoUrl} onChangeText={setLogoUrl} autoCapitalize="none" placeholder="https://…" accessibilityLabel="URL du logo" />
          <Button label="Enregistrer" onPress={() => save.mutate()} isLoading={save.isPending} disabled={!valid} fullWidth />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgB2B },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: spacing.md, gap: spacing.md },
});

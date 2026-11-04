import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { env } from '@/core/config/env';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { logout } from '@/features/auth/session';
import type { B2BStackParamList } from '@/navigation/types';
import { OrgHeader } from '../components/OrgHeader';

function Row({ icon, title, subtitle, onPress, danger }: { icon: string; title: string; subtitle?: string; onPress: () => void; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <Icon name={icon} size={18} color={danger ? colors.danger : colors.darkBlue} />
      <View style={styles.rowText}>
        <Text variant="bodyMedium" style={danger ? styles.danger : styles.rowTitle}>{title}</Text>
        {subtitle ? <Text variant="caption" style={styles.muted}>{subtitle}</Text> : null}
      </View>
      <Icon name="ChevronRight" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<B2BStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const isManager = user?.orgRole === 'manager';

  const confirmLogout = () =>
    Alert.alert('Se déconnecter', "Tu devras te reconnecter pour accéder à l'espace établissement.", [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => void logout() },
    ]);

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <OrgHeader title="Réglages" />
        <View style={styles.content}>
          <Text variant="label" style={styles.section}>MON COMPTE</Text>
          <View style={styles.group}>
            <View style={styles.row}>
              <Icon name="User" size={18} color={colors.darkBlue} />
              <View style={styles.rowText}>
                <Text variant="bodyMedium" style={styles.rowTitle}>{user?.name}</Text>
                <Text variant="caption" style={styles.muted}>{user?.email}</Text>
              </View>
            </View>
          </View>
          {isManager ? (
            <>
              <Text variant="label" style={styles.section}>ÉTABLISSEMENT</Text>
              <View style={styles.group}>
                <Row icon="Palette" title="Branding" subtitle="Logo et couleur principale" onPress={() => navigation.navigate('Branding')} />
                <Row icon="ListChecks" title="Tâches école" subtitle="Bientôt disponible" onPress={() => navigation.navigate('SchoolTasks')} />
                <Row
                  icon="Globe"
                  title="Gérer sur le web"
                  subtitle="Équipe, périmètres, invitations, contrat, journal"
                  onPress={() => void Linking.openURL(`${env.WEB_URL}/org`)}
                />
              </View>
            </>
          ) : null}
          <View style={styles.group}>
            <Row icon="LogOut" title="Se déconnecter" onPress={confirmLogout} danger />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bgB2B },
  scroll: { paddingBottom: spacing.xxl },
  content: { padding: spacing.lg, gap: spacing.sm },
  section: { color: colors.darkBlue, marginTop: spacing.sm },
  group: { backgroundColor: colors.white, borderRadius: radii.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, minHeight: 56 },
  rowText: { flex: 1 },
  rowTitle: { color: colors.darkBlue },
  danger: { color: colors.danger },
  muted: { color: '#6B7280' },
});

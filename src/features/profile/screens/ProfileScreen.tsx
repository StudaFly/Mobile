import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { getApiErrorMessage } from '@/core/api/errors';
import { logout } from '@/features/auth/session';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { useReference } from '@/core/reference';
import { formatLongDate } from '@/features/mobility/utils';
import type { B2CNavigationProp } from '@/navigation/types';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { useProfile } from '../hooks/useProfile';

interface RowProps {
  iconName: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
}

function Row({ iconName, title, subtitle, onPress, danger, right }: RowProps) {
  const content = (
    <>
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Icon name={iconName} size={18} color={danger ? colors.danger : colors.darkBlue} />
      </View>
      <View style={styles.rowText}>
        <Text variant="bodyMedium" style={[styles.rowTitle, danger && styles.danger]}>{title}</Text>
        {subtitle ? <Text variant="caption" style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Icon name="ChevronRight" size={18} color="#9CA3AF" /> : null)}
    </>
  );
  return onPress ? (
    <TouchableOpacity style={styles.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      {content}
    </TouchableOpacity>
  ) : (
    <View style={styles.row}>{content}</View>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<B2CNavigationProp>();
  const { user, updateProfile, deleteAccount } = useProfile();
  const { mobility, destination, daysUntilDeparture, completedCount, totalCount, percent } = useDashboard();
  const { mobilityTypeLabel } = useReference();

  if (!user) return <ScreenWrapper style={styles.screen}>{null}</ScreenWrapper>;

  const confirmLogout = () =>
    Alert.alert('Se déconnecter', 'Tu devras te reconnecter pour accéder à ton parcours.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => void logout() },
    ]);

  const confirmDelete = () =>
    Alert.alert(
      'Supprimer mon compte',
      'Ton compte, ta mobilité et toutes tes tâches seront définitivement supprimés. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () =>
            deleteAccount.mutate(undefined, {
              onError: (err) => Alert.alert('Erreur', getApiErrorMessage(err)),
            }),
        },
      ],
    );

  const toggleNotifications = (value: boolean) =>
    updateProfile.mutate(
      { enableNotifications: value },
      { onError: (err) => Alert.alert('Erreur', getApiErrorMessage(err)) },
    );

  const mobilitySubtitle = mobility
    ? [mobilityTypeLabel(mobility.type), destination?.city, formatLongDate(mobility.departureDate)]
        .filter(Boolean)
        .join(' · ')
    : 'Aucune mobilité configurée';

  return (
    <ScreenWrapper style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.identity}>
            <ProfileAvatar emoji={user.avatarEmoji} size={80} />
            <View style={styles.identityText}>
              <Text variant="heading3" style={styles.name} accessibilityRole="header">{user.name}</Text>
              <Text variant="caption" style={styles.email}>{user.email}</Text>
              <View style={styles.chips}>
                <View style={styles.chip}>
                  <Text variant="caption" style={styles.chipText}>{user.isPremium ? '⭐ Premium' : 'Gratuit'}</Text>
                </View>
                {destination ? (
                  <View style={styles.chip}>
                    <Text variant="caption" style={styles.chipText}>📍 {destination.city}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
              accessibilityRole="button"
              accessibilityLabel="Modifier mon profil"
            >
              <Icon name="Pencil" size={14} color={colors.white} />
              <Text variant="label" style={styles.editText}>Éditer</Text>
            </TouchableOpacity>
          </View>

          {mobility ? (
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{completedCount}/{totalCount}</Text>
                <Text variant="caption" style={styles.statLabel}>Tâches faites</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {daysUntilDeparture !== null && daysUntilDeparture >= 0 ? `${daysUntilDeparture}j` : '—'}
                </Text>
                <Text variant="caption" style={styles.statLabel}>Avant départ</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{percent}%</Text>
                <Text variant="caption" style={styles.statLabel}>Progression</Text>
              </View>
            </View>
          ) : null}
        </View>

        <Text variant="label" style={styles.sectionLabel}>MON COMPTE</Text>
        <View style={styles.group}>
          <Row
            iconName="User"
            title="Informations personnelles"
            subtitle={user.phone ? `${user.name} · ${user.phone}` : user.name}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <Row
            iconName="GraduationCap"
            title="Ma mobilité"
            subtitle={mobility?.school ? `${mobilitySubtitle}\n${mobility.school}` : mobilitySubtitle}
            onPress={mobility ? undefined : () => navigation.navigate('CreateMobility')}
          />
        </View>

        <Text variant="label" style={styles.sectionLabel}>PRÉFÉRENCES</Text>
        <View style={styles.group}>
          <Row
            iconName="Bell"
            title="Notifications"
            subtitle="Rappels des échéances importantes"
            right={
              <Switch
                value={user.enableNotifications}
                onValueChange={toggleNotifications}
                disabled={updateProfile.isPending}
                trackColor={{ true: colors.blue, false: '#D1D5DB' }}
                accessibilityLabel="Activer les notifications"
              />
            }
          />
        </View>

        <View style={[styles.group, styles.dangerGroup]}>
          <Row iconName="LogOut" title="Se déconnecter" onPress={confirmLogout} danger />
          <Row iconName="Trash2" title="Supprimer mon compte" onPress={confirmDelete} danger />
        </View>

        <Text variant="caption" style={styles.footer}>
          StudaFly v{Constants.expoConfig?.version ?? '1.0.0'}
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.bg },
  scroll: { paddingBottom: spacing.xxl },
  header: { backgroundColor: colors.darkBlue, padding: spacing.lg, gap: spacing.lg },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  identityText: { flex: 1, gap: 2 },
  name: { color: colors.white },
  email: { color: 'rgba(255,255,255,0.7)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  chipText: { color: colors.white },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  editText: { color: colors.white },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { color: colors.goldLight, fontSize: 20, lineHeight: 26, fontWeight: '700' },
  statLabel: { color: 'rgba(255,255,255,0.7)' },
  sectionLabel: {
    color: '#9CA3AF',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  group: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  dangerGroup: { marginTop: spacing.lg, borderWidth: 1, borderColor: '#FECACA' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: { backgroundColor: '#FEF2F2' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { color: colors.darkBlue },
  rowSubtitle: { color: '#6B7280' },
  danger: { color: colors.danger },
  footer: { color: '#9CA3AF', textAlign: 'center', marginTop: spacing.lg },
});

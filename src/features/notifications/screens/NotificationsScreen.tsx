import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { Header } from '@/design-system/components/layout/Header';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { NotificationRow } from '../components/NotificationRow';
import { useNotificationActions, useNotifications } from '../hooks/useNotifications';
import { openNotificationTarget } from '../navigation';
import type { AppNotification } from '../types/notification.types';
import { isTaskReminder } from '../utils/format';

type Filter = 'all' | 'unread';

export function NotificationsScreen() {
  const navigation = useNavigation();
  const accountType = useAuthStore((s) => s.user?.accountType);
  const [filter, setFilter] = useState<Filter>('all');
  const { data, isLoading, isError, refetch, isRefetching } = useNotifications({
    unreadOnly: filter === 'unread',
    limit: 100,
  });
  const { markRead, markAllRead, remove, isMarkingAll } = useNotificationActions();
  const unread = data?.unreadCount ?? 0;

  const open = (notification: AppNotification) => {
    if (!notification.isRead) void markRead(notification.id).catch(() => undefined);
    if (accountType !== 'org_staff' && isTaskReminder(notification.type)) {
      openNotificationTarget(notification.type, accountType);
    }
  };

  const confirmDelete = (notification: AppNotification) =>
    Alert.alert('Supprimer la notification ?', notification.title, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => void remove(notification.id) },
    ]);

  const markAll =
    unread > 0 ? (
      <TouchableOpacity
        onPress={() => void markAllRead()}
        disabled={isMarkingAll}
        accessibilityRole="button"
        hitSlop={8}
      >
        <Text variant="label" style={styles.markAll}>Tout lire</Text>
      </TouchableOpacity>
    ) : undefined;

  return (
    <ScreenWrapper>
      <Header title="Notifications" onBack={() => navigation.goBack()} rightAction={markAll} />
      <View style={styles.filters} accessibilityRole="tablist">
        {(['all', 'unread'] as const).map((id) => (
          <TouchableOpacity
            key={id}
            onPress={() => setFilter(id)}
            style={[styles.chip, filter === id && styles.chipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === id }}
          >
            <Text variant="label" style={filter === id ? styles.chipTextActive : styles.chipText}>
              {id === 'all' ? 'Toutes' : `Non lues (${unread})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationRow notification={item} onPress={open} onDelete={confirmDelete} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
        ListEmptyComponent={
          isLoading ? (
            <Text variant="body" style={styles.info}>Chargement…</Text>
          ) : isError ? (
            <EmptyState
              title="Impossible de charger les notifications"
              ctaLabel="Réessayer"
              onCta={() => void refetch()}
            />
          ) : (
            <EmptyState
              title={filter === 'unread' ? 'Tout est lu 🎉' : 'Aucune notification'}
              message="Les rappels d'échéances et les messages de ton école apparaîtront ici."
            />
          )
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  chip: { borderRadius: radii.full, paddingHorizontal: spacing.md, paddingVertical: 6, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.darkBlue },
  chipText: { color: '#4B5563' },
  chipTextActive: { color: colors.white },
  list: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
  separator: { height: spacing.sm },
  info: { textAlign: 'center', color: '#9CA3AF', marginTop: spacing.xl },
  markAll: { color: colors.blue },
});

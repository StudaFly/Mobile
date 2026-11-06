import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlarmClock, AlertTriangle, Bell, CalendarClock, School, Trash2, UserCheck } from 'lucide-react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, spacing } from '@/design-system/tokens';
import type { AppNotification } from '../types/notification.types';
import { formatRelativeTime } from '../utils/format';

const ICONS: Record<string, typeof Bell> = {
  task_due_soon: CalendarClock,
  task_due_today: AlarmClock,
  task_overdue: AlertTriangle,
  organization_invitation: School,
  invitation_accepted: UserCheck,
};

interface NotificationRowProps {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
  onDelete: (notification: AppNotification) => void;
}

export function NotificationRow({ notification, onPress, onDelete }: NotificationRowProps) {
  const Icon = ICONS[notification.type] ?? Bell;
  const overdue = notification.type === 'task_overdue';
  const unread = !notification.isRead;

  return (
    <View style={[styles.row, unread && styles.unreadRow]}>
      <TouchableOpacity
        style={styles.main}
        onPress={() => onPress(notification)}
        accessibilityRole="button"
        accessibilityLabel={`${unread ? 'Non lue. ' : ''}${notification.title}. ${notification.body ?? ''}`}
      >
        <View style={[styles.icon, overdue && styles.iconDanger]}>
          <Icon size={18} color={overdue ? colors.danger : colors.darkBlue} />
        </View>
        <View style={styles.texts}>
          <Text variant="bodyMedium" style={unread ? styles.titleUnread : undefined}>{notification.title}</Text>
          {notification.body ? <Text variant="body" style={styles.body}>{notification.body}</Text> : null}
          <Text variant="caption" style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
        </View>
        {unread ? <View style={styles.dot} /> : null}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(notification)}
        style={styles.delete}
        accessibilityRole="button"
        accessibilityLabel="Supprimer la notification"
        hitSlop={8}
      >
        <Trash2 size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#EEF0F3',
  },
  unreadRow: { backgroundColor: '#FFFBEB', borderColor: '#FDE7B0' },
  main: { flex: 1, flexDirection: 'row', gap: spacing.sm },
  icon: {
    width: 34,
    height: 34,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },
  iconDanger: { backgroundColor: '#FEE2E2' },
  texts: { flex: 1, gap: 2 },
  titleUnread: { fontWeight: '700' },
  body: { color: '#4B5563' },
  time: { color: '#9CA3AF' },
  dot: { width: 8, height: 8, borderRadius: radii.full, backgroundColor: colors.goldLight, marginTop: 6 },
  delete: { paddingLeft: spacing.sm, paddingTop: 2 },
});

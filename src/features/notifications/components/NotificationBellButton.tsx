import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii } from '@/design-system/tokens';
import { useUnreadCount } from '../hooks/useNotifications';
import { formatBadge } from '../utils/format';

/** Bell with the unread badge, made for the dark blue headers. */
export function NotificationBellButton({ onPress }: { onPress: () => void }) {
  const { data: unread = 0 } = useUnreadCount();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={unread ? `Notifications, ${unread} non lues` : 'Notifications'}
      hitSlop={8}
    >
      <Bell size={22} color={colors.white} />
      {unread > 0 ? (
        <View style={styles.badge} testID="notification-badge">
          <Text style={styles.badgeText}>{formatBadge(unread)}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: radii.full,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, lineHeight: 12, fontWeight: '700' },
});

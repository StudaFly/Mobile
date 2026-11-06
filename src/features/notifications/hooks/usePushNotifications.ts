import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { registerDeviceForPush } from '../push';
import { openNotificationTarget } from '../navigation';
import { NOTIFICATIONS_QUERY_KEY } from './useNotifications';

/**
 * While a student or school staff member is logged in: registers the device for push,
 * refreshes the list when a push arrives, and opens the right screen when one is tapped.
 */
export function usePushNotifications(): void {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accountType = user?.accountType;
  const canReceive =
    isAuthenticated && !!user && accountType !== 'platform_admin' && user.enableNotifications !== false;
  const handledResponse = useRef<string | null>(null);
  const lastResponse = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (canReceive) void registerDeviceForPush();
  }, [canReceive, user?.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const received = Notifications.addNotificationReceivedListener(() => {
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    });
    return () => received.remove();
  }, [isAuthenticated, queryClient]);

  // Covers both a tap while the app runs and the tap that launched it.
  useEffect(() => {
    if (!isAuthenticated || !lastResponse) return;
    const id = lastResponse.notification.request.identifier;
    if (handledResponse.current === id) return;
    handledResponse.current = id;
    const data = lastResponse.notification.request.content.data as Record<string, unknown> | undefined;
    void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    openNotificationTarget(typeof data?.type === 'string' ? data.type : undefined, accountType);
  }, [lastResponse, isAuthenticated, accountType, queryClient]);
}

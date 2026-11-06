import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

/** The badge also refreshes when a push arrives (see NotificationProvider). */
export const UNREAD_POLL_INTERVAL_MS = 60_000;

export function useNotifications(options: { unreadOnly?: boolean; limit?: number } = {}) {
  const { unreadOnly = false, limit = 50 } = options;
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'list', { unreadOnly, limit }],
    queryFn: () => notificationsService.list({ unreadOnly, limit }),
  });
}

export function useUnreadCount(enabled = true) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, 'unread-count'],
    queryFn: () => notificationsService.unreadCount(),
    enabled,
    refetchInterval: UNREAD_POLL_INTERVAL_MS,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: refresh,
  });
  const markAllRead = useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: (id: string) => notificationsService.remove(id),
    onSuccess: refresh,
  });

  return {
    markRead: (id: string) => markRead.mutateAsync(id),
    markAllRead: () => markAllRead.mutateAsync(),
    remove: (id: string) => remove.mutateAsync(id),
    isMarkingAll: markAllRead.isPending,
  };
}

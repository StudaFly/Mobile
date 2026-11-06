import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import type { AppNotification, NotificationList, PushPlatform } from '../types/notification.types';

export const notificationsService = {
  async list(params: { unreadOnly?: boolean; limit?: number } = {}): Promise<NotificationList> {
    const { data } = await apiClient.get<ApiResponse<NotificationList>>(ENDPOINTS.NOTIFICATIONS, {
      params,
    });
    return data.data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
      ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT,
    );
    return data.data.count;
  },

  async markRead(id: string): Promise<AppNotification> {
    const { data } = await apiClient.patch<ApiResponse<AppNotification>>(
      ENDPOINTS.NOTIFICATION_READ(id),
    );
    return data.data;
  },

  async markAllRead(): Promise<number> {
    const { data } = await apiClient.post<ApiResponse<{ updated: number }>>(
      ENDPOINTS.NOTIFICATIONS_READ_ALL,
    );
    return data.data.updated;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.NOTIFICATION_BY_ID(id));
  },

  async registerPushToken(token: string, platform: PushPlatform): Promise<void> {
    await apiClient.post(ENDPOINTS.PUSH_TOKENS, { token, platform });
  },

  async unregisterPushToken(token: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.PUSH_TOKENS, { params: { token } });
  },
};

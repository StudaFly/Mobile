import React from 'react';
import { configureForegroundNotifications } from '@/features/notifications/push';
import { usePushNotifications } from '@/features/notifications/hooks/usePushNotifications';

configureForegroundNotifications();

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  usePushNotifications();
  return <>{children}</>;
}

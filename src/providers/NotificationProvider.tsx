import React, { useEffect } from 'react';
// TODO: Initialiser expo-notifications (FCM + APNs)

interface NotificationProviderProps {
  children: React.ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  useEffect(() => {
    // TODO: Enregistrer l'appareil pour les push notifications
  }, []);

  return <>{children}</>;
}

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '@/core/storage/storage.keys';
import { notificationsService } from './services/notifications.service';

export const ANDROID_CHANNEL_ID = 'default';

/** Show pushes as banners even when the app is open. */
export function configureForegroundNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

function easProjectId(): string | undefined {
  return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
}

/**
 * Asks for permission and returns this device's Expo push token, or null when push is not
 * possible here (simulator, permission refused, no EAS project configured).
 */
export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: 'StudaFly',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const status = current.granted
    ? current.status
    : (await Notifications.requestPermissionsAsync()).status;
  if (status !== 'granted') return null;

  const projectId = easProjectId();
  if (!projectId) {
    console.warn('[notifications] No EAS projectId in app config: push is disabled (run `eas init`).');
    return null;
  }
  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}

/** Registers this device for the logged-in user. Push is best effort: never throws. */
export async function registerDeviceForPush(): Promise<string | null> {
  try {
    const token = await getExpoPushToken();
    if (!token) return null;
    await notificationsService.registerPushToken(token, Platform.OS === 'ios' ? 'ios' : 'android');
    await SecureStore.setItemAsync(STORAGE_KEYS.PUSH_TOKEN, token);
    return token;
  } catch (err) {
    console.warn('[notifications] Push registration failed', err);
    return null;
  }
}

/** Detaches this device from the account (call before logging out, while still authenticated). */
export async function unregisterDeviceForPush(): Promise<void> {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.PUSH_TOKEN);
    if (!token) return;
    await SecureStore.deleteItemAsync(STORAGE_KEYS.PUSH_TOKEN);
    await notificationsService.unregisterPushToken(token);
  } catch {
    // Offline or session already expired: the backend drops dead tokens on the next push.
  }
}

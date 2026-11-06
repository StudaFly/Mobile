jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: { eas: { projectId: 'project-123' } } } },
}));
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));
jest.mock('../../../src/navigation/navigationRef', () => ({
  navigationRef: { isReady: () => true, navigate: (...args: unknown[]) => mockNavigate(...args) },
}));

import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../../../src/core/api/client';
import { ENDPOINTS } from '../../../src/core/api/endpoints';
import { notificationsService } from '../../../src/features/notifications/services/notifications.service';
import {
  getExpoPushToken,
  registerDeviceForPush,
  unregisterDeviceForPush,
} from '../../../src/features/notifications/push';
import { openNotificationTarget } from '../../../src/features/notifications/navigation';
import { formatBadge, formatRelativeTime } from '../../../src/features/notifications/utils/format';
import { NotificationBellButton } from '../../../src/features/notifications/components/NotificationBellButton';
import { NotificationsScreen } from '../../../src/features/notifications/screens/NotificationsScreen';
import type { AppNotification } from '../../../src/features/notifications/types/notification.types';

const api = apiClient as unknown as Record<'get' | 'post' | 'patch' | 'delete', jest.Mock>;
const ok = (data: unknown) => Promise.resolve({ data: { data, message: 'OK' } });

function notification(fields: Partial<AppNotification>): AppNotification {
  return {
    id: 'n1',
    type: 'task_due_soon',
    title: 'Échéance proche',
    body: '« Learning agreement » est à faire dans 5 jours.',
    data: { taskId: 't1' },
    isRead: false,
    readAt: null,
    createdAt: new Date().toISOString(),
    ...fields,
  };
}

const ITEMS = [
  notification({ id: 'n1' }),
  notification({ id: 'n2', type: 'invitation_accepted', title: 'Invitation acceptée', body: 'Lucas a rejoint École Démo.', isRead: true }),
];

function renderWithQuery(ui: React.ReactElement) {
  // gcTime: Infinity so no garbage-collection timer outlives the test.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  jest.clearAllMocks();
  api.get.mockImplementation((url: string, config?: { params?: { unreadOnly?: boolean } }) => {
    if (url === ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT) return ok({ count: 1 });
    const items = config?.params?.unreadOnly ? ITEMS.filter((n) => !n.isRead) : ITEMS;
    return ok({ items, unreadCount: 1 });
  });
  api.patch.mockImplementation(() => ok(ITEMS[0]));
  api.post.mockImplementation(() => ok({ updated: 1 }));
  api.delete.mockImplementation(() => Promise.resolve({}));
});

describe('notificationsService', () => {
  it('calls the notification endpoints', async () => {
    await notificationsService.list({ unreadOnly: true, limit: 5 });
    await notificationsService.markRead('n1');
    await notificationsService.markAllRead();
    await notificationsService.remove('n1');
    await notificationsService.registerPushToken('ExponentPushToken[x]', 'ios');
    await notificationsService.unregisterPushToken('ExponentPushToken[x]');

    expect(api.get).toHaveBeenCalledWith('/notifications', { params: { unreadOnly: true, limit: 5 } });
    expect(api.patch).toHaveBeenCalledWith('/notifications/n1/read');
    expect(api.post).toHaveBeenCalledWith('/notifications/read-all');
    expect(api.delete).toHaveBeenCalledWith('/notifications/n1');
    expect(api.post).toHaveBeenCalledWith('/notifications/push-tokens', { token: 'ExponentPushToken[x]', platform: 'ios' });
    expect(api.delete).toHaveBeenCalledWith('/notifications/push-tokens', { params: { token: 'ExponentPushToken[x]' } });
  });

  it('returns the unread count', async () => {
    await expect(notificationsService.unreadCount()).resolves.toBe(1);
  });
});

describe('format helpers', () => {
  const now = new Date('2026-11-06T12:00:00Z');
  it.each([
    ['2026-11-06T11:59:40Z', "à l'instant"],
    ['2026-11-06T11:55:00Z', 'il y a 5 min'],
    ['2026-11-06T09:00:00Z', 'il y a 3 h'],
    ['2026-11-05T10:00:00Z', 'hier'],
    ['2026-11-02T12:00:00Z', 'il y a 4 j'],
    ['2026-10-12T12:00:00Z', '12 oct.'],
  ])('%s → %s', (date, expected) => {
    expect(formatRelativeTime(date, now)).toBe(expected);
  });

  it('caps the badge', () => {
    expect(formatBadge(4)).toBe('4');
    expect(formatBadge(15)).toBe('9+');
  });
});

describe('push registration', () => {
  it('gets a token with the EAS project id and registers it', async () => {
    await expect(registerDeviceForPush()).resolves.toBe('ExponentPushToken[test-device]');

    expect(Notifications.getExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: 'project-123' });
    expect(api.post).toHaveBeenCalledWith('/notifications/push-tokens', {
      token: 'ExponentPushToken[test-device]',
      platform: 'ios',
    });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('push_token', 'ExponentPushToken[test-device]');
  });

  it('asks for permission and gives up if refused', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: false, status: 'undetermined' });
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: false, status: 'denied' });

    await expect(getExpoPushToken()).resolves.toBeNull();
    expect(Notifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
  });

  it('does nothing on a simulator', async () => {
    const device = jest.requireMock('expo-device') as { isDevice: boolean };
    device.isDevice = false;
    await expect(registerDeviceForPush()).resolves.toBeNull();
    device.isDevice = true;
    expect(api.post).not.toHaveBeenCalled();
  });

  it('never throws when the backend is unreachable', async () => {
    api.post.mockRejectedValueOnce(new Error('offline'));
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    await expect(registerDeviceForPush()).resolves.toBeNull();
    warn.mockRestore();
  });

  it('unregisters the stored token on logout', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('ExponentPushToken[old]');
    await unregisterDeviceForPush();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('push_token');
    expect(api.delete).toHaveBeenCalledWith('/notifications/push-tokens', { params: { token: 'ExponentPushToken[old]' } });
  });

  it('skips unregistering when this device never registered', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
    await unregisterDeviceForPush();
    expect(api.delete).not.toHaveBeenCalled();
  });
});

describe('openNotificationTarget', () => {
  it('opens the checklist for a reminder, the list otherwise, the B2B list for staff', () => {
    openNotificationTarget('task_overdue', 'student');
    openNotificationTarget('organization_invitation', 'student');
    openNotificationTarget('invitation_accepted', 'org_staff');

    expect(mockNavigate.mock.calls).toEqual([
      ['B2C', { screen: 'Tabs', params: { screen: 'Checklist' } }],
      ['B2C', { screen: 'Notifications' }],
      ['B2B', { screen: 'Notifications' }],
    ]);
  });
});

describe('NotificationBellButton', () => {
  it('shows the unread badge and opens the screen', async () => {
    const onPress = jest.fn();
    renderWithQuery(<NotificationBellButton onPress={onPress} />);

    expect(await screen.findByTestId('notification-badge')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Notifications, 1 non lues'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('NotificationsScreen', () => {
  it('lists notifications, filters unread and marks all as read', async () => {
    renderWithQuery(<NotificationsScreen />);
    expect(await screen.findByText('Invitation acceptée')).toBeTruthy();

    fireEvent.press(screen.getByText('Non lues (1)'));
    await waitFor(() => expect(screen.queryByText('Invitation acceptée')).toBeNull());
    expect(screen.getByText('Échéance proche')).toBeTruthy();

    fireEvent.press(screen.getByText('Tout lire'));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/notifications/read-all'));
  });

  it('tapping an unread reminder marks it read and opens the checklist', async () => {
    renderWithQuery(<NotificationsScreen />);
    fireEvent.press(await screen.findByText('Échéance proche'));

    await waitFor(() => expect(api.patch).toHaveBeenCalledWith('/notifications/n1/read'));
    expect(mockNavigate).toHaveBeenCalledWith('B2C', { screen: 'Tabs', params: { screen: 'Checklist' } });
  });

  it('asks before deleting', async () => {
    const alert = jest.spyOn(Alert, 'alert');
    renderWithQuery(<NotificationsScreen />);
    await screen.findByText('Invitation acceptée');

    fireEvent.press(screen.getAllByLabelText('Supprimer la notification')[1]);
    const buttons = alert.mock.calls[0][2] as { text: string; onPress?: () => void }[];
    await act(async () => buttons.find((b) => b.text === 'Supprimer')?.onPress?.());

    expect(api.delete).toHaveBeenCalledWith('/notifications/n2');
    alert.mockRestore();
  });

  it('shows the empty state', async () => {
    api.get.mockImplementation(() => ok({ items: [], unreadCount: 0 }));
    renderWithQuery(<NotificationsScreen />);
    expect(await screen.findByText('Aucune notification')).toBeTruthy();
    expect(screen.queryByText('Tout lire')).toBeNull();
  });
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock('../../../src/features/auth/services/auth.service', () => ({
  authService: { logout: jest.fn() },
}));

import { queryClient } from '../../../src/core/api/queryClient';
import { authService } from '../../../src/features/auth/services/auth.service';
import { clearLocalSession, logout } from '../../../src/features/auth/session';
import { useAuthStore } from '../../../src/features/auth/store/auth.store';
import { useMobilityStore } from '../../../src/features/mobility/store/mobility.store';
import type { AuthUser } from '../../../src/features/auth/types/auth.types';

const user: AuthUser = {
  id: 'u1',
  email: 'lucas@studafly.com',
  name: 'Lucas',
  role: 'student',
  institutionId: null,
  isPremium: false,
  emailVerified: false,
  oauthProvider: null,
  avatarEmoji: null,
  phone: null,
  enableNotifications: true,
  createdAt: '2026-09-30',
};

function signIn() {
  useAuthStore.getState().setUser(user, 'token');
  useMobilityStore.getState().setActiveMobilityId('m1');
  queryClient.setQueryData(['checklist', 'm1'], [{ id: 't1' }]);
}

describe('session', () => {
  beforeEach(() => jest.clearAllMocks());

  it('clearLocalSession forgets the user, the active mobility and cached queries', () => {
    signIn();
    clearLocalSession();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useMobilityStore.getState().activeMobilityId).toBeNull();
    expect(queryClient.getQueryData(['checklist', 'm1'])).toBeUndefined();
  });

  it('logout revokes the session server-side then clears it locally', async () => {
    signIn();
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    await logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('logout still clears the local session when the API call fails', async () => {
    signIn();
    (authService.logout as jest.Mock).mockRejectedValue(new Error('offline'));

    await logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

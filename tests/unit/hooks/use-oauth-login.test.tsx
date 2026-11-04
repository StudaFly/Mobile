import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock('../../../src/features/auth/services/auth.service', () => ({
  authService: { oauthLogin: jest.fn() },
}));
jest.mock('../../../src/features/auth/services/googleSignIn.service', () => ({
  googleSignInService: { getIdToken: jest.fn(), signOut: jest.fn() },
}));

import * as SecureStore from 'expo-secure-store';
import { useOAuthLogin } from '../../../src/features/auth/hooks/useLogin';
import { authService } from '../../../src/features/auth/services/auth.service';
import { googleSignInService } from '../../../src/features/auth/services/googleSignIn.service';
import { useAuthStore } from '../../../src/features/auth/store/auth.store';
import type { AuthUser } from '../../../src/features/auth/types/auth.types';

const user: AuthUser = {
  id: 'u1',
  email: 'lucas@gmail.com',
  name: 'Lucas Martin',
  role: 'student',
  institutionId: null,
  isPremium: false,
  emailVerified: true,
  oauthProvider: 'google',
  avatarEmoji: null,
  phone: null,
  enableNotifications: true,
  createdAt: '2026-11-04',
};

const mockGetIdToken = googleSignInService.getIdToken as jest.Mock;
const mockOAuthLogin = authService.oauthLogin as jest.Mock;

function renderOAuthLogin() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return renderHook(() => useOAuthLogin(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe('useOAuthLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
    mockGetIdToken.mockResolvedValue('google-id-token');
  });

  it('signs an existing Google user straight into the app', async () => {
    mockOAuthLogin.mockResolvedValue({ user, accessToken: 'a', refreshToken: 'r', isNewUser: false });
    const { result } = renderOAuthLogin();

    await act(async () => {
      result.current.mutate('google');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockOAuthLogin).toHaveBeenCalledWith({ provider: 'google', idToken: 'google-id-token' });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(expect.any(String), 'a');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(expect.any(String), 'r');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.id).toBe('u1');
  });

  it('keeps a new Google user pending for the onboarding', async () => {
    mockOAuthLogin.mockResolvedValue({ user, accessToken: 'a', refreshToken: 'r', isNewUser: true });
    const { result } = renderOAuthLogin();

    await act(async () => {
      result.current.mutate('google');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.pendingUser?.id).toBe('u1');
    expect(state.pendingToken).toBe('a');
  });

  it('does not call the API when the Google sign-in fails', async () => {
    mockGetIdToken.mockRejectedValue(new Error('Connexion Google annulée'));
    const { result } = renderOAuthLogin();

    await act(async () => {
      result.current.mutate('google');
    });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockOAuthLogin).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it.each(['apple', 'microsoft'] as const)('announces %s as coming soon', async (provider) => {
    const { result } = renderOAuthLogin();

    await act(async () => {
      result.current.mutate(provider);
    });
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toContain('arrive bientôt');
    expect(mockGetIdToken).not.toHaveBeenCalled();
    expect(mockOAuthLogin).not.toHaveBeenCalled();
  });
});

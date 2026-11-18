import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));
jest.mock('../../../src/core/storage/secureStorage', () => ({
  secureStorage: {
    setToken: jest.fn(() => Promise.resolve()),
    setRefreshToken: jest.fn(() => Promise.resolve()),
    clearTokens: jest.fn(() => Promise.resolve()),
  },
}));
jest.mock('../../../src/features/auth/services/googleSignIn.service', () => ({
  googleSignInService: { getIdToken: jest.fn() },
}));

import apiClient from '../../../src/core/api/client';
import { ENDPOINTS } from '../../../src/core/api/endpoints';
import { secureStorage } from '../../../src/core/storage/secureStorage';
import { useOAuthLogin } from '../../../src/features/auth/hooks/useLogin';
import { googleSignInService } from '../../../src/features/auth/services/googleSignIn.service';
import { useAuthStore } from '../../../src/features/auth/store/auth.store';

const mockPost = apiClient.post as jest.Mock;
const mockGetIdToken = googleSignInService.getIdToken as jest.Mock;

const user = { id: 'u1', email: 'lucas@gmail.com', name: 'Lucas', role: 'student' };

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useOAuthLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it('sends the Google ID token to the backend and opens the session', async () => {
    mockGetIdToken.mockResolvedValue('google-id-token');
    mockPost.mockResolvedValue({ data: { data: { user, accessToken: 'access', refreshToken: 'refresh' } } });
    const { result } = renderHook(() => useOAuthLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate('google');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).toHaveBeenCalledWith(ENDPOINTS.AUTH_OAUTH_GOOGLE, { idToken: 'google-id-token' });
    expect(secureStorage.setToken).toHaveBeenCalledWith('access');
    expect(secureStorage.setRefreshToken).toHaveBeenCalledWith('refresh');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('does nothing when the user cancels the Google sign-in', async () => {
    mockGetIdToken.mockResolvedValue(null);
    const { result } = renderHook(() => useOAuthLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate('google');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPost).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('surfaces Google sign-in errors', async () => {
    mockGetIdToken.mockRejectedValue(new Error('La connexion avec Google a échoué. Réessaie.'));
    const { result } = renderHook(() => useOAuthLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate('google');
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('Google');
    expect(mockPost).not.toHaveBeenCalled();
  });

  it.each(['apple', 'microsoft'] as const)('reports %s as not available yet', async (provider) => {
    const { result } = renderHook(() => useOAuthLogin(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.mutate(provider);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Cette méthode de connexion arrive bientôt.');
    expect(mockGetIdToken).not.toHaveBeenCalled();
  });
});

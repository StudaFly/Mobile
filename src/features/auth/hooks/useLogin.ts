import { useMutation } from '@tanstack/react-query';
import { authService, AuthResponse } from '../services/auth.service';
import { googleSignInService } from '../services/googleSignIn.service';
import { OAuthProvider } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';
import { secureStorage } from '@/core/storage/secureStorage';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: async ({ user, accessToken, refreshToken }) => {
      await secureStorage.setToken(accessToken);
      await secureStorage.setRefreshToken(refreshToken);
      setUser(user, accessToken);
    },
  });
}

async function getProviderIdToken(provider: OAuthProvider): Promise<string | null> {
  if (provider === 'google') return googleSignInService.getIdToken();
  // Backend: /auth/oauth/microsoft and /auth/oauth/apple are not implemented yet.
  throw new Error('Cette méthode de connexion arrive bientôt.');
}

/**
 * Runs the provider's native sign-in, then exchanges its ID token for a StudaFly session.
 * Resolves to null (nothing happens) when the user cancels the provider sign-in.
 */
export function useOAuthLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (provider: OAuthProvider): Promise<AuthResponse | null> => {
      const idToken = await getProviderIdToken(provider);
      if (!idToken) return null;
      return authService.oauthLogin({ provider, idToken });
    },
    onSuccess: async (auth) => {
      if (!auth) return;
      const { user, accessToken, refreshToken } = auth;
      await secureStorage.setToken(accessToken);
      await secureStorage.setRefreshToken(refreshToken);
      setUser(user, accessToken);
    },
  });
}

export function useRegister() {
  const setPendingAuth = useAuthStore((s) => s.setPendingAuth);
  return useMutation({
    mutationFn: authService.register,
    onSuccess: async ({ user, accessToken, refreshToken }) => {
      await secureStorage.setToken(accessToken);
      await secureStorage.setRefreshToken(refreshToken);
      setPendingAuth(user, accessToken);
    },
  });
}

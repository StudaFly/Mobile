import { useMutation } from '@tanstack/react-query';
import { authService, type AuthResponse } from '../services/auth.service';
import { googleSignInService } from '../services/googleSignIn.service';
import { useAuthStore } from '../store/auth.store';
import { OAuthProvider } from '../types/auth.types';
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

const OAUTH_COMING_SOON: Record<Exclude<OAuthProvider, 'google'>, string> = {
  apple: 'La connexion avec Apple arrive bientôt.',
  microsoft: 'La connexion avec Microsoft arrive bientôt.',
};

async function oauthSignIn(provider: OAuthProvider): Promise<AuthResponse> {
  if (provider !== 'google') throw new Error(OAUTH_COMING_SOON[provider]);
  const idToken = await googleSignInService.getIdToken();
  return authService.oauthLogin({ provider, idToken });
}

/**
 * Sign in with a provider. An existing user enters the app right away; a new one
 * stays in the auth stack (pending) to go through CreateProfile → Onboarding.
 */
export function useOAuthLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const setPendingAuth = useAuthStore((s) => s.setPendingAuth);
  return useMutation({
    mutationFn: oauthSignIn,
    onSuccess: async ({ user, accessToken, refreshToken, isNewUser }) => {
      await secureStorage.setToken(accessToken);
      await secureStorage.setRefreshToken(refreshToken);
      if (isNewUser) setPendingAuth(user, accessToken);
      else setUser(user, accessToken);
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

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
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

export function useOAuthLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authService.oauthLogin,
    onSuccess: async ({ user, accessToken, refreshToken }) => {
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

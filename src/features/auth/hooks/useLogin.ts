import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ user, accessToken }) => setUser(user, accessToken),
  });
}

export function useOAuthLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: authService.oauthLogin,
    onSuccess: ({ user, accessToken }) => setUser(user, accessToken),
  });
}

export function useRegister() {
  const setPendingAuth = useAuthStore((s) => s.setPendingAuth);
  return useMutation({
    mutationFn: authService.register,
    onSuccess: ({ user, accessToken }) => setPendingAuth(user, accessToken),
  });
}

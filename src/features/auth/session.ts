import { queryClient } from '@/core/api/queryClient';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';
import { authService } from './services/auth.service';
import { useAuthStore } from './store/auth.store';

export function clearLocalSession(): void {
  useAuthStore.getState().clearAuth();
  useMobilityStore.getState().reset();
  queryClient.clear();
}

export async function logout(): Promise<void> {
  try {
    await authService.logout();
  } catch {
    // Already expired or offline: the refresh token expires server-side anyway.
  }
  clearLocalSession();
}

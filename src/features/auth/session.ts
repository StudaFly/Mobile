import { queryClient } from '@/core/api/queryClient';
import { useMobilityStore } from '@/features/mobility/store/mobility.store';
import { unregisterDeviceForPush } from '@/features/notifications/push';
import { authService } from './services/auth.service';
import { googleSignInService } from './services/googleSignIn.service';
import { useAuthStore } from './store/auth.store';

export function clearLocalSession(): void {
  void googleSignInService.signOut();
  useAuthStore.getState().clearAuth();
  useMobilityStore.getState().reset();
  queryClient.clear();
}

export async function logout(): Promise<void> {
  // While still authenticated, so the next account on this phone doesn't get our pushes.
  await unregisterDeviceForPush();
  try {
    await authService.logout();
  } catch {
    // Already expired or offline: the refresh token expires server-side anyway.
  }
  clearLocalSession();
}

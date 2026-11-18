import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, clearLocalSession } from '@/features/auth';
import { userService, type UpdateProfilePayload } from '../services/user.service';

export function useProfile() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.patchMe(payload),
    onSuccess: (updated) => setUser(updated, token ?? ''),
  });

  const deleteAccount = useMutation({
    mutationFn: () => userService.deleteMe(),
    onSuccess: () => {
      queryClient.clear();
      clearLocalSession();
    },
  });

  return { user, updateProfile, deleteAccount };
}


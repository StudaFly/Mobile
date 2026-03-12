import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import { AuthUser } from '@/features/auth/types/auth.types';

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone?: string;
  institution?: string;
  enableNotifications: boolean;
  avatarEmoji?: string;
  profilePictureUri?: string;
}

export const userService = {
  async getMe(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>(ENDPOINTS.USERS_ME);
    return data.data;
  },

  async patchMe(payload: UpdateProfilePayload): Promise<AuthUser> {
    const { data } = await apiClient.patch<ApiResponse<AuthUser>>(ENDPOINTS.USERS_ME, payload);
    return data.data;
  },
};

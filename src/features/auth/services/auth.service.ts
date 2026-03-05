import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import { AuthUser, LoginPayload } from '../types/auth.types';

interface AuthResponse { user: AuthUser; accessToken: string; refreshToken: string; }

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH_LOGIN, payload);
    return data.data;
  },
  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH_LOGOUT);
  },
};

import apiClient from '@/core/api/client';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ApiResponse } from '@/core/api/types/api.types';
import { AuthUser, LoginPayload, OAuthLoginPayload, OAuthProvider, RegisterPayload } from '../types/auth.types';

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

const OAUTH_ENDPOINTS: Record<OAuthProvider, string> = {
  google: ENDPOINTS.AUTH_OAUTH_GOOGLE,
  microsoft: ENDPOINTS.AUTH_OAUTH_MICROSOFT,
  apple: ENDPOINTS.AUTH_OAUTH_APPLE,
};


export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH_LOGIN, payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH_REGISTER, payload);
    return data.data;
  },

  async oauthLogin(payload: OAuthLoginPayload): Promise<AuthResponse> {
    const endpoint = OAUTH_ENDPOINTS[payload.provider];
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(endpoint, { token: payload.mockToken });
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH_LOGOUT);
  },
};

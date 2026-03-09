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

// Mock response used in development when no backend is available
function buildMockResponse(overrides: Partial<AuthUser> = {}): AuthResponse {
  return {
    user: {
      id: 'mock-user-1',
      email: overrides.email ?? 'lucas@studafly.com',
      name: overrides.name ?? 'Lucas Martin',
      role: 'student',
      isPremium: false,
      createdAt: new Date().toISOString(),
      ...overrides,
    },
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (__DEV__) {
      return buildMockResponse({ email: payload.email });
    }
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH_LOGIN, payload);
    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (__DEV__) {
      return buildMockResponse({ email: payload.email, name: payload.name });
    }
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(ENDPOINTS.AUTH_REGISTER, payload);
    return data.data;
  },

  async oauthLogin(payload: OAuthLoginPayload): Promise<AuthResponse> {
    if (__DEV__) {
      return buildMockResponse({ email: `${payload.provider}@studafly.com` });
    }
    const endpoint = OAUTH_ENDPOINTS[payload.provider];
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(endpoint, { token: payload.mockToken });
    return data.data;
  },

  async logout(): Promise<void> {
    if (__DEV__) return;
    await apiClient.post(ENDPOINTS.AUTH_LOGOUT);
  },
};

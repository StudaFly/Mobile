import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

const apiClient = axios.create({
  baseURL: env.BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const sessionExpiredListeners = new Set<() => void>();

export function onSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await secureStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await axios.post(`${env.BASE_URL}/auth/refresh`, { refreshToken }, { timeout: 15_000 });
  await secureStorage.setToken(data.data.accessToken);
  await secureStorage.setRefreshToken(data.data.refreshToken);
  return data.data.accessToken;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthCall = config?.url?.startsWith('/auth/') ?? false;
    if (error.response?.status !== 401 || !config || config._retry || isAuthCall) {
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return apiClient(config);
    } catch {
      await secureStorage.clearTokens();
      sessionExpiredListeners.forEach((listener) => listener());
      return Promise.reject(error);
    }
  },
);

export default apiClient;

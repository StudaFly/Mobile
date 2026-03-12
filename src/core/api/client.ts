import axios from 'axios';
import { env } from '@/core/config/env';
import { secureStorage } from '@/core/storage/secureStorage';

const apiClient = axios.create({
  baseURL: env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = await secureStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${env.BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          await secureStorage.setToken(data.data.accessToken);
          error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return apiClient(error.config);
        } catch {
          await secureStorage.clearTokens();
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

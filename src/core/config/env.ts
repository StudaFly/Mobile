import Constants from 'expo-constants';

export type ApiUrlSource = 'app-config' | 'env' | 'metro-host' | 'localhost';

interface Env {
  BASE_URL: string;
  BASE_URL_SOURCE: ApiUrlSource;
}

const API_PORT = 8080;
const API_PREFIX = '/api/v1';

const isTunnelHost = (host: string) => host.endsWith('.exp.direct') || host.includes('ngrok');

export function resolveApiUrl(): { url: string; source: ApiUrlSource } {
  const fromConfig = Constants.expoConfig?.extra?.BASE_URL as string | undefined;
  if (fromConfig) return { url: fromConfig, source: 'app-config' };

  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return { url: fromEnv, source: 'env' };

  const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (devHost && !isTunnelHost(devHost)) {
    return { url: `http://${devHost}:${API_PORT}${API_PREFIX}`, source: 'metro-host' };
  }

  return { url: `http://localhost:${API_PORT}${API_PREFIX}`, source: 'localhost' };
}

export function resolveBaseUrl(): string {
  return resolveApiUrl().url;
}

const resolved = resolveApiUrl();

export const env: Env = {
  BASE_URL: resolved.url,
  BASE_URL_SOURCE: resolved.source,
};

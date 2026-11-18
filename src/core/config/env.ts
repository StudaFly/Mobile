import Constants from 'expo-constants';

export type ApiUrlSource = 'app-config' | 'env' | 'metro-host' | 'localhost';

interface Env {
  BASE_URL: string;
  BASE_URL_SOURCE: ApiUrlSource;
  /** OAuth "Web application" client ID: audience of the ID token, must equal the backend GOOGLE_CLIENT_ID. */
  GOOGLE_WEB_CLIENT_ID: string;
  /** OAuth iOS client ID (its reversed form is the iosUrlScheme of app.json). */
  GOOGLE_IOS_CLIENT_ID: string;
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

const resolved = resolveApiUrl();

export const env: Env = {
  BASE_URL: resolved.url,
  BASE_URL_SOURCE: resolved.source,
  // Literal process.env.EXPO_PUBLIC_* accesses: Expo inlines them at build time.
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
};

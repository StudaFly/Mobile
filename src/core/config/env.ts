import Constants from 'expo-constants';

interface Env {
  BASE_URL: string;
}

export const env: Env = {
  BASE_URL:
    (Constants.expoConfig?.extra?.BASE_URL as string | undefined) ??
    process.env.EXPO_PUBLIC_API_URL ??
    'http://localhost:8080/api/v1',
};

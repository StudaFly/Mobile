import Constants from 'expo-constants';

interface Env {
  BASE_URL: string;
}

export const env: Env = {
  BASE_URL: (Constants.expoConfig?.extra?.BASE_URL as string) ?? 'http://localhost:8000/api/v1',
};

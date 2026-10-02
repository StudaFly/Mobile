const mockExpoConfig: { extra?: Record<string, string>; hostUri?: string } = {};
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    get expoConfig() {
      return mockExpoConfig;
    },
  },
}));

import { resolveApiUrl, resolveBaseUrl } from '../../../src/core/config/env';

describe('resolveBaseUrl', () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;

  beforeEach(() => {
    delete mockExpoConfig.extra;
    delete mockExpoConfig.hostUri;
    delete process.env.EXPO_PUBLIC_API_URL;
  });

  afterAll(() => {
    process.env.EXPO_PUBLIC_API_URL = originalEnv;
  });

  it('prefers extra.BASE_URL from the app config', () => {
    mockExpoConfig.extra = { BASE_URL: 'https://api.studafly.com/api/v1' };
    process.env.EXPO_PUBLIC_API_URL = 'http://ignored';
    expect(resolveBaseUrl()).toBe('https://api.studafly.com/api/v1');
  });

  it('then uses EXPO_PUBLIC_API_URL', () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://10.0.2.2:8080/api/v1';
    mockExpoConfig.hostUri = '192.168.1.20:8081';
    expect(resolveBaseUrl()).toBe('http://10.0.2.2:8080/api/v1');
  });

  it('then targets the machine running Metro in development', () => {
    mockExpoConfig.hostUri = '192.168.1.20:8081';
    expect(resolveBaseUrl()).toBe('http://192.168.1.20:8080/api/v1');
  });

  it('falls back to localhost', () => {
    expect(resolveApiUrl()).toEqual({ url: 'http://localhost:8080/api/v1', source: 'localhost' });
  });

  it('never derives the API from an Expo tunnel host (the API is not there)', () => {
    mockExpoConfig.hostUri = 'abc-anonymous-8081.exp.direct:80';
    expect(resolveApiUrl().source).toBe('localhost');
  });

  it('uses the URL given by `pnpm start:tunnel` in tunnel mode', () => {
    mockExpoConfig.hostUri = 'abc-anonymous-8081.exp.direct:80';
    process.env.EXPO_PUBLIC_API_URL = 'https://1234.ngrok-free.app/api/v1';
    expect(resolveApiUrl()).toEqual({ url: 'https://1234.ngrok-free.app/api/v1', source: 'env' });
  });
});

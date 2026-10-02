import axios, { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';

const mockStore = new Map<string, string>();
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockStore.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStore.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockStore.delete(key);
  }),
}));

import apiClient, { onSessionExpired } from '../../../src/core/api/client';
import { secureStorage } from '../../../src/core/storage/secureStorage';

function respond(config: InternalAxiosRequestConfig, status: number, data: unknown = {}) {
  const response = { data, status, statusText: String(status), headers: {}, config };
  if (status >= 400) {
    return Promise.reject(new AxiosError('error', String(status), config, null, response));
  }
  return Promise.resolve(response);
}

function backendAccepting(validToken: string): AxiosAdapter {
  return (config) =>
    String(config.headers.Authorization) === `Bearer ${validToken}`
      ? respond(config, 200, { data: 'ok' })
      : respond(config, 401);
}

describe('apiClient refresh flow', () => {
  const originalAdapter = apiClient.defaults.adapter;

  beforeEach(async () => {
    mockStore.clear();
    await secureStorage.setToken('expired');
    await secureStorage.setRefreshToken('refresh-1');
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
    jest.restoreAllMocks();
  });

  it('refreshes on 401, stores the rotated tokens and replays the request', async () => {
    apiClient.defaults.adapter = backendAccepting('access-2');
    const post = jest.spyOn(axios, 'post').mockResolvedValue({
      data: { data: { accessToken: 'access-2', refreshToken: 'refresh-2' } },
    });

    const res = await apiClient.get('/users/me');

    expect(res.data).toEqual({ data: 'ok' });
    expect(post).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/refresh$/),
      { refreshToken: 'refresh-1' },
      expect.anything(),
    );
    expect(await secureStorage.getToken()).toBe('access-2');
    expect(await secureStorage.getRefreshToken()).toBe('refresh-2');
  });

  it('shares a single refresh between concurrent 401s', async () => {
    apiClient.defaults.adapter = backendAccepting('access-2');
    const post = jest.spyOn(axios, 'post').mockResolvedValue({
      data: { data: { accessToken: 'access-2', refreshToken: 'refresh-2' } },
    });

    await Promise.all([apiClient.get('/a'), apiClient.get('/b'), apiClient.get('/c')]);

    expect(post).toHaveBeenCalledTimes(1);
  });

  it('clears the tokens and notifies listeners when the refresh fails', async () => {
    apiClient.defaults.adapter = backendAccepting('never');
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('401'));
    const listener = jest.fn();
    const unsubscribe = onSessionExpired(listener);

    await expect(apiClient.get('/users/me')).rejects.toBeInstanceOf(AxiosError);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(await secureStorage.getRefreshToken()).toBeNull();
    unsubscribe();
  });

  it('does not refresh on auth endpoints (wrong password)', async () => {
    apiClient.defaults.adapter = backendAccepting('never');
    const post = jest.spyOn(axios, 'post');

    await expect(apiClient.post('/auth/login', {})).rejects.toBeInstanceOf(AxiosError);

    expect(post).not.toHaveBeenCalled();
    expect(await secureStorage.getRefreshToken()).toBe('refresh-1');
  });
});

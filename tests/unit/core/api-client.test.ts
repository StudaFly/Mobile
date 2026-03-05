jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: { BASE_URL: 'http://test-api.example.com/api/v1' },
    },
  },
}));

import apiClient from '../../../src/core/api/client';

describe('apiClient', () => {
  it('is defined', () => {
    expect(apiClient).toBeDefined();
  });

  it('has the correct baseURL from env', () => {
    expect(apiClient.defaults.baseURL).toBe('http://test-api.example.com/api/v1');
  });

  it('has Content-Type set to application/json', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});

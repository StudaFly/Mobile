// Cover the __DEV__ = true (mock) branches of auth.service.ts
// The existing auth-service.test.ts covers the __DEV__ = false (real API) paths.
// This file ensures the mock/dev paths are explicitly tested too.

jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

import { authService } from '../../../src/features/auth/services/auth.service';
import apiClientModule from '../../../src/core/api/client';

const apiClient = apiClientModule as unknown as { post: jest.Mock };

describe('authService — __DEV__ = true (mock) branches', () => {
  beforeAll(() => {
    (globalThis as Record<string, unknown>).__DEV__ = true;
  });

  afterAll(() => {
    (globalThis as Record<string, unknown>).__DEV__ = false;
  });

  describe('login (mock path)', () => {
    it('returns mock response without calling apiClient', async () => {
      const result = await authService.login({ email: 'test@example.com', password: 'secret' });

      expect(apiClient.post).not.toHaveBeenCalled();
      expect(result.user.email).toBe('test@example.com');
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });

    it('uses provided email in mock user', async () => {
      const result = await authService.login({ email: 'custom@studafly.com', password: 'pw' });

      expect(result.user.email).toBe('custom@studafly.com');
      expect(result.user.role).toBe('student');
      expect(result.user.isPremium).toBe(false);
    });
  });

  describe('register (mock path)', () => {
    it('returns mock response without calling apiClient', async () => {
      const result = await authService.register({ email: 'new@example.com', password: 'pass', name: 'Alice' });

      expect(apiClient.post).not.toHaveBeenCalled();
      expect(result.user.email).toBe('new@example.com');
      expect(result.user.name).toBe('Alice');
    });

    it('returns valid tokens in mock response', async () => {
      const result = await authService.register({ email: 'a@b.com', password: 'pw', name: 'Bob' });

      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });
  });

  describe('oauthLogin (mock path)', () => {
    it('returns mock google response without calling apiClient', async () => {
      const result = await authService.oauthLogin({ provider: 'google', mockToken: 'g-token' });

      expect(apiClient.post).not.toHaveBeenCalled();
      expect(result.user.email).toBe('google@studafly.com');
      expect(result.accessToken).toBe('mock-access-token');
    });

    it('returns mock microsoft response', async () => {
      const result = await authService.oauthLogin({ provider: 'microsoft', mockToken: 'ms-token' });

      expect(result.user.email).toBe('microsoft@studafly.com');
      expect(result.accessToken).toBe('mock-access-token');
    });

    it('returns mock apple response', async () => {
      const result = await authService.oauthLogin({ provider: 'apple', mockToken: 'apple-token' });

      expect(result.user.email).toBe('apple@studafly.com');
    });
  });

  describe('logout (mock path)', () => {
    it('returns without calling apiClient', async () => {
      await authService.logout();

      expect(apiClient.post).not.toHaveBeenCalled();
    });
  });
});

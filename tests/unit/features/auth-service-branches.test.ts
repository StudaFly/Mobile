// Cover the error/rejection branches of auth.service.ts
// The auth-service.test.ts covers all success paths.
// This file ensures API rejections are properly propagated.

jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

import { authService } from '../../../src/features/auth/services/auth.service';
import apiClientModule from '../../../src/core/api/client';

const apiClient = apiClientModule as unknown as { post: jest.Mock };

describe('authService — error branches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('propagates rejection when API fails', async () => {
      apiClient.post.mockRejectedValue(new Error('Network error'));

      await expect(
        authService.login({ email: 'a@b.com', password: 'pw' }),
      ).rejects.toThrow('Network error');
    });

    it('propagates rejection with 401 status', async () => {
      const error = Object.assign(new Error('Unauthorized'), {
        response: { status: 401, data: { error: { message: 'Invalid credentials' } } },
      });
      apiClient.post.mockRejectedValue(error);

      await expect(
        authService.login({ email: 'bad@b.com', password: 'wrong' }),
      ).rejects.toThrow('Unauthorized');
    });
  });

  describe('register', () => {
    it('propagates rejection when API fails', async () => {
      apiClient.post.mockRejectedValue(new Error('Server error'));

      await expect(
        authService.register({ email: 'new@b.com', password: 'pw', name: 'Alice' }),
      ).rejects.toThrow('Server error');
    });

    it('propagates rejection with 409 (email already taken)', async () => {
      const error = Object.assign(new Error('Conflict'), {
        response: { status: 409, data: { error: { message: 'Email already taken' } } },
      });
      apiClient.post.mockRejectedValue(error);

      await expect(
        authService.register({ email: 'taken@b.com', password: 'pw', name: 'Bob' }),
      ).rejects.toThrow('Conflict');
    });
  });

  describe('oauthLogin', () => {
    it('propagates rejection for google when API fails', async () => {
      apiClient.post.mockRejectedValue(new Error('OAuth error'));

      await expect(
        authService.oauthLogin({ provider: 'google', mockToken: 'bad-token' }),
      ).rejects.toThrow('OAuth error');
    });

    it('propagates rejection for microsoft when API fails', async () => {
      apiClient.post.mockRejectedValue(new Error('OAuth error'));

      await expect(
        authService.oauthLogin({ provider: 'microsoft', mockToken: 'bad-token' }),
      ).rejects.toThrow('OAuth error');
    });

    it('propagates rejection for apple when API fails', async () => {
      apiClient.post.mockRejectedValue(new Error('OAuth error'));

      await expect(
        authService.oauthLogin({ provider: 'apple', mockToken: 'bad-token' }),
      ).rejects.toThrow('OAuth error');
    });
  });

  describe('logout', () => {
    it('propagates rejection when API fails', async () => {
      apiClient.post.mockRejectedValue(new Error('Logout failed'));

      await expect(authService.logout()).rejects.toThrow('Logout failed');
    });
  });
});

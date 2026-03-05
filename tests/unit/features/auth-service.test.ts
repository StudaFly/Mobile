jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

import apiClient from '../../../src/core/api/client';
import { authService } from '../../../src/features/auth/services/auth.service';
import { ENDPOINTS } from '../../../src/core/api/endpoints';

const mockPost = apiClient.post as jest.Mock;

const mockAuthResponse = {
  user: { id: '1', email: 'test@test.com', name: 'Test', role: 'student', isPremium: false, createdAt: '2024' },
  accessToken: 'access123',
  refreshToken: 'refresh123',
};

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('calls POST to AUTH_LOGIN endpoint with payload', async () => {
      mockPost.mockResolvedValue({ data: { data: mockAuthResponse } });
      const payload = { email: 'test@test.com', password: 'password123' };

      const result = await authService.login(payload);

      expect(mockPost).toHaveBeenCalledWith(ENDPOINTS.AUTH_LOGIN, payload);
      expect(result).toEqual(mockAuthResponse);
    });

    it('returns user and tokens from response', async () => {
      mockPost.mockResolvedValue({ data: { data: mockAuthResponse } });
      const result = await authService.login({ email: 'a@b.com', password: 'pw' });

      expect(result.accessToken).toBe('access123');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('logout', () => {
    it('calls POST to AUTH_LOGOUT endpoint', async () => {
      mockPost.mockResolvedValue({});
      await authService.logout();
      expect(mockPost).toHaveBeenCalledWith(ENDPOINTS.AUTH_LOGOUT);
    });
  });
});

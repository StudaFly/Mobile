import { ENDPOINTS } from '../../../src/core/api/endpoints';

describe('ENDPOINTS', () => {
  describe('auth endpoints', () => {
    it('has correct static auth endpoints', () => {
      expect(ENDPOINTS.AUTH_LOGIN).toBe('/auth/login');
      expect(ENDPOINTS.AUTH_REGISTER).toBe('/auth/register');
      expect(ENDPOINTS.AUTH_OAUTH_GOOGLE).toBe('/auth/oauth/google');
      expect(ENDPOINTS.AUTH_OAUTH_MICROSOFT).toBe('/auth/oauth/microsoft');
      expect(ENDPOINTS.AUTH_OAUTH_APPLE).toBe('/auth/oauth/apple');
      expect(ENDPOINTS.AUTH_REFRESH).toBe('/auth/refresh');
      expect(ENDPOINTS.AUTH_LOGOUT).toBe('/auth/logout');
    });
  });

  describe('user endpoints', () => {
    it('has correct user endpoints', () => {
      expect(ENDPOINTS.USERS_ME).toBe('/users/me');
      expect(ENDPOINTS.USERS_ME_EXPORT).toBe('/users/me/export');
    });
  });

  describe('mobility endpoints', () => {
    it('has correct static mobility endpoint', () => {
      expect(ENDPOINTS.MOBILITIES).toBe('/mobilities');
    });

    it('generates correct dynamic mobility endpoints', () => {
      expect(ENDPOINTS.MOBILITY_BY_ID('abc')).toBe('/mobilities/abc');
      expect(ENDPOINTS.MOBILITY_TIMELINE('123')).toBe('/mobilities/123/timeline');
      expect(ENDPOINTS.MOBILITY_PROGRESS('xyz')).toBe('/mobilities/xyz/progress');
    });
  });

  describe('task endpoints', () => {
    it('generates correct task endpoints', () => {
      expect(ENDPOINTS.MOBILITY_TASKS('mob1')).toBe('/mobilities/mob1/tasks');
      expect(ENDPOINTS.TASK_BY_ID('task1')).toBe('/tasks/task1');
      expect(ENDPOINTS.TASK_COMPLETE('task2')).toBe('/tasks/task2/complete');
    });
  });

  describe('document endpoints', () => {
    it('generates correct document endpoints', () => {
      expect(ENDPOINTS.MOBILITY_DOCUMENTS('mob1')).toBe('/mobilities/mob1/documents');
      expect(ENDPOINTS.DOCUMENT_BY_ID('doc1')).toBe('/documents/doc1');
    });
  });

  describe('destination endpoints', () => {
    it('has correct destination endpoints', () => {
      expect(ENDPOINTS.DESTINATIONS).toBe('/destinations');
      expect(ENDPOINTS.DESTINATION_BUDGET('dest1')).toBe('/destinations/dest1/budget');
      expect(ENDPOINTS.DESTINATION_GUIDE('dest1')).toBe('/destinations/dest1/guide');
    });
  });
});

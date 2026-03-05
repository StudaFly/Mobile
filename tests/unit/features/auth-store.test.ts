import { useAuthStore } from '../../../src/features/auth/store/auth.store';

const mockUser = {
  id: 'user-1',
  email: 'lucas@test.com',
  name: 'Lucas',
  role: 'student' as const,
  isPremium: false,
  createdAt: '2024-01-01',
};

describe('useAuthStore', () => {
  afterEach(() => {
    useAuthStore.setState({ user: null, token: null, role: null, isAuthenticated: false });
  });

  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.role).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  describe('setUser', () => {
    it('sets user, token, role and marks as authenticated', () => {
      useAuthStore.getState().setUser(mockUser, 'access-token-123');
      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('access-token-123');
      expect(state.role).toBe('student');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('clearAuth', () => {
    it('resets all auth state to null', () => {
      useAuthStore.getState().setUser(mockUser, 'token');
      useAuthStore.getState().clearAuth();
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.role).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});

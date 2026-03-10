import { useAuthStore } from '../../../src/features/auth/store/auth.store';
import { AuthUser } from '../../../src/features/auth/types/auth.types';

const mockUser: AuthUser = {
  id: 'user-42',
  email: 'lucas@studafly.com',
  name: 'Lucas',
  role: 'student',
  isPremium: false,
  createdAt: '2025-01-01',
};

describe('useAuthStore — completePendingAuth branch coverage', () => {
  afterEach(() => {
    // Reset the entire store state after each test
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      pendingUser: null,
      pendingToken: null,
    });
  });

  describe('completePendingAuth — when pendingUser and pendingToken are null (empty {} branch)', () => {
    it('does NOT set isAuthenticated when no pending auth exists', () => {
      // Ensure pending fields are null
      const stateBefore = useAuthStore.getState();
      expect(stateBefore.pendingUser).toBeNull();
      expect(stateBefore.pendingToken).toBeNull();

      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      expect(stateAfter.isAuthenticated).toBe(false);
      expect(stateAfter.user).toBeNull();
      expect(stateAfter.token).toBeNull();
      expect(stateAfter.role).toBeNull();
    });

    it('does NOT modify user when pending state is null', () => {
      // Pre-set a user via setUser, then call completePendingAuth without pending
      useAuthStore.getState().setUser(mockUser, 'existing-token');
      // Now clear pending to simulate the null branch
      useAuthStore.setState({ pendingUser: null, pendingToken: null });

      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      // setUser had set these; completePendingAuth with null pending should return {}
      // so state remains unchanged
      expect(stateAfter.user).toEqual(mockUser);
      expect(stateAfter.token).toBe('existing-token');
      expect(stateAfter.isAuthenticated).toBe(true);
    });

    it('returns empty object branch when only pendingToken is null', () => {
      useAuthStore.setState({ pendingUser: mockUser, pendingToken: null });

      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      // condition is pendingUser && pendingToken, so false branch applies
      expect(stateAfter.isAuthenticated).toBe(false);
      // pendingUser remains (not cleared by the {} branch)
      expect(stateAfter.pendingUser).toEqual(mockUser);
    });

    it('returns empty object branch when only pendingUser is null', () => {
      useAuthStore.setState({ pendingUser: null, pendingToken: 'some-token' });

      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      expect(stateAfter.isAuthenticated).toBe(false);
      expect(stateAfter.pendingToken).toBe('some-token');
    });
  });

  describe('completePendingAuth — when pendingUser and pendingToken are set (full object branch)', () => {
    it('promotes pending auth to active auth', () => {
      useAuthStore.getState().setPendingAuth(mockUser, 'pending-access-token');

      const stateMid = useAuthStore.getState();
      expect(stateMid.pendingUser).toEqual(mockUser);
      expect(stateMid.pendingToken).toBe('pending-access-token');
      expect(stateMid.isAuthenticated).toBe(false);

      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      expect(stateAfter.user).toEqual(mockUser);
      expect(stateAfter.token).toBe('pending-access-token');
      expect(stateAfter.role).toBe('student');
      expect(stateAfter.isAuthenticated).toBe(true);
    });

    it('clears pendingUser and pendingToken after completion', () => {
      useAuthStore.getState().setPendingAuth(mockUser, 'pending-token-xyz');
      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      expect(stateAfter.pendingUser).toBeNull();
      expect(stateAfter.pendingToken).toBeNull();
    });

    it('sets role from pendingUser.role', () => {
      const adminUser: AuthUser = { ...mockUser, role: 'admin' };
      useAuthStore.getState().setPendingAuth(adminUser, 'admin-token');
      useAuthStore.getState().completePendingAuth();

      expect(useAuthStore.getState().role).toBe('admin');
    });

    it('works with superadmin role', () => {
      const superadminUser: AuthUser = { ...mockUser, role: 'superadmin' };
      useAuthStore.getState().setPendingAuth(superadminUser, 'super-token');
      useAuthStore.getState().completePendingAuth();

      const stateAfter = useAuthStore.getState();
      expect(stateAfter.role).toBe('superadmin');
      expect(stateAfter.isAuthenticated).toBe(true);
    });
  });

  describe('setPendingAuth', () => {
    it('sets pendingUser and pendingToken without authenticating', () => {
      useAuthStore.getState().setPendingAuth(mockUser, 'token-abc');

      const state = useAuthStore.getState();
      expect(state.pendingUser).toEqual(mockUser);
      expect(state.pendingToken).toBe('token-abc');
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('overwrites a previous pending auth', () => {
      const otherUser: AuthUser = { ...mockUser, id: 'user-99', name: 'Other' };
      useAuthStore.getState().setPendingAuth(mockUser, 'first-token');
      useAuthStore.getState().setPendingAuth(otherUser, 'second-token');

      const state = useAuthStore.getState();
      expect(state.pendingUser).toEqual(otherUser);
      expect(state.pendingToken).toBe('second-token');
    });
  });
});

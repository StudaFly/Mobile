import { create } from 'zustand';
import { AuthState, AuthUser } from '../types/auth.types';

interface AuthStore extends AuthState {
  pendingUser: AuthUser | null;
  pendingToken: string | null;
  setUser: (user: AuthUser, token: string) => void;
  setPendingAuth: (user: AuthUser, token: string) => void;
  completePendingAuth: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  pendingUser: null,
  pendingToken: null,

  setUser: (user, token) =>
    set({ user, token, role: user.role, isAuthenticated: true, pendingUser: null, pendingToken: null }),

  setPendingAuth: (user, token) =>
    set({ pendingUser: user, pendingToken: token }),

  completePendingAuth: () =>
    set((state) =>
      state.pendingUser && state.pendingToken
        ? {
            user: state.pendingUser,
            token: state.pendingToken,
            role: state.pendingUser.role,
            isAuthenticated: true,
            pendingUser: null,
            pendingToken: null,
          }
        : {},
    ),

  clearAuth: () =>
    set({ user: null, token: null, role: null, isAuthenticated: false, pendingUser: null, pendingToken: null }),
}));

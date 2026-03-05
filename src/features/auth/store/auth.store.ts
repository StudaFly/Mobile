import { create } from 'zustand';
import { AuthState, AuthUser } from '../types/auth.types';

interface AuthStore extends AuthState {
  setUser: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  setUser: (user, token) => set({ user, token, role: user.role, isAuthenticated: true }),
  clearAuth: () => set({ user: null, token: null, role: null, isAuthenticated: false }),
}));

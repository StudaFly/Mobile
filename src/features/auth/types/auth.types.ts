export type UserRole = 'student' | 'admin' | 'superadmin';
export type OAuthProvider = 'google' | 'microsoft' | 'apple';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  institutionId?: string;
  isPremium: boolean;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

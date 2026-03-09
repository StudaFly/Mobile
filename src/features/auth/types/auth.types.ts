export type UserRole = 'student' | 'admin' | 'superadmin';
export type OAuthProvider = 'google' | 'microsoft' | 'apple';
export type MobilityTypeOption = 'erasmus' | 'stage' | 'semestre' | 'double_diplome';

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

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface OAuthLoginPayload {
  provider: OAuthProvider;
  mockToken: string;
}

export interface CreateProfilePayload {
  firstName: string;
  lastName: string;
  phone?: string;
  institution?: string;
  enableNotifications: boolean;
  avatarEmoji?: string;
  profilePictureUri?: string;
}

export interface OnboardingData {
  mobilityType: MobilityTypeOption | null;
  destination: string;
  departureDate: string;
  school: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

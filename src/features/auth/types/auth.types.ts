export type UserRole = 'student' | 'admin' | 'superadmin';
export type AccountType = 'student' | 'org_staff' | 'platform_admin';
export type OrgRole = 'manager' | 'advisor';

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  branding: { primary_color?: string } & Record<string, unknown>;
}

export interface Premium {
  active: boolean;
  source: 'purchase' | 'admin_grant' | 'organization' | 'grandfathered' | null;
  until: string | null;
}
export type OAuthProvider = 'google' | 'microsoft' | 'apple';
export type MobilityTypeOption = 'erasmus' | 'stage' | 'semestre' | 'double_diplome';

/** User as returned by the backend (UserRead). */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accountType: AccountType;
  orgRole: OrgRole | null;
  organization: OrganizationSummary | null;
  premium: Premium;
  mfaEnabled: boolean;
  /** Deprecated by the backend: use accountType / orgRole / organization / premium. */
  role: UserRole;
  institutionId: string | null;
  isPremium: boolean;
  emailVerified: boolean;
  oauthProvider: string | null;
  avatarEmoji: string | null;
  phone: string | null;
  enableNotifications: boolean;
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
  /** ID token issued by the provider's native SDK. */
  idToken: string;
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
  destinationId: string | null;
  departureDate: string;
  school: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  accountType: AccountType | null;
  isAuthenticated: boolean;
}

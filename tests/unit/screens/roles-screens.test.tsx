import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };
const mockRoute = { params: { token: 'tok-1', studentId: 's1' } };
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
  useRoute: () => mockRoute,
}));

jest.mock('../../../src/features/b2b/services/org.service', () => ({
  orgService: {
    get: jest.fn(),
    update: jest.fn(),
    allStudents: jest.fn(),
    student: jest.fn(),
    notes: jest.fn(),
    addNote: jest.fn(),
    zones: jest.fn(),
    joinCode: jest.fn(),
  },
}));
jest.mock('../../../src/features/organization/services/organization.service', () => ({
  organizationService: {
    previewByCode: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    previewInvitation: jest.fn(),
    acceptInvitation: jest.fn(),
  },
}));
jest.mock('../../../src/features/profile/services/user.service', () => ({
  userService: { getMe: jest.fn(), patchMe: jest.fn(), deleteMe: jest.fn() },
}));
jest.mock('../../../src/features/auth/session', () => ({ logout: jest.fn(), clearLocalSession: jest.fn() }));

import { orgService } from '../../../src/features/b2b/services/org.service';
import { organizationService } from '../../../src/features/organization/services/organization.service';
import { userService } from '../../../src/features/profile/services/user.service';
import { useAuthStore } from '../../../src/features/auth/store/auth.store';
import { useInvitationStore } from '../../../src/features/organization/store/invitation.store';
import type { AuthUser, OrgRole } from '../../../src/features/auth/types/auth.types';
import { SettingsScreen } from '../../../src/features/b2b/screens/SettingsScreen';
import { StudentsScreen } from '../../../src/features/b2b/screens/StudentsScreen';
import { StudentDetailScreen } from '../../../src/features/b2b/screens/StudentDetailScreen';
import { B2BDashboardScreen } from '../../../src/features/b2b/screens/B2BDashboardScreen';
import { InvitationScreen } from '../../../src/features/organization/screens/InvitationScreen';
import { MyOrganizationScreen } from '../../../src/features/organization/screens/MyOrganizationScreen';

const SCHOOL = { id: 'o1', name: 'École Démo', slug: 'ecole-demo', logoUrl: null, branding: { primary_color: '#33518A' } };

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'u1',
    email: 'lucas@example.com',
    name: 'Lucas Petit',
    accountType: 'student',
    orgRole: null,
    organization: null,
    premium: { active: false, source: null, until: null },
    mfaEnabled: false,
    role: 'student',
    institutionId: null,
    isPremium: false,
    emailVerified: true,
    oauthProvider: null,
    avatarEmoji: null,
    phone: null,
    enableNotifications: true,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

function signIn(user: AuthUser | null) {
  if (user) useAuthStore.getState().setUser(user, 'token');
  else useAuthStore.getState().clearAuth();
}

const staff = (orgRole: OrgRole) =>
  makeUser({ accountType: 'org_staff', orgRole, organization: SCHOOL, email: `${orgRole}@example.com` });

function renderScreen(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

const STUDENTS = [
  { id: 's1', name: 'Emma Durand', email: 'emma@example.com', joinedAt: '2026-01-01', followUp: 'danger', mobility: { id: 'm1', type: 'erasmus', status: 'preparing', departureDate: '2026-12-01', returnDate: null, city: 'Madrid', country: 'Espagne', countryCode: 'ES', advisor: { memberId: 'a1', name: 'Hugo Bernard' }, assignment: 'perimeter', tasksDone: 1, tasksTotal: 10, overdueTasks: 0, progress: 10 } },
  { id: 's2', name: 'Jules Moreau', email: 'jules@example.com', joinedAt: '2026-01-01', followUp: 'ok', mobility: null },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  (orgService.get as jest.Mock).mockResolvedValue({ ...SCHOOL, settings: {}, myMemberId: 'a1', myOrgRole: 'advisor', myCountries: ['ES'], myZones: [] });
  (orgService.allStudents as jest.Mock).mockResolvedValue(STUDENTS);
  (orgService.joinCode as jest.Mock).mockResolvedValue('ABCDE12345');
  useInvitationStore.getState().setPendingToken(null);
});

describe('staff screens are scoped by role', () => {
  it('shows the school settings to managers only', () => {
    signIn(staff('manager'));
    const { unmount } = renderScreen(<SettingsScreen />);
    expect(screen.getByText('Branding')).toBeTruthy();
    expect(screen.getByText('Gérer sur le web')).toBeTruthy();
    unmount();

    signIn(staff('advisor'));
    renderScreen(<SettingsScreen />);
    expect(screen.queryByText('Branding')).toBeNull();
    expect(screen.queryByText('Gérer sur le web')).toBeNull();
    expect(screen.getByText('Se déconnecter')).toBeTruthy();
  });

  it('shows the perimeter badge and the priority students on the dashboard', async () => {
    signIn(staff('advisor'));
    renderScreen(<B2BDashboardScreen />);

    expect(await screen.findByText('Mon périmètre : ES')).toBeTruthy();
    expect(await screen.findByText('Emma Durand')).toBeTruthy();
    expect(screen.queryByText('Non affectés')).toBeNull();
    expect(await screen.findByText('ABCDE12345')).toBeTruthy();
  });

  it('filters the students of the perimeter', async () => {
    signIn(staff('advisor'));
    renderScreen(<StudentsScreen />);

    expect(await screen.findByText('Jules Moreau')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Filtre Critique'));
    await waitFor(() => expect(screen.queryByText('Jules Moreau')).toBeNull());
    fireEvent.press(screen.getByText('Emma Durand'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('StudentDetail', { studentId: 's1' });
  });

  it('adds an internal note on a student record', async () => {
    signIn(staff('advisor'));
    (orgService.student as jest.Mock).mockResolvedValue({ ...STUDENTS[0], phone: null, source: 'join_code', mobilities: [{ ...STUDENTS[0].mobility, categories: [], documents: [] }] });
    (orgService.notes as jest.Mock).mockResolvedValue([]);
    (orgService.addNote as jest.Mock).mockResolvedValue({ id: 'n1', body: 'Visa ok', author: null, createdAt: '2026-01-01' });
    renderScreen(<StudentDetailScreen />);

    fireEvent.changeText(await screen.findByLabelText('Nouvelle note'), 'Visa ok');
    fireEvent.press(screen.getByText('Ajouter la note'));

    await waitFor(() => expect(orgService.addNote).toHaveBeenCalledWith('s1', 'Visa ok'));
    expect(screen.getByText('Documents (statut uniquement)')).toBeTruthy();
  });
});

describe('student side', () => {
  const invitation = {
    organization: SCHOOL,
    kind: 'student',
    orgRole: null,
    email: 'lucas@example.com',
    status: 'pending',
    expiresAt: '2030-01-01',
    sharedWithSchool: ['profile', 'progress'],
    neverShared: ['document_content'],
  };

  it('asks for consent then accepts the invitation of the signed-in student', async () => {
    signIn(makeUser());
    (organizationService.previewInvitation as jest.Mock).mockResolvedValue(invitation);
    (organizationService.acceptInvitation as jest.Mock).mockResolvedValue({ kind: 'student', organization: SCHOOL, auth: null });
    (userService.getMe as jest.Mock).mockResolvedValue(makeUser({ organization: SCHOOL }));
    renderScreen(<InvitationScreen />);

    expect(await screen.findByText('École Démo pourra voir :')).toBeTruthy();
    expect(screen.getByText(/Le contenu de tes documents/)).toBeTruthy();
    fireEvent.press(screen.getByText("J'accepte et je rejoins École Démo"));

    await waitFor(() => expect(organizationService.acceptInvitation).toHaveBeenCalledWith('tok-1', undefined));
    await waitFor(() => expect(useAuthStore.getState().user?.organization?.name).toBe('École Démo'));
  });

  it('keeps the deep link for after sign-in when nobody is logged in', async () => {
    signIn(null);
    (organizationService.previewInvitation as jest.Mock).mockResolvedValue(invitation);
    renderScreen(<InvitationScreen />);

    fireEvent.press(await screen.findByText('Se connecter'));

    expect(useInvitationStore.getState().pendingToken).toBe('tok-1');
  });

  it('shows what the school will see before joining with a code', async () => {
    signIn(makeUser());
    (organizationService.previewByCode as jest.Mock).mockResolvedValue({ organization: SCHOOL, sharedWithSchool: ['profile'], neverShared: ['document_content'] });
    (organizationService.join as jest.Mock).mockResolvedValue(SCHOOL);
    (userService.getMe as jest.Mock).mockResolvedValue(makeUser({ organization: SCHOOL }));
    renderScreen(<MyOrganizationScreen />);

    fireEvent.changeText(screen.getByLabelText("Code d'école"), 'ABCDE-12345');
    fireEvent.press(screen.getByText('Continuer'));

    expect(await screen.findByText('École Démo ne verra jamais :')).toBeTruthy();
    expect(organizationService.join).not.toHaveBeenCalled();
    fireEvent.press(screen.getByText("J'accepte et je rejoins École Démo"));
    await waitFor(() => expect(organizationService.join).toHaveBeenCalledWith('ABCDE-12345'));
  });
});

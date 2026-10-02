import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), canGoBack: () => true };
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => mockNavigation,
}));

jest.mock('../../../src/features/mobility/services/mobility.service', () => ({
  mobilityService: { getById: jest.fn(), getDestination: jest.fn(), searchDestinations: jest.fn(), getProgress: jest.fn() },
}));
jest.mock('../../../src/features/timeline/services/timeline.service', () => ({
  timelineService: { getTimeline: jest.fn() },
}));
jest.mock('../../../src/features/budget/services/budget.service', () => ({
  budgetService: { getBudget: jest.fn() },
}));
jest.mock('../../../src/features/guide/services/guide.service', () => ({
  guideService: { getGuide: jest.fn() },
}));
jest.mock('../../../src/features/profile/services/user.service', () => ({
  userService: { getMe: jest.fn(), patchMe: jest.fn(), deleteMe: jest.fn() },
}));
jest.mock('../../../src/features/auth/session', () => ({
  logout: jest.fn(),
  clearLocalSession: jest.fn(),
}));

import { mobilityService } from '../../../src/features/mobility/services/mobility.service';
import { timelineService } from '../../../src/features/timeline/services/timeline.service';
import { budgetService } from '../../../src/features/budget/services/budget.service';
import { guideService } from '../../../src/features/guide/services/guide.service';
import { userService } from '../../../src/features/profile/services/user.service';
import { logout } from '../../../src/features/auth/session';
import { useAuthStore } from '../../../src/features/auth/store/auth.store';
import { useMobilityStore } from '../../../src/features/mobility/store/mobility.store';
import type { AuthUser } from '../../../src/features/auth/types/auth.types';
import { DashboardScreen } from '../../../src/features/dashboard/screens/DashboardScreen';
import { BudgetScreen } from '../../../src/features/budget/screens/BudgetScreen';
import { GuideScreen } from '../../../src/features/guide/screens/GuideScreen';
import { ProfileScreen } from '../../../src/features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../../../src/features/profile/screens/EditProfileScreen';
import { DocumentsScreen } from '../../../src/features/documents/screens/DocumentsScreen';
import { JourJScreen } from '../../../src/features/jourj/screens/JourJScreen';

const user: AuthUser = {
  id: 'u1',
  email: 'lucas.martin@example.com',
  name: 'Lucas Martin',
  role: 'student',
  institutionId: null,
  isPremium: false,
  emailVerified: true,
  oauthProvider: null,
  avatarEmoji: '🚀',
  phone: null,
  enableNotifications: true,
  createdAt: '2026-09-01T00:00:00Z',
};

const inDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const mobility = {
  id: 'm1',
  userId: 'u1',
  destinationId: 'd1',
  type: 'erasmus',
  departureDate: inDays(47),
  returnDate: inDays(47 + 183),
  status: 'preparing',
  school: 'Universitat de Barcelona',
  createdAt: '2026-09-01T00:00:00Z',
  daysUntilDeparture: 47,
  stayMonths: 6,
};

const tasks = [
  { id: 't1', mobilityId: 'm1', title: 'Dossier visa', category: 'admin', deadline: inDays(5), daysUntilDeadline: 5, isCompleted: false, priority: 1 },
  { id: 't2', mobilityId: 'm1', title: 'Passeport', category: 'admin', deadline: inDays(2), daysUntilDeadline: 2, isCompleted: true, priority: 1 },
  { id: 't3', mobilityId: 'm1', title: 'Ouvrir un compte', category: 'finance', deadline: inDays(12), daysUntilDeadline: 12, isCompleted: false, priority: 2 },
  { id: 't4', mobilityId: 'm1', title: 'Confirmer logement', category: 'housing', deadline: inDays(21), daysUntilDeadline: 21, isCompleted: false, priority: 1 },
  { id: 't5', mobilityId: 'm1', title: 'Bagages', category: 'practical', deadline: inDays(40), daysUntilDeadline: 40, isCompleted: false, priority: 3 },
];

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.getState().setUser(user, 'token');
  useMobilityStore.getState().setActiveMobilityId('m1');
  (mobilityService.getById as jest.Mock).mockResolvedValue(mobility);
  (mobilityService.getDestination as jest.Mock).mockResolvedValue({ id: 'd1', city: 'Barcelone', country: 'Espagne' });
  (timelineService.getTimeline as jest.Mock).mockResolvedValue(tasks);
  (mobilityService.getProgress as jest.Mock).mockResolvedValue({
    mobilityId: 'm1',
    totalTasks: 5,
    completedTasks: 1,
    percent: 20,
    daysUntilDeparture: 47,
    overdueTasks: 0,
    byCategory: [
      { category: 'admin', label: 'Admin', done: 1, total: 2 },
      { category: 'finance', label: 'Finance', done: 0, total: 1 },
      { category: 'housing', label: 'Logement', done: 0, total: 1 },
      { category: 'practical', label: 'Pratique', done: 0, total: 1 },
    ],
    nextTasks: tasks.filter((t) => !t.isCompleted).slice(0, 3),
  });
});

describe('DashboardScreen', () => {
  it('shows the countdown, the next pending deadlines and the progress per category', async () => {
    const { findByText, getByText, queryByText } = renderWithQuery(<DashboardScreen />);

    expect(await findByText('Lucas !')).toBeTruthy();
    expect(await findByText('Barcelone · Erasmus')).toBeTruthy();
    expect(getByText('47')).toBeTruthy();
    expect(getByText('20%')).toBeTruthy();
    expect(getByText('Dossier visa')).toBeTruthy();
    expect(getByText('Ouvrir un compte')).toBeTruthy();
    expect(getByText('Confirmer logement')).toBeTruthy();
    expect(queryByText('Bagages')).toBeNull();
    expect(getByText('Dans 5 jours')).toBeTruthy();
    expect(getByText('📊 Avancement')).toBeTruthy();
    expect(getByText('1/2')).toBeTruthy();
  });

  it('navigates to the quick accesses', async () => {
    const { findByLabelText } = renderWithQuery(<DashboardScreen />);
    fireEvent.press(await findByLabelText('Guide'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Guide');
  });

  it('invites to create a mobility when there is none', () => {
    useMobilityStore.getState().reset();
    const { getByText } = renderWithQuery(<DashboardScreen />);
    fireEvent.press(getByText('Créer ma mobilité'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateMobility');
  });
});

describe('BudgetScreen', () => {
  it('shows the monthly estimate and every category', async () => {
    (budgetService.getBudget as jest.Mock).mockResolvedValue({
      destinationId: 'd1',
      city: 'Barcelone',
      country: 'Espagne',
      monthlyTotalMin: 900,
      monthlyTotalMax: 1300,
      currency: 'EUR',
      breakdown: [
        { key: 'housing', label: 'Logement', amountMin: 500, amountMax: 850, currency: 'EUR' },
        { key: 'food', label: 'Nourriture', amountMin: 280, amountMax: 280, currency: 'EUR' },
      ],
      tips: [],
    });
    const { findByText, getAllByText } = renderWithQuery(<BudgetScreen />);

    expect(await findByText('Barcelone · données de référence')).toBeTruthy();
    expect(budgetService.getBudget).toHaveBeenCalledWith('d1');
    expect(getAllByText('Logement').length).toBeGreaterThan(0);
    expect(getAllByText('Nourriture').length).toBeGreaterThan(0);
    expect(await findByText(/sur 6 mois/)).toBeTruthy();
  });

  it('explains when no estimate exists', async () => {
    (budgetService.getBudget as jest.Mock).mockRejectedValue(new Error('No budget data available'));
    const { findByText } = renderWithQuery(<BudgetScreen />);
    expect(await findByText('Budget indisponible')).toBeTruthy();
  });
});

describe('GuideScreen', () => {
  it('shows sections, tips and callable contacts', async () => {
    (guideService.getGuide as jest.Mock).mockResolvedValue({
      destinationId: 'd1',
      city: 'Barcelone',
      country: 'Espagne',
      sections: [{ key: 'transport', title: 'Transports', content: 'T-Casual à 11 €.' }],
      tips: ['Menu del día à midi'],
      keySteps: [{ title: 'Visa', description: 'Préparer le dossier', timing: '-4 mois' }],
      emergencyContacts: { urgences: '112', santé: 'CatSalut' },
      usefulApps: [],
    });
    const { findByText, getByText, getByLabelText } = renderWithQuery(<GuideScreen />);

    expect(await findByText('Transports')).toBeTruthy();
    expect(getByText('Menu del día à midi')).toBeTruthy();
    expect(getByLabelText('Appeler urgences : 112')).toBeTruthy();
    expect(getByLabelText('santé : CatSalut')).toBeTruthy();
    expect(getByText('Préparer le dossier')).toBeTruthy();
  });
});

describe('ProfileScreen', () => {
  it('shows the user and the mobility', async () => {
    const { getByText, getByRole, findByText } = renderWithQuery(<ProfileScreen />);
    expect(getByRole('header', { name: 'Lucas Martin' })).toBeTruthy();
    expect(getByText('lucas.martin@example.com')).toBeTruthy();
    expect(await findByText('📍 Barcelone')).toBeTruthy();
  });

  it('asks for confirmation then logs out', () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      buttons?.find((b) => b.style === 'destructive')?.onPress?.();
    });
    const { getByLabelText } = renderWithQuery(<ProfileScreen />);

    fireEvent.press(getByLabelText('Se déconnecter'));

    expect(alert).toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
  });

  it('deletes the account after confirmation', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      buttons?.find((b) => b.style === 'destructive')?.onPress?.();
    });
    (userService.deleteMe as jest.Mock).mockResolvedValue(undefined);
    const { getByLabelText } = renderWithQuery(<ProfileScreen />);

    fireEvent.press(getByLabelText('Supprimer mon compte'));

    await waitFor(() => expect(userService.deleteMe).toHaveBeenCalled());
  });

  it('toggles notifications through the API', async () => {
    (userService.patchMe as jest.Mock).mockResolvedValue({ ...user, enableNotifications: false });
    const { getByLabelText } = renderWithQuery(<ProfileScreen />);

    fireEvent(getByLabelText('Activer les notifications'), 'valueChange', false);

    await waitFor(() => expect(userService.patchMe).toHaveBeenCalledWith({ enableNotifications: false }));
    await waitFor(() => expect(useAuthStore.getState().user?.enableNotifications).toBe(false));
  });
});

describe('EditProfileScreen', () => {
  it('saves the profile and goes back', async () => {
    (userService.patchMe as jest.Mock).mockResolvedValue({ ...user, name: 'Lucas Durand' });
    const { getByDisplayValue, getByText, findByLabelText } = renderWithQuery(<EditProfileScreen />);

    fireEvent.changeText(getByDisplayValue('Martin'), 'Durand');
    fireEvent.press(await findByLabelText('Avatar 🌍'));
    fireEvent.press(getByText('Sauvegarder'));

    await waitFor(() =>
      expect(userService.patchMe).toHaveBeenCalledWith({
        firstName: 'Lucas',
        lastName: 'Durand',
        phone: '',
        avatarEmoji: '🌍',
      }),
    );
    await waitFor(() => expect(mockNavigation.goBack).toHaveBeenCalled());
    expect(useAuthStore.getState().user?.name).toBe('Lucas Durand');
  });
});

describe('Coming soon screens', () => {
  it.each([
    ['Documents', DocumentsScreen],
    ['Jour J', JourJScreen],
  ])('%s explains the feature is not available yet', (_name, Screen) => {
    const { getByText, getByLabelText } = renderWithQuery(<Screen />);
    expect(getByText('Bientôt disponible 🚧')).toBeTruthy();
    fireEvent.press(getByLabelText('Retour'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});

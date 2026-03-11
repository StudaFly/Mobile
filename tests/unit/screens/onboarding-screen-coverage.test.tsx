import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@react-native-community/datetimepicker', () => () => null);

jest.mock('../../../src/features/auth/hooks/useOnboarding', () => ({
  useOnboarding: jest.fn(),
  TOTAL_ONBOARDING_STEPS: 4,
}));

import { useOnboarding } from '../../../src/features/auth/hooks/useOnboarding';
import { OnboardingScreen } from '../../../src/features/auth/screens/OnboardingScreen';

const mockUseOnboarding = useOnboarding as jest.Mock;

const createBaseHookReturn = (overrides: Partial<ReturnType<typeof useOnboarding>>) => ({
  step: 0,
  data: {
    mobilityType: null as null | 'erasmus' | 'stage' | 'semestre' | 'double_diplome',
    destination: '',
    departureDate: '',
    school: '',
  },
  next: jest.fn(),
  prev: jest.fn(),
  updateData: jest.fn(),
  isLastStep: false,
  canProceed: jest.fn().mockReturnValue(true),
  completeOnboarding: jest.fn(),
  totalSteps: 4,
  ...overrides,
});

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('OnboardingScreen — step rendering branches', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('step 0 renders MobilityTypeCard grid', () => {
    mockUseOnboarding.mockReturnValue(createBaseHookReturn({ step: 0 }));
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByText('Erasmus')).toBeDefined();
    expect(getByText('Stage')).toBeDefined();
    expect(getByText('Semestre')).toBeDefined();
    expect(getByText('Double diplôme')).toBeDefined();
  });

  it('step 0 shows correct title and subtitle', () => {
    mockUseOnboarding.mockReturnValue(createBaseHookReturn({ step: 0 }));
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByText('Ton type de mobilité')).toBeDefined();
    expect(getByText('Quel programme as-tu choisi ?')).toBeDefined();
  });

  it('step 1 renders destination TextInput', () => {
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({ step: 1, data: { mobilityType: 'erasmus', destination: '', departureDate: '', school: '' } }),
    );
    const Wrapper = createQueryWrapper();
    const { getByPlaceholderText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByPlaceholderText('ex: Barcelone, Berlin, Montréal…')).toBeDefined();
  });

  it('step 1 shows Back button', () => {
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({ step: 1, data: { mobilityType: 'erasmus', destination: '', departureDate: '', school: '' } }),
    );
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByText('Retour')).toBeDefined();
  });

  it('step 2 renders date field with hint text', () => {
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({
        step: 2,
        data: { mobilityType: 'erasmus', destination: 'Barcelone', departureDate: '', school: '' },
      }),
    );
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByText(/automatiquement toutes tes deadlines/)).toBeDefined();
  });

  it('step 3 renders school TextInput and shows last step button', () => {
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({
        step: 3,
        isLastStep: true,
        data: { mobilityType: 'erasmus', destination: 'Berlin', departureDate: '01/09/2024', school: '' },
      }),
    );
    const Wrapper = createQueryWrapper();
    const { getByPlaceholderText, getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByPlaceholderText('ex: Universitat de Barcelona')).toBeDefined();
    expect(getByText("C'est parti !")).toBeDefined();
  });

  it('pressing Suivant on non-last step calls next()', () => {
    const mockNext = jest.fn();
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({ step: 0, isLastStep: false, next: mockNext, canProceed: jest.fn().mockReturnValue(true) }),
    );
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText('Suivant'));

    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('pressing "C\'est parti !" on last step calls completeOnboarding()', () => {
    const mockCompleteOnboarding = jest.fn();
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({
        step: 3,
        isLastStep: true,
        completeOnboarding: mockCompleteOnboarding,
        canProceed: jest.fn().mockReturnValue(true),
      }),
    );
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText("C'est parti !"));

    expect(mockCompleteOnboarding).toHaveBeenCalledTimes(1);
  });

  it('pressing Back button calls prev()', () => {
    const mockPrev = jest.fn();
    mockUseOnboarding.mockReturnValue(
      createBaseHookReturn({
        step: 2,
        prev: mockPrev,
        data: { mobilityType: 'erasmus', destination: 'Berlin', departureDate: '', school: '' },
      }),
    );
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    fireEvent.press(getByText('Retour'));

    expect(mockPrev).toHaveBeenCalledTimes(1);
  });

  it('shows step counter text', () => {
    mockUseOnboarding.mockReturnValue(createBaseHookReturn({ step: 1 }));
    const Wrapper = createQueryWrapper();
    const { getByText } = render(<OnboardingScreen />, { wrapper: Wrapper });

    expect(getByText('Étape 2 sur 4')).toBeDefined();
  });
});

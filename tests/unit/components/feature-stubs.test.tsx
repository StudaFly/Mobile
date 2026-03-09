import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocks required for implemented auth screens
jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
};

// Auth feature components
import { OAuthButton } from '../../../src/features/auth/components/OAuthButton';
import { OnboardingStep } from '../../../src/features/auth/components/OnboardingStep';
import { MobilityTypeCard } from '../../../src/features/auth/components/MobilityTypeCard';

// Auth screens
import { LoginScreen } from '../../../src/features/auth/screens/LoginScreen';
import { RegisterScreen } from '../../../src/features/auth/screens/RegisterScreen';
import { CreateProfileScreen } from '../../../src/features/auth/screens/CreateProfileScreen';
import { OnboardingScreen } from '../../../src/features/auth/screens/OnboardingScreen';
import { SplashScreen } from '../../../src/features/auth/screens/SplashScreen';

// B2B feature components
import { AlertBanner } from '../../../src/features/b2b/components/AlertBanner';
import { BrandingPreview } from '../../../src/features/b2b/components/BrandingPreview';
import { ProgressChart } from '../../../src/features/b2b/components/ProgressChart';
import { StudentProgressCard } from '../../../src/features/b2b/components/StudentProgressCard';

// B2B screens
import { B2BDashboardScreen } from '../../../src/features/b2b/screens/B2BDashboardScreen';
import { StudentsScreen } from '../../../src/features/b2b/screens/StudentsScreen';
import { AlertsScreen } from '../../../src/features/b2b/screens/AlertsScreen';
import { StatsScreen } from '../../../src/features/b2b/screens/StatsScreen';
import { SchoolTasksScreen } from '../../../src/features/b2b/screens/SchoolTasksScreen';
import { SettingsScreen } from '../../../src/features/b2b/screens/SettingsScreen';
import { StudentDetailScreen } from '../../../src/features/b2b/screens/StudentDetailScreen';
import { BrandingScreen } from '../../../src/features/b2b/screens/BrandingScreen';

// Budget
import { BudgetCategoryRow } from '../../../src/features/budget/components/BudgetCategoryRow';
import { LifestyleSlider } from '../../../src/features/budget/components/LifestyleSlider';
import { SavingTipCard } from '../../../src/features/budget/components/SavingTipCard';
import { BudgetScreen } from '../../../src/features/budget/screens/BudgetScreen';

// Checklist
import { TaskCard } from '../../../src/features/checklist/components/TaskCard';
import { TaskCategoryTabs } from '../../../src/features/checklist/components/TaskCategoryTabs';
import { AddTaskModal } from '../../../src/features/checklist/components/AddTaskModal';
import { ChecklistScreen } from '../../../src/features/checklist/screens/ChecklistScreen';

// Dashboard
import { WelcomeHeader } from '../../../src/features/dashboard/components/WelcomeHeader';
import { GlobalProgress } from '../../../src/features/dashboard/components/GlobalProgress';
import { NextDeadlines } from '../../../src/features/dashboard/components/NextDeadlines';
import { DashboardScreen } from '../../../src/features/dashboard/screens/DashboardScreen';

// Documents
import { DocumentCard } from '../../../src/features/documents/components/DocumentCard';
import { DocumentUploader } from '../../../src/features/documents/components/DocumentUploader';
import { OfflineIndicator } from '../../../src/features/documents/components/OfflineIndicator';
import { DocumentsScreen } from '../../../src/features/documents/screens/DocumentsScreen';

// Guide
import { GuideSectionCard } from '../../../src/features/guide/components/GuideSectionCard';
import { CulturalTipItem } from '../../../src/features/guide/components/CulturalTipItem';
import { GuideScreen } from '../../../src/features/guide/screens/GuideScreen';

// JourJ
import { DepartureStep } from '../../../src/features/jourj/components/DepartureStep';
import { JourJScreen } from '../../../src/features/jourj/screens/JourJScreen';

// Profile
import { ProfileAvatar } from '../../../src/features/profile/components/ProfileAvatar';
import { ProfileScreen } from '../../../src/features/profile/screens/ProfileScreen';
import { EditProfileScreen } from '../../../src/features/profile/screens/EditProfileScreen';

// Timeline
import { TimelineItem } from '../../../src/features/timeline/components/TimelineItem';
import { TimelineSection } from '../../../src/features/timeline/components/TimelineSection';
import { CategoryFilter } from '../../../src/features/timeline/components/CategoryFilter';
import { TimelineScreen } from '../../../src/features/timeline/screens/TimelineScreen';

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Stubs that need no special props (auth components excluded — they have dedicated tests)
const stubs = [
  ['AlertBanner', AlertBanner],
  ['BrandingPreview', BrandingPreview],
  ['ProgressChart', ProgressChart],
  ['StudentProgressCard', StudentProgressCard],
  ['B2BDashboardScreen', B2BDashboardScreen],
  ['StudentsScreen', StudentsScreen],
  ['AlertsScreen', AlertsScreen],
  ['StatsScreen', StatsScreen],
  ['SchoolTasksScreen', SchoolTasksScreen],
  ['SettingsScreen', SettingsScreen],
  ['StudentDetailScreen', StudentDetailScreen],
  ['BrandingScreen', BrandingScreen],
  ['BudgetCategoryRow', BudgetCategoryRow],
  ['LifestyleSlider', LifestyleSlider],
  ['SavingTipCard', SavingTipCard],
  ['BudgetScreen', BudgetScreen],
  ['TaskCard', TaskCard],
  ['TaskCategoryTabs', TaskCategoryTabs],
  ['AddTaskModal', AddTaskModal],
  ['ChecklistScreen', ChecklistScreen],
  ['WelcomeHeader', WelcomeHeader],
  ['GlobalProgress', GlobalProgress],
  ['NextDeadlines', NextDeadlines],
  ['DashboardScreen', DashboardScreen],
  ['DocumentCard', DocumentCard],
  ['DocumentUploader', DocumentUploader],
  ['OfflineIndicator', OfflineIndicator],
  ['DocumentsScreen', DocumentsScreen],
  ['GuideSectionCard', GuideSectionCard],
  ['CulturalTipItem', CulturalTipItem],
  ['GuideScreen', GuideScreen],
  ['DepartureStep', DepartureStep],
  ['JourJScreen', JourJScreen],
  ['ProfileAvatar', ProfileAvatar],
  ['ProfileScreen', ProfileScreen],
  ['EditProfileScreen', EditProfileScreen],
  ['TimelineItem', TimelineItem],
  ['TimelineSection', TimelineSection],
  ['CategoryFilter', CategoryFilter],
  ['TimelineScreen', TimelineScreen],
] as const;

describe('Feature stub components render without crashing', () => {
  it.each(stubs)('%s renders', (_name, Component) => {
    const { UNSAFE_root } = render(<Component />);
    expect(UNSAFE_root).toBeDefined();
  });
});

// Auth components with required props
describe('Auth feature components render without crashing', () => {
  it('OAuthButton renders', () => {
    const { UNSAFE_root } = render(<OAuthButton provider="google" onPress={jest.fn()} />);
    expect(UNSAFE_root).toBeDefined();
  });

  it('OnboardingStep renders', () => {
    const { UNSAFE_root } = render(<OnboardingStep title="Test"><></></OnboardingStep>);
    expect(UNSAFE_root).toBeDefined();
  });

  it('MobilityTypeCard renders', () => {
    const { UNSAFE_root } = render(
      <MobilityTypeCard value="erasmus" label="Erasmus" iconName="Globe" selected={false} onSelect={jest.fn()} />,
    );
    expect(UNSAFE_root).toBeDefined();
  });
});

// Auth screens need navigation props + QueryClient
describe('Auth screens render without crashing', () => {
  const Wrapper = createQueryWrapper();

  it('SplashScreen renders', () => {
    const { UNSAFE_root } = render(
      <SplashScreen navigation={mockNavigation as any} route={{} as any} />,
      { wrapper: Wrapper },
    );
    expect(UNSAFE_root).toBeDefined();
  });

  it('LoginScreen renders', () => {
    const { UNSAFE_root } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />,
      { wrapper: Wrapper },
    );
    expect(UNSAFE_root).toBeDefined();
  });

  it('RegisterScreen renders', () => {
    const { UNSAFE_root } = render(
      <RegisterScreen navigation={mockNavigation as any} route={{} as any} />,
      { wrapper: Wrapper },
    );
    expect(UNSAFE_root).toBeDefined();
  });

  it('CreateProfileScreen renders', () => {
    const { UNSAFE_root } = render(
      <CreateProfileScreen navigation={mockNavigation as any} route={{} as any} />,
      { wrapper: Wrapper },
    );
    expect(UNSAFE_root).toBeDefined();
  });

  it('OnboardingScreen renders', () => {
    const { UNSAFE_root } = render(
      <OnboardingScreen />,
      { wrapper: Wrapper },
    );
    expect(UNSAFE_root).toBeDefined();
  });
});

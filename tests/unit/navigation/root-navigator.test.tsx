import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';

jest.mock('../../../src/features/auth', () => ({
  useAuthStore: jest.fn(),
  WebOnlyScreen: () => {
    const { Text: T } = jest.requireActual('react-native');
    return <T>web only</T>;
  },
}));

jest.mock('../../../src/features/organization', () => ({
  InvitationScreen: () => null,
  useInvitationStore: (selector: (s: { pendingToken: null }) => unknown) => selector({ pendingToken: null }),
}));

jest.mock('../../../src/navigation/stacks/AuthStack', () => ({
  AuthStack: () => {
    const { Text: T } = jest.requireActual('react-native');
    return <T>auth stack</T>;
  },
}));

jest.mock('../../../src/navigation/stacks/B2CStack', () => ({
  B2CStack: () => {
    const { Text: T } = jest.requireActual('react-native');
    return <T>student space</T>;
  },
}));

jest.mock('../../../src/navigation/stacks/B2BStack', () => ({
  B2BStack: () => {
    const { Text: T } = jest.requireActual('react-native');
    return <T>school staff space</T>;
  },
}));

jest.mock('../../../src/core/storage/secureStorage', () => ({
  secureStorage: { getToken: jest.fn(() => Promise.resolve(null)) },
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  createNavigationContainerRef: () => ({ isReady: () => false, navigate: jest.fn() }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: ({ component: Component }: { component: React.ComponentType }) => <Component />,
  }),
}));

import { useAuthStore } from '../../../src/features/auth';
import { RootNavigator } from '../../../src/navigation/RootNavigator';

const mockUseAuthStore = useAuthStore as unknown as jest.Mock;

const as = (isAuthenticated: boolean, accountType: string | null) =>
  mockUseAuthStore.mockReturnValue({ isAuthenticated, accountType, setUser: jest.fn() });

describe('RootNavigator — account type branches', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    [false, null, 'auth stack'],
    [true, 'student', 'student space'],
    [true, 'org_staff', 'school staff space'],
    [true, 'platform_admin', 'web only'],
  ])('authenticated=%s accountType=%s → %s', async (isAuthenticated, accountType, expected) => {
    as(isAuthenticated, accountType);

    render(<RootNavigator />);

    await waitFor(() => expect(screen.getByText(expected)).toBeTruthy());
  });

  it('never shows the staff space to a student', async () => {
    as(true, 'student');

    render(<RootNavigator />);

    await waitFor(() => expect(screen.getByText('student space')).toBeTruthy());
    expect(screen.queryByText('school staff space')).toBeNull();
  });
});

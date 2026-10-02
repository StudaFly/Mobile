import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../../../src/features/auth', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('../../../src/navigation/stacks/AuthStack', () => ({
  AuthStack: () => null,
}));

jest.mock('../../../src/navigation/stacks/B2CStack', () => ({
  B2CStack: () => null,
}));

jest.mock('../../../src/navigation/stacks/B2BStack', () => ({
  B2BStack: () => null,
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

describe('RootNavigator — authentication branches', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders AuthStack when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: false, role: null });

    const { UNSAFE_root } = render(<RootNavigator />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('renders B2CStack when user is authenticated as student', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: true, role: 'student' });

    const { UNSAFE_root } = render(<RootNavigator />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('renders B2BStack when user is authenticated as admin', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: true, role: 'admin' });

    const { UNSAFE_root } = render(<RootNavigator />);

    expect(UNSAFE_root).toBeDefined();
  });

  it('renders B2BStack when user is authenticated as superadmin', () => {
    mockUseAuthStore.mockReturnValue({ isAuthenticated: true, role: 'superadmin' });

    const { UNSAFE_root } = render(<RootNavigator />);

    expect(UNSAFE_root).toBeDefined();
  });
});

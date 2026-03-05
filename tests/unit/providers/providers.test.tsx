import React from 'react';
import { Text } from 'react-native';
import { render, renderHook } from '@testing-library/react-native';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));
jest.mock('@/features/auth', () => ({
  useAuthStore: () => ({ isAuthenticated: false, role: 'student' }),
}));

import { ThemeProvider, useTheme } from '../../../src/providers/ThemeProvider';
import { QueryProvider } from '../../../src/providers/QueryProvider';
import { NotificationProvider } from '../../../src/providers/NotificationProvider';

describe('ThemeProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <ThemeProvider><Text>child</Text></ThemeProvider>
    );
    expect(getByText('child')).toBeDefined();
  });

  it('useTheme returns colors and spacing', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.colors).toBeDefined();
    expect(result.current.spacing).toBeDefined();
    expect(result.current.typography).toBeDefined();
  });
});

describe('QueryProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <QueryProvider><Text>query child</Text></QueryProvider>
    );
    expect(getByText('query child')).toBeDefined();
  });
});

describe('NotificationProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <NotificationProvider><Text>notif child</Text></NotificationProvider>
    );
    expect(getByText('notif child')).toBeDefined();
  });
});

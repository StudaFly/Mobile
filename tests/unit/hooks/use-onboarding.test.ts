import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOnboarding } from '../../../src/features/auth/hooks/useOnboarding';

jest.mock('../../../src/features/auth/store/auth.store', () => ({
  useAuthStore: (selector: (s: { completePendingAuth: () => void }) => unknown) =>
    selector({ completePendingAuth: jest.fn() }),
}));

jest.mock('../../../src/features/mobility/store/mobility.store', () => ({
  useMobilityStore: (selector: (s: { setActiveMobilityId: () => void }) => unknown) =>
    selector({ setActiveMobilityId: jest.fn() }),
}));

jest.mock('../../../src/features/mobility/services/mobility.service', () => ({
  mobilityService: {
    searchDestinations: jest.fn(),
    createMobility: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  );
};

describe('useOnboarding', () => {
  it('starts at step 0', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
    expect(result.current.step).toBe(0);
  });

  describe('next', () => {
    it('increments step by 1', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.next());
      expect(result.current.step).toBe(1);
    });

    it('increments multiple times', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => {
        result.current.next();
        result.current.next();
        result.current.next();
      });
      expect(result.current.step).toBe(3);
    });
  });

  describe('prev', () => {
    it('decrements step', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.next());
      act(() => result.current.next());
      act(() => result.current.prev());
      expect(result.current.step).toBe(1);
    });

    it('does not go below 0', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.prev());
      expect(result.current.step).toBe(0);
    });
  });
});

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOnboarding } from '../../../src/features/auth/hooks/useOnboarding';

const mockCompletePendingAuth = jest.fn();
const mockSetActiveMobilityId = jest.fn();

jest.mock('../../../src/features/auth/store/auth.store', () => ({
  useAuthStore: (selector: (s: { completePendingAuth: () => void }) => unknown) =>
    selector({ completePendingAuth: mockCompletePendingAuth }),
}));

jest.mock('../../../src/features/mobility/store/mobility.store', () => ({
  useMobilityStore: (selector: (s: { setActiveMobilityId: (id: string) => void }) => unknown) =>
    selector({ setActiveMobilityId: mockSetActiveMobilityId }),
}));

const mockSearchDestinations = jest.fn();
const mockCreateMobility = jest.fn();

jest.mock('../../../src/features/mobility/services/mobility.service', () => ({
  mobilityService: {
    searchDestinations: (...args: unknown[]) => mockSearchDestinations(...args),
    createMobility: (...args: unknown[]) => mockCreateMobility(...args),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useOnboarding — branch coverage', () => {
  beforeEach(() => {
    mockCompletePendingAuth.mockClear();
    mockSetActiveMobilityId.mockClear();
    mockSearchDestinations.mockClear();
    mockCreateMobility.mockClear();
  });

  describe('canProceed() — step 0 (mobilityType)', () => {
    it('returns false when mobilityType is null', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      expect(result.current.canProceed()).toBe(false);
    });

    it('returns true when mobilityType is set', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.updateData('mobilityType', 'erasmus'));
      expect(result.current.canProceed()).toBe(true);
    });
  });

  describe('canProceed() — step 1 (destination)', () => {
    it('returns false when destination is empty', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.next());
      expect(result.current.canProceed()).toBe(false);
    });

    it('returns false when destination is only whitespace', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.next());
      act(() => result.current.updateData('destination', '   '));
      expect(result.current.canProceed()).toBe(false);
    });

    it('returns true when destination is non-empty', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.next());
      act(() => result.current.updateData('destination', 'Berlin'));
      expect(result.current.canProceed()).toBe(true);
    });
  });

  describe('canProceed() — step 2 (departureDate)', () => {
    it('returns false when departureDate is empty', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => { result.current.next(); result.current.next(); });
      expect(result.current.canProceed()).toBe(false);
    });

    it('returns false when departureDate is only whitespace', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => { result.current.next(); result.current.next(); });
      act(() => result.current.updateData('departureDate', '  '));
      expect(result.current.canProceed()).toBe(false);
    });

    it('returns true when departureDate is non-empty', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => { result.current.next(); result.current.next(); });
      act(() => result.current.updateData('departureDate', '2025-09-01'));
      expect(result.current.canProceed()).toBe(true);
    });
  });

  describe('canProceed() — step 3 (school, always true)', () => {
    it('returns true regardless of school value', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => { result.current.next(); result.current.next(); result.current.next(); });
      expect(result.current.step).toBe(3);
      expect(result.current.canProceed()).toBe(true);
    });

    it('returns true when school is also filled', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => { result.current.next(); result.current.next(); result.current.next(); });
      act(() => result.current.updateData('school', 'Epitech'));
      expect(result.current.canProceed()).toBe(true);
    });
  });

  describe('next() boundary', () => {
    it('does not exceed the last step (step 3)', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => {
        result.current.next();
        result.current.next();
        result.current.next();
        result.current.next();
      });
      expect(result.current.step).toBe(3);
    });
  });

  describe('prev() boundary', () => {
    it('does not go below step 0', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.prev());
      act(() => result.current.prev());
      expect(result.current.step).toBe(0);
    });
  });

  describe('updateData()', () => {
    it('updates a key without mutating others', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.updateData('destination', 'Madrid'));
      expect(result.current.data.destination).toBe('Madrid');
      expect(result.current.data.mobilityType).toBeNull();
      expect(result.current.data.departureDate).toBe('');
      expect(result.current.data.school).toBe('');
    });

    it('updates school', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.updateData('school', 'TU Berlin'));
      expect(result.current.data.school).toBe('TU Berlin');
    });
  });

  describe('isLastStep', () => {
    it('is false at step 0', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      expect(result.current.isLastStep).toBe(false);
    });

    it('is true at step 3', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => { result.current.next(); result.current.next(); result.current.next(); });
      expect(result.current.isLastStep).toBe(true);
    });

    it('is false at intermediate steps', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.next());
      expect(result.current.isLastStep).toBe(false);
      act(() => result.current.next());
      expect(result.current.isLastStep).toBe(false);
    });
  });

  describe('completeOnboarding()', () => {
    it('calls completePendingAuth after successful mutation', async () => {
      mockSearchDestinations.mockResolvedValue([{ id: 'dest-uuid-1' }]);
      mockCreateMobility.mockResolvedValue({ id: 'mob-uuid-1' });

      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      act(() => result.current.updateData('mobilityType', 'erasmus'));
      act(() => result.current.updateData('destination', 'Barcelona'));
      act(() => result.current.updateData('departureDate', '01/09/2025'));

      await act(async () => { result.current.completeOnboarding(); });
      await waitFor(() => expect(mockCompletePendingAuth).toHaveBeenCalledTimes(1));
    });
  });

  describe('totalSteps', () => {
    it('is 4', () => {
      const { result } = renderHook(() => useOnboarding(), { wrapper: createWrapper() });
      expect(result.current.totalSteps).toBe(4);
    });
  });
});

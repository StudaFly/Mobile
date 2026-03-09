import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

import { useLogin, useOAuthLogin, useRegister } from '../../../src/features/auth/hooks/useLogin';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLogin', () => {
  it('returns a mutation with mutate function', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });

  it('starts not pending', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
  });

  it('starts with no error', () => {
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });
    expect(result.current.isError).toBe(false);
  });
});

describe('useOAuthLogin', () => {
  it('returns a mutation with mutate function', () => {
    const { result } = renderHook(() => useOAuthLogin(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });

  it('starts not pending', () => {
    const { result } = renderHook(() => useOAuthLogin(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
  });
});

describe('useRegister', () => {
  it('returns a mutation with mutate function', () => {
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });
    expect(result.current.mutate).toBeDefined();
    expect(typeof result.current.mutate).toBe('function');
  });

  it('starts not pending', () => {
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(false);
  });

  it('starts with isSuccess false', () => {
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() });
    expect(result.current.isSuccess).toBe(false);
  });
});

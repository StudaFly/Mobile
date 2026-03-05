import { queryClient } from '../../../src/core/api/queryClient';

describe('queryClient', () => {
  it('is defined', () => {
    expect(queryClient).toBeDefined();
  });

  it('has correct staleTime (5 minutes)', () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.staleTime).toBe(1000 * 60 * 5);
  });

  it('has retry set to 2', () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.retry).toBe(2);
  });

  it('disables refetchOnWindowFocus', () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.refetchOnWindowFocus).toBe(false);
  });
});

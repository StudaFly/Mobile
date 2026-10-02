import React from 'react';
import { render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError, AxiosHeaders } from 'axios';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('../../../src/core/api/client', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock('../../../src/core/config/env', () => ({
  env: { BASE_URL: 'http://10.50.5.249:8080/api/v1', BASE_URL_SOURCE: 'metro-host' },
}));

import apiClient from '../../../src/core/api/client';
import { ApiStatusBanner } from '../../../src/providers/ApiStatusBanner';

function renderBanner() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <ApiStatusBanner />
    </QueryClientProvider>,
  );
}

function axiosError(status?: number, details?: Record<string, string>) {
  const config = { headers: new AxiosHeaders() };
  const response = status
    ? { status, statusText: '', headers: {}, config, data: { error: { details } } }
    : undefined;
  return new AxiosError('fail', 'ERR', config, null, response);
}

describe('ApiStatusBanner (mobile)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('is hidden when the API answers', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({ data: { data: { status: 'healthy' } } });
    const { queryByRole, findByTestId } = renderBanner();
    await expect(findByTestId('never', {}, { timeout: 50 })).rejects.toBeTruthy();
    expect(queryByRole('alert')).toBeNull();
  });

  it('shows the target URL and the same-network hint when the API is unreachable', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(axiosError());
    const { findByText } = renderBanner();
    expect(await findByText(/Impossible de joindre l'API \(http:\/\/10\.50\.5\.249:8080\/api\/v1\)/)).toBeTruthy();
    expect(await findByText(/pnpm start:tunnel/)).toBeTruthy();
  });

  it('names the unreachable service when the API answers 503', async () => {
    (apiClient.get as jest.Mock).mockRejectedValue(axiosError(503, { database: 'unreachable', cache: 'ok' }));
    const { findByText } = renderBanner();
    expect(await findByText(/PostgreSQL est injoignable/)).toBeTruthy();
  });
});

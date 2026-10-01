import { AxiosError, AxiosHeaders } from 'axios';
import { getApiErrorCode, getApiErrorMessage, getApiErrorStatus } from '../../../src/core/api/errors';

function axiosError(data?: unknown, status = 400) {
  const config = { headers: new AxiosHeaders() };
  const response =
    data === undefined ? undefined : { data, status, statusText: '', headers: {}, config };
  return new AxiosError('fail', 'ERR', config, null, response);
}

describe('api errors', () => {
  it('reads the backend error envelope', () => {
    const err = axiosError({ error: { code: 'CONFLICT', message: 'An account with this email already exists' } }, 409);
    expect(getApiErrorMessage(err)).toBe('An account with this email already exists');
    expect(getApiErrorCode(err)).toBe('CONFLICT');
    expect(getApiErrorStatus(err)).toBe(409);
  });

  it('reports network errors', () => {
    expect(getApiErrorMessage(axiosError())).toMatch(/joindre le serveur/);
  });

  it('keeps messages of plain errors (client-side validation)', () => {
    expect(getApiErrorMessage(new Error('Destination "Paris" introuvable.'))).toBe('Destination "Paris" introuvable.');
  });

  it('falls back otherwise', () => {
    expect(getApiErrorMessage(axiosError({}), 'Oups')).toBe('Oups');
    expect(getApiErrorMessage('boom', 'Oups')).toBe('Oups');
  });
});

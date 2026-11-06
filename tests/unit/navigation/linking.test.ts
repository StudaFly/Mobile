import { getStateFromPath } from '@react-navigation/native';
import { linking } from '../../../src/navigation/linking';

describe('deep links', () => {
  it('opens the invitation screen with its token', () => {
    const state = getStateFromPath('invitations/abc-123', linking.config);

    expect(state?.routes[0]).toMatchObject({ name: 'Invitation', params: { token: 'abc-123' } });
  });

  it('accepts the app scheme and the web link sent by email', () => {
    expect(linking.prefixes).toEqual(expect.arrayContaining(['studafly://', 'http://localhost:5173']));
  });
});

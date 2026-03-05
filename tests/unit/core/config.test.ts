jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: { BASE_URL: 'http://test-api.com/api/v1' },
    },
  },
}));

import { env } from '../../../src/core/config/env';
import { FEATURE_FLAGS } from '../../../src/core/config/featureFlags';
import { STORAGE_KEYS } from '../../../src/core/storage/storage.keys';

describe('env', () => {
  it('reads BASE_URL from expo config', () => {
    expect(env.BASE_URL).toBe('http://test-api.com/api/v1');
  });
});

describe('FEATURE_FLAGS', () => {
  it('has OFFLINE_DOCUMENTS enabled', () => {
    expect(FEATURE_FLAGS.OFFLINE_DOCUMENTS).toBe(true);
  });

  it('has JOURJ_MODE enabled', () => {
    expect(FEATURE_FLAGS.JOURJ_MODE).toBe(true);
  });

  it('has PREMIUM_BUDGET_AI disabled', () => {
    expect(FEATURE_FLAGS.PREMIUM_BUDGET_AI).toBe(false);
  });

  it('has B2B_BRANDING disabled', () => {
    expect(FEATURE_FLAGS.B2B_BRANDING).toBe(false);
  });
});

describe('STORAGE_KEYS', () => {
  it('has correct key values', () => {
    expect(STORAGE_KEYS.ACCESS_TOKEN).toBe('access_token');
    expect(STORAGE_KEYS.REFRESH_TOKEN).toBe('refresh_token');
    expect(STORAGE_KEYS.USER_PREFERENCES).toBe('user_preferences');
    expect(STORAGE_KEYS.OFFLINE_DOCUMENTS).toBe('offline_documents');
    expect(STORAGE_KEYS.ACTIVE_MOBILITY_ID).toBe('active_mobility_id');
  });
});

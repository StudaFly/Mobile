export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_DOCUMENTS: 'offline_documents',
  ACTIVE_MOBILITY_ID: 'active_mobility_id',
  PUSH_TOKEN: 'push_token',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

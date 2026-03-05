const store: Record<string, unknown> = {};

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn((key: string) => store[key] as string | undefined),
    set: jest.fn((key: string, value: unknown) => { store[key] = value; }),
    getBoolean: jest.fn((key: string) => store[key] as boolean | undefined),
    remove: jest.fn((key: string) => { delete store[key]; }),
    clearAll: jest.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
  })),
}));

import { persistentStorage } from '../../../src/core/storage/persistentStorage';

describe('persistentStorage', () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  });

  describe('getString / setString', () => {
    it('stores and retrieves a string', () => {
      persistentStorage.setString('key1', 'hello');
      expect(persistentStorage.getString('key1')).toBe('hello');
    });

    it('returns undefined for unknown key', () => {
      expect(persistentStorage.getString('nonexistent')).toBeUndefined();
    });
  });

  describe('getBoolean / setBoolean', () => {
    it('stores and retrieves a boolean', () => {
      persistentStorage.setBoolean('flag', true);
      expect(persistentStorage.getBoolean('flag')).toBe(true);
    });

    it('stores false correctly', () => {
      persistentStorage.setBoolean('disabled', false);
      expect(persistentStorage.getBoolean('disabled')).toBe(false);
    });
  });

  describe('delete', () => {
    it('removes a stored key', () => {
      persistentStorage.setString('toDelete', 'value');
      persistentStorage.delete('toDelete');
      expect(persistentStorage.getString('toDelete')).toBeUndefined();
    });
  });

  describe('clearAll', () => {
    it('removes all stored keys', () => {
      persistentStorage.setString('a', 'value-a');
      persistentStorage.setString('b', 'value-b');
      persistentStorage.clearAll();
      expect(persistentStorage.getString('a')).toBeUndefined();
      expect(persistentStorage.getString('b')).toBeUndefined();
    });
  });
});

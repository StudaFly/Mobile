jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from 'expo-secure-store';
import { secureStorage } from '../../../src/core/storage/secureStorage';
import { STORAGE_KEYS } from '../../../src/core/storage/storage.keys';

const mockGetItemAsync = SecureStore.getItemAsync as jest.Mock;
const mockSetItemAsync = SecureStore.setItemAsync as jest.Mock;
const mockDeleteItemAsync = SecureStore.deleteItemAsync as jest.Mock;

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getToken', () => {
    it('calls getItemAsync with ACCESS_TOKEN key', async () => {
      mockGetItemAsync.mockResolvedValue('token123');
      const result = await secureStorage.getToken();
      expect(mockGetItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(result).toBe('token123');
    });

    it('returns null when no token stored', async () => {
      mockGetItemAsync.mockResolvedValue(null);
      const result = await secureStorage.getToken();
      expect(result).toBeNull();
    });
  });

  describe('setToken', () => {
    it('calls setItemAsync with ACCESS_TOKEN key and value', async () => {
      mockSetItemAsync.mockResolvedValue(undefined);
      await secureStorage.setToken('myToken');
      expect(mockSetItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN, 'myToken');
    });
  });

  describe('getRefreshToken', () => {
    it('calls getItemAsync with REFRESH_TOKEN key', async () => {
      mockGetItemAsync.mockResolvedValue('refresh123');
      const result = await secureStorage.getRefreshToken();
      expect(mockGetItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(result).toBe('refresh123');
    });
  });

  describe('setRefreshToken', () => {
    it('calls setItemAsync with REFRESH_TOKEN key and value', async () => {
      mockSetItemAsync.mockResolvedValue(undefined);
      await secureStorage.setRefreshToken('refreshToken');
      expect(mockSetItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN, 'refreshToken');
    });
  });

  describe('clearTokens', () => {
    it('deletes both ACCESS_TOKEN and REFRESH_TOKEN', async () => {
      mockDeleteItemAsync.mockResolvedValue(undefined);
      await secureStorage.clearTokens();
      expect(mockDeleteItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.ACCESS_TOKEN);
      expect(mockDeleteItemAsync).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN);
      expect(mockDeleteItemAsync).toHaveBeenCalledTimes(2);
    });
  });
});

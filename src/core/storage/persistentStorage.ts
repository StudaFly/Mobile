import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

export const persistentStorage = {
  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  delete(key: string): void {
    storage.remove(key);
  },

  clearAll(): void {
    storage.clearAll();
  },
};

// storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

// Helpers para JWT
export const saveToken = (token: string) => {
  storage.set('jwt', token);
};

export const getToken = () => {
  return storage.getString('jwt');
};

export const clearToken = () => {
  storage.delete('jwt');
};

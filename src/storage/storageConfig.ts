import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../contexts/AuthContext';

type AuthTokenProps = {
  token: string;
  refreshToken: string;
};

const USER_STORAGE = '@ignitegym:user';
const TOKEN_STORAGE = '@ignitegym:token';

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
  const response = await AsyncStorage.getItem(USER_STORAGE);

  const user: UserDTO = response ? JSON.parse(response) : {};

  return user;
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(USER_STORAGE);
}

export async function saveToken({ token, refreshToken }: AuthTokenProps) {
  await AsyncStorage.setItem(
    TOKEN_STORAGE,
    JSON.stringify({ token, refreshToken })
  );
}

export async function getToken() {
  const response = await AsyncStorage.getItem(TOKEN_STORAGE);

  const { token, refreshToken }: AuthTokenProps = response
    ? JSON.parse(response)
    : {};

  return { token, refreshToken };
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
}

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'senior_test_access_token';
const SESSION_USER_KEY = 'senior_test_session_user';

export type SessionUser = {
  fullName: string;
  email: string;
};

async function setItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function saveAccessToken(token: string) {
  await setItem(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
  return getItem(ACCESS_TOKEN_KEY);
}

export async function clearAccessToken() {
  await deleteItem(ACCESS_TOKEN_KEY);
  await deleteItem(SESSION_USER_KEY);
}

export async function saveSessionUser(user: SessionUser) {
  await setItem(SESSION_USER_KEY, JSON.stringify(user));
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const raw = await getItem(SESSION_USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

import { Platform } from 'react-native';

const defaultUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

/** localhost no emulador Android aponta para o device, não para o host da API. */
function resolveApiUrl(): string {
  const configured = (process.env.EXPO_PUBLIC_API_URL ?? defaultUrl).replace(/\/$/, '');

  if (
    Platform.OS === 'android' &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(configured)
  ) {
    return configured.replace(/^https?:\/\/(localhost|127\.0\.0\.1)/, 'http://10.0.2.2');
  }

  return configured;
}

export const env = {
  apiUrl: resolveApiUrl(),
  /** Simula login sem API — defina `EXPO_PUBLIC_MOCK_AUTH=false` para usar backend real. */
  mockAuth: process.env.EXPO_PUBLIC_MOCK_AUTH !== 'false',
};

import { Platform } from 'react-native';

const defaultUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const LOCALHOST_API_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/;

/** localhost no emulador Android aponta para o device, não para o host da API. */
function resolveApiUrl(): string {
  const configured = (process.env.EXPO_PUBLIC_API_URL ?? defaultUrl).replace(/\/$/, '');

  if (Platform.OS === 'android' && LOCALHOST_API_PATTERN.test(configured)) {
    return configured.replace(/^https?:\/\/(localhost|127\.0\.0\.1)/, 'http://10.0.2.2');
  }

  if (
    Platform.OS !== 'web' &&
    LOCALHOST_API_PATTERN.test(configured) &&
    !Platform.isTV
  ) {
    console.warn(
      '[env] EXPO_PUBLIC_API_URL usa localhost em dispositivo físico — a API não será alcançada. Use o IP LAN do PC (hostname -I).',
    );
  }

  return configured;
}

export const env = {
  apiUrl: resolveApiUrl(),
  /** Simula login sem API — defina `EXPO_PUBLIC_MOCK_AUTH=false` para usar backend real. */
  mockAuth: process.env.EXPO_PUBLIC_MOCK_AUTH !== 'false',
};

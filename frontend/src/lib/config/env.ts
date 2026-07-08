import { Platform } from 'react-native';

const fallbackUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? fallbackUrl).replace(/\/$/, ''),
  /** Simula login sem API — defina `EXPO_PUBLIC_MOCK_AUTH=false` para usar backend real. */
  mockAuth: process.env.EXPO_PUBLIC_MOCK_AUTH !== 'false',
};

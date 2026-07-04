import { Platform } from 'react-native';

const fallbackUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const env = {
  apiUrl: (process.env.EXPO_PUBLIC_API_URL ?? fallbackUrl).replace(/\/$/, ''),
};

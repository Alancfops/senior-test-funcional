import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { QueryProvider } from '@/providers/query-provider';
import { getAccessToken } from '@/lib/auth/storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      await getAccessToken();
      setReady(true);
      await SplashScreen.hideAsync();
    }

    bootstrap();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </QueryProvider>
  );
}

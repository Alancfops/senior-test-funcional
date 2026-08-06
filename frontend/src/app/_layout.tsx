import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';

import { SplashLoadingScreen } from '@/components/brand/SplashLoadingScreen';
import { getAccessToken } from '@/lib/auth/storage';
import { QueryProvider } from '@/providers/query-provider';

/**
 * Tempo mínimo com a splash **visível** após o JS carregar no Expo Go.
 * Cobre a percepção de “app ainda abrindo” (bundle + SecureStore).
 */
const SPLASH_MIN_VISIBLE_MS = 4000;

/** Fallback se onLoad das imagens não disparar (cache / web). */
const SPLASH_DISPLAY_FALLBACK_MS = 1200;

SplashScreen.preventAutoHideAsync().catch(() => {
  // Já oculto / ambiente sem splash nativa (web / Expo Go em alguns casos).
});

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [splashPainted, setSplashPainted] = useState(false);
  const nativeHiddenRef = useRef(false);
  const bootstrapStartedRef = useRef(false);

  const hideNativeSplash = useCallback(async () => {
    if (nativeHiddenRef.current) {
      return;
    }
    nativeHiddenRef.current = true;
    await SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const handleSplashDisplayReady = useCallback(() => {
    setSplashPainted(true);
    void hideNativeSplash();
  }, [hideNativeSplash]);

  // Fallback: se imagens não dispararem onLoad, libera mesmo assim.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashPainted((current) => {
        if (!current) {
          void hideNativeSplash();
          return true;
        }
        return current;
      });
    }, SPLASH_DISPLAY_FALLBACK_MS);

    return () => clearTimeout(timer);
  }, [hideNativeSplash]);

  // Só inicia a contagem mínima **depois** da splash customizada estar na tela.
  useEffect(() => {
    if (!splashPainted || bootstrapStartedRef.current) {
      return;
    }
    bootstrapStartedRef.current = true;

    let cancelled = false;

    async function bootstrap() {
      const visibleSince = Date.now();

      try {
        await getAccessToken();
      } catch {
        // Sem token — index manda para login.
      }

      const elapsed = Date.now() - visibleSince;
      if (elapsed < SPLASH_MIN_VISIBLE_MS) {
        await delay(SPLASH_MIN_VISIBLE_MS - elapsed);
      }

      if (!cancelled) {
        setReady(true);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [splashPainted]);

  if (!ready) {
    return <SplashLoadingScreen onDisplayReady={handleSplashDisplayReady} />;
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

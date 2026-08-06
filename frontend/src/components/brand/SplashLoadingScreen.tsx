import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens } from '@/theme/tokens';

type SplashLoadingScreenProps = {
  /** Chamado quando a splash já está pintada na tela (handoff da splash nativa / Expo Go). */
  onDisplayReady?: () => void;
};

/**
 * Splash de abertura — Figma (screenshot handoff 2026-08-06).
 * Exibida enquanto o app inicializa (Expo Go + SecureStore / bootstrap).
 *
 * Cores de referência (Dev Mode / print):
 * - background: #F6F7FC
 * - gradiente: faixa clara maior no topo (#FFFFFF → #F6F7FC), depois #5C9FC3 → #4983D1
 */
export function SplashLoadingScreen({ onDisplayReady }: SplashLoadingScreenProps) {
  const insets = useSafeAreaInsets();
  const notifiedRef = useRef(false);
  const layoutReadyRef = useRef(false);
  const imagesLoadedRef = useRef(0);

  const maybeNotify = useCallback(() => {
    if (notifiedRef.current) {
      return;
    }
    if (!layoutReadyRef.current || imagesLoadedRef.current < 2) {
      return;
    }
    notifiedRef.current = true;
    onDisplayReady?.();
  }, [onDisplayReady]);

  const handleLayout = useCallback(() => {
    layoutReadyRef.current = true;
    maybeNotify();
  }, [maybeNotify]);

  const handleImageLoad = useCallback(() => {
    imagesLoadedRef.current += 1;
    maybeNotify();
  }, [maybeNotify]);

  return (
    <View
      style={styles.root}
      onLayout={handleLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel="SeniorTest Physio. Carregando aplicativo. CESMAC Centro Universitário."
      accessibilityState={{ busy: true }}>
      <LinearGradient
        colors={[
          tokens.colors.splashGradientStart,
          tokens.colors.splashGradientSoft,
          tokens.colors.splashGradientMid,
          tokens.colors.splashGradientEnd,
        ]}
        locations={[0, 0.38, 0.68, 1]}
        style={[
          styles.gradient,
          {
            paddingTop: insets.top + tokens.spacing.xl,
            paddingBottom: insets.bottom + tokens.spacing.xl,
          },
        ]}>
        <Image
          source={require('@/assets/images/splash/cesmac-logo.png')}
          style={styles.cesmacLogo}
          contentFit="contain"
          cachePolicy="memory-disk"
          onLoad={handleImageLoad}
          accessibilityIgnoresInvertColors
        />

        {/* SeniorTest mais ao centro vertical (CESMAC permanece no topo). */}
        <View style={styles.heroCenter}>
          <Image
            source={require('@/assets/images/splash/hero-illustration.png')}
            style={styles.hero}
            contentFit="contain"
            cachePolicy="memory-disk"
            onLoad={handleImageLoad}
            accessibilityIgnoresInvertColors
          />
        </View>
      </LinearGradient>
    </View>
  );
}

/** Proporção do asset CESMAC (export 1x 104×30; arquivo em 3×). */
const CESMAC_WIDTH = 112;
const CESMAC_HEIGHT = Math.round(CESMAC_WIDTH / (104 / 30));

/**
 * Logo principal SeniorTest — menor na splash.
 * Fonte Figma 147×174; arquivo em 3× para nitidez no Expo Go.
 */
const HERO_WIDTH = 132;
const HERO_HEIGHT = Math.round(HERO_WIDTH / (147 / 174));

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.splashBackground,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
  },
  cesmacLogo: {
    width: CESMAC_WIDTH,
    height: CESMAC_HEIGHT,
  },
  heroCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: tokens.spacing.lg,
    // Sobe um pouco o centro óptico (evita cair demais na metade inferior).
    paddingBottom: tokens.spacing.xl,
  },
  hero: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
});

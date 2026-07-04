import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { tokens } from '@/theme/tokens';

const LOGO_SIZE = 148;

/** Logo circular oficial — Figma Frame 1171288176. */
export function AuthHeader() {
  return (
    <LinearGradient
      colors={[
        tokens.colors.headerGradientStart,
        tokens.colors.headerGradientMid,
        tokens.colors.headerGradientEnd,
      ]}
      locations={[0, 0.55, 1]}
      style={styles.gradient}
      accessibilityRole="image"
      accessibilityLabel="SeniorTest Physio">
      <View style={[styles.logoWrap, { width: LOGO_SIZE, height: LOGO_SIZE }]}>
        <Image
          source={require('@/assets/images/brand/seniortest-logo-circle.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

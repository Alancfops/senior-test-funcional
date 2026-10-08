import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

type StpLogoProps = {
  variant?: 'splash' | 'header';
};

/** Proporção original 170×152 (~1.12:1). */
const sizes = {
  splash: { width: 300, height: 268 },
  header: { width: 220, height: 197 },
} as const;

/** Logo oficial SêniorTeste. */
export function StpLogo({ variant = 'splash' }: StpLogoProps) {
  const size = sizes[variant];

  return (
    <View style={[styles.wrap, { width: size.width, height: size.height }]} accessibilityLabel="SêniorTeste">
      <Image
        source={require('@/assets/images/brand/seniorteste-logo-vertical.svg')}
        style={size}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
});

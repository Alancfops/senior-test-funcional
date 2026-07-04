import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

type StpLogoProps = {
  variant?: 'splash' | 'header';
};

/** Proporção original 1206×809 (~1.49:1). */
const sizes = {
  splash: { width: 300, height: 201 },
  header: { width: 220, height: 147 },
} as const;

/** Logo oficial SeniorTest PHYSIO — Figma node 14182:516. */
export function StpLogo({ variant = 'splash' }: StpLogoProps) {
  const size = sizes[variant];

  return (
    <View style={[styles.wrap, { width: size.width, height: size.height }]} accessibilityLabel="SeniorTest Physio">
      <Image
        source={require('@/assets/images/brand/stp-logo.png')}
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

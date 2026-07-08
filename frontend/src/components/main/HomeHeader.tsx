import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens } from '@/theme/tokens';

type HomeHeaderProps = {
  userName: string;
  onProfilePress?: () => void;
  /** Busca dentro do header — prolonga o gradiente até a barra (Figma Início). */
  searchSlot?: ReactNode;
};

/** Figma — logo Frame 1171288172; gradiente linear 5 stops (#3260D7 → #F6F7FC). */
export function HomeHeader({ userName, onProfilePress, searchSlot }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[
        tokens.colors.homeGradientStart,
        tokens.colors.homeGradientMid,
        tokens.colors.homeGradientLight,
        tokens.colors.homeGradientEnd,
        tokens.colors.homeGradientEnd,
      ]}
      locations={[0, 0.28, 0.52, 0.9, 1]}
      style={[styles.gradient, { paddingTop: insets.top + tokens.spacing.sm }]}>
      <View style={styles.topRow}>
        <Image
          source={require('@/assets/images/brand/stp-home-wordmark.png')}
          style={styles.logo}
          contentFit="contain"
          accessibilityLabel="SeniorTest Physio"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Perfil do profissional"
          onPress={onProfilePress}
          style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}>
          <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
        </Pressable>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.greeting} accessibilityRole="header">
          Olá, {userName}!
        </Text>
        <Text style={styles.subtitle}>
          Acompanhe seus pacientes, aplique testes funcionais e revise avaliações recentes em um só
          lugar.
        </Text>
      </View>

      {searchSlot ? <View style={styles.searchWrap}>{searchSlot}</View> : null}
    </LinearGradient>
  );
}

/** Proporção nativa do asset 93×28 (~3.32:1). */
const LOGO_WIDTH = 108;
const LOGO_HEIGHT = Math.round(LOGO_WIDTH / (93 / 28));

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.full,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPressed: {
    opacity: 0.85,
  },
  avatarInitial: {
    ...tokens.typography.button,
    color: tokens.colors.primary,
  },
  greetingBlock: {
    gap: tokens.spacing.xs,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: tokens.colors.onPrimary,
  },
  subtitle: {
    ...tokens.typography.subtitle,
    color: '#000000',
  },
  searchWrap: {
    marginTop: tokens.spacing.xs,
  },
});

import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsMenuItem, SettingsSection } from '@/components/settings/SettingsMenuItem';
import { useSessionUser } from '@/hooks/use-session-user';
import { clearAccessToken } from '@/lib/auth/storage';
import { tokens } from '@/theme/tokens';

/** Figma — Configurações (menu enxuto: legal, informações, sair). */
export default function SettingsTabScreen() {
  const insets = useSafeAreaInsets();
  const sessionUser = useSessionUser();
  const displayName = sessionUser?.fullName ?? 'Profissional';

  async function handleLogout() {
    await clearAccessToken();
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.root}>
      <View style={[styles.topBand, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <View style={styles.topBarSide} />
          <Text style={styles.topTitle} accessibilityRole="header">
            Configurações
          </Text>
          <View style={styles.topBarSide} />
        </View>
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={[
          styles.sheetContent,
          { paddingBottom: insets.bottom + tokens.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileBlock}>
          <View style={styles.avatarRing}>
            <Image
              source={require('@/assets/images/brand/seniortest-logo-circle.png')}
              style={styles.avatar}
              contentFit="cover"
              accessibilityIgnoresInvertColors
            />
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
          {sessionUser?.email ? (
            <Text style={styles.profileEmail}>{sessionUser.email}</Text>
          ) : null}
        </View>

        <SettingsSection title="Legal e informações">
          <SettingsMenuItem
            label="LGPD e Termos de uso"
            onPress={() => router.push('/(main)/privacy-terms' as Href)}
          />
          <SettingsMenuItem
            label="Informações do Sistema"
            onPress={() => router.push('/(main)/system-info' as Href)}
          />
        </SettingsSection>

        <Text style={styles.hint}>
          Para alterar a senha, saia da conta e use &quot;Esqueci minha senha&quot; na tela de login.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          onPress={handleLogout}
          style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
  },
  topBand: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
  },
  topBarSide: {
    width: tokens.touchTargetMin,
  },
  topTitle: {
    flex: 1,
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  sheet: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radius.cardTop,
    borderTopRightRadius: tokens.radius.cardTop,
  },
  sheetContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  profileBlock: {
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.pageBackground,
    padding: 3,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.radius.full,
  },
  profileName: {
    ...tokens.typography.title,
    fontSize: 20,
    color: tokens.colors.text,
    textAlign: 'center',
  },
  profileEmail: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  hint: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  logout: {
    minHeight: tokens.touchTargetMin,
    borderRadius: tokens.radius.lg,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
    marginTop: tokens.spacing.sm,
  },
  logoutPressed: {
    opacity: 0.85,
  },
  logoutText: {
    ...tokens.typography.button,
    color: tokens.colors.error,
  },
});

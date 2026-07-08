import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSessionUser } from '@/hooks/use-session-user';
import { clearAccessToken } from '@/lib/auth/storage';
import { tokens } from '@/theme/tokens';

export default function SettingsTabScreen() {
  const sessionUser = useSessionUser();

  async function handleLogout() {
    await clearAccessToken();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Configurações
        </Text>

        {sessionUser ? (
          <View style={styles.profileCard}>
            <Text style={styles.profileName}>{sessionUser.fullName}</Text>
            <Text style={styles.profileEmail}>{sessionUser.email}</Text>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          onPress={handleLogout}
          style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  title: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
  profileCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: 4,
  },
  profileName: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  profileEmail: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  logout: {
    marginTop: 'auto',
    minHeight: tokens.touchTargetMin,
    borderRadius: tokens.radius.pill,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  logoutPressed: {
    opacity: 0.85,
  },
  logoutText: {
    ...tokens.typography.button,
    color: tokens.colors.primary,
  },
});

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { clearAccessToken } from '@/lib/auth/storage';
import { tokens } from '@/theme/tokens';

/** Placeholder RF005 — lista de pacientes virá na Fase C. */
export default function HomeScreen() {
  async function handleLogout() {
    await clearAccessToken();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Pacientes
        </Text>
        <Text style={styles.subtitle}>
          Área principal após login. A lista e busca de pacientes (RF005) serão implementadas quando
          a API estiver disponível.
        </Text>

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
    backgroundColor: tokens.colors.background,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  title: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
  logout: {
    marginTop: 'auto',
    minHeight: tokens.touchTargetMin,
    borderRadius: tokens.radius.sm,
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

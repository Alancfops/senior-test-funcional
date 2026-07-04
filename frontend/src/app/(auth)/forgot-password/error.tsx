import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { tokens } from '@/theme/tokens';

/** Figma — Erro no fluxo de recuperação. */
export default function ForgotPasswordErrorScreen() {
  return (
    <AuthScreenLayout title="Erro! Código inválido" subtitle="Verifique o código e tente novamente.">
      <Button label="Entendi!" variant="outline" onPress={() => router.back()} />

      <Pressable
        accessibilityRole="link"
        onPress={() => router.replace('/(auth)/login')}
        style={styles.backLink}>
        <Text style={styles.backLinkText}>Voltar ao Login</Text>
      </Pressable>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  backLink: {
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
    justifyContent: 'center',
  },
  backLinkText: {
    ...tokens.typography.link,
    color: tokens.colors.textMuted,
  },
});

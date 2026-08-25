import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { tokens } from '@/theme/tokens';

/** Figma — Erro no fluxo de recuperação (RF003). */
export default function ForgotPasswordErrorScreen() {
  const { errorName, errorMessage, email, errorKind } = useLocalSearchParams<{
    errorName?: string;
    errorMessage?: string;
    email?: string;
    errorKind?: 'invalid-code' | 'send-failure' | 'generic';
  }>();

  const title = errorName?.trim() || 'Falha no envio';
  const message =
    errorMessage?.trim() ||
    'Não foi possível concluir a recuperação de senha. Tente novamente.';

  function handleDismiss() {
    if (errorKind === 'invalid-code' && email) {
      router.replace({
        pathname: '/(auth)/forgot-password/sent',
        params: { email },
      });
      return;
    }

    if (email) {
      router.replace({
        pathname: '/(auth)/forgot-password',
        params: { email },
      });
      return;
    }
    router.back();
  }

  return (
    <AuthScreenLayout>
      <View style={styles.headerBlock}>
        <Text
          style={styles.titleRow}
          accessibilityRole="header"
          accessibilityLabel={`Erro. ${title}`}>
          <Text style={styles.errorLabel}>Erro! </Text>
          <Text style={styles.errorName}>{title}</Text>
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <Button label="Entendi!" variant="outline" onPress={handleDismiss} />

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
  headerBlock: {
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  titleRow: {
    ...tokens.typography.title,
  },
  errorLabel: {
    color: tokens.colors.error,
    fontWeight: '700',
  },
  errorName: {
    color: tokens.colors.text,
    fontWeight: '700',
  },
  message: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
  },
  backLink: {
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
    justifyContent: 'center',
  },
  backLinkText: {
    ...tokens.typography.link,
    color: tokens.colors.link,
    fontWeight: '600',
  },
});

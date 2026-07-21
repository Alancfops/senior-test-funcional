import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/ui/OtpInput';
import { pushForgotPasswordError } from '@/features/auth/forgot-password-navigation';
import { tokens } from '@/theme/tokens';

/** Figma — Digite o código (RF003 passo 3). */
export default function ForgotPasswordCodeScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');

  function handleConfirm() {
    if (!email) {
      router.replace('/(auth)/forgot-password');
      return;
    }

    if (code.length !== 6) {
      pushForgotPasswordError(router, {
        errorName: 'Código incompleto',
        errorMessage: 'Digite os 6 dígitos enviados por e-mail.',
        email,
      });
      return;
    }

    router.push({
      pathname: '/(auth)/forgot-password/new-password',
      params: { email, token: code },
    });
  }

  return (
    <AuthScreenLayout title="Digite o código:">
      <OtpInput value={code} onChange={setCode} />

      <Button
        label="Confirmar Código"
        onPress={handleConfirm}
        disabled={code.length !== 6}
        accessibilityHint="Validar código de 6 dígitos"
      />

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

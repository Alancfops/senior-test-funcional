import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/ui/OtpInput';
import { tokens } from '@/theme/tokens';

/** Figma — Digite o código (RF003 passo 3). */
export default function ForgotPasswordCodeScreen() {
  const [code, setCode] = useState('');

  function handleConfirm() {
    if (code.length !== 6) {
      router.push('/(auth)/forgot-password/error');
      return;
    }
    router.push('/(auth)/forgot-password/new-password');
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

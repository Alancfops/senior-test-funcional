import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/ui/OtpInput';
import { verifyResetCodeRequest } from '@/features/auth/api';
import { pushForgotPasswordError } from '@/features/auth/forgot-password-navigation';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

const INVALID_CODE_MESSAGE =
  'Código inválido ou expirado. Se você pediu reenvio, use apenas o código do e-mail mais recente.';

/** Figma — Digite o código (RF003 passo 3). */
export default function ForgotPasswordCodeScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
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

    setSubmitting(true);
    try {
      await verifyResetCodeRequest(email, code);
      router.push({
        pathname: '/(auth)/forgot-password/new-password',
        params: { email, token: code },
      });
    } catch (error) {
      const message =
        error instanceof ApiError && error.statusCode === 401
          ? INVALID_CODE_MESSAGE
          : error instanceof ApiError
            ? error.message
            : 'Não foi possível validar o código. Tente novamente.';

      pushForgotPasswordError(router, {
        errorName: 'Código inválido',
        errorMessage: message,
        email,
        errorKind: 'invalid-code',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreenLayout title="Digite o código:">
      <OtpInput value={code} onChange={setCode} />

      <Button
        label="Confirmar Código"
        onPress={handleConfirm}
        disabled={code.length !== 6 || submitting}
        loading={submitting}
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

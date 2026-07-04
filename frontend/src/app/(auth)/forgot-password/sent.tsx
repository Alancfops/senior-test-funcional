import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { tokens } from '@/theme/tokens';

/** Figma — Confirmação / E-mail enviado (RF003 passo 2). */
export default function ForgotPasswordSentScreen() {
  return (
    <AuthScreenLayout
      title="Email enviado"
      subtitle="Enviamos o código de confirmação para email cadastrado. Por favor, verifique sua caixa de entrada.">
      <View style={styles.iconWrap} accessibilityLabel="E-mail enviado">
        <Ionicons name="mail-open-outline" size={96} color={tokens.colors.accentTeal} />
      </View>

      <Button label="Confirmar Código" onPress={() => router.push('/(auth)/forgot-password/code')} />

      <Pressable
        accessibilityRole="link"
        onPress={() => router.push('/(auth)/forgot-password/sent')}
        style={styles.resend}>
        <Text style={styles.resendText}>
          Não recebeu o email? <Text style={styles.resendLink}>Clique aqui para reenviar.</Text>
        </Text>
      </Pressable>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
  },
  resend: {
    marginTop: tokens.spacing.sm,
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
    justifyContent: 'center',
  },
  resendText: {
    ...tokens.typography.link,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  resendLink: {
    color: tokens.colors.link,
    fontWeight: '600',
  },
});

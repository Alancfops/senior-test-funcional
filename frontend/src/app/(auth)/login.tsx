import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { loginRequest } from '@/features/auth/api';
import { LoginFormValues, loginSchema } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api/client';
import { saveAccessToken } from '@/lib/auth/storage';
import { tokens } from '@/theme/tokens';

/** Figma — Login / Bem-Vindo (RF002). */
export default function LoginScreen() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      const { accessToken } = await loginRequest(values.email, values.password);
      await saveAccessToken(accessToken);
      router.replace('/(main)');
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setFormError('E-mail ou senha inválidos.');
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreenLayout
      headerFlex={1.85}
      bodyFlex={3.15}
      scrollable={false}
      title="Bem-Vindo"
      subtitle="Conecte-se e retome sua jornada no seu próprio ritmo.">
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Digite seu e-mail"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Digite sua senha"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureToggle
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        )}
      />

      <Link href="/(auth)/forgot-password" asChild>
        <Pressable accessibilityRole="link" style={styles.forgotRow} hitSlop={8}>
          <Ionicons name="information-circle-outline" size={16} color={tokens.colors.link} />
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </Pressable>
      </Link>

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}

      <Button label="Entrar" onPress={onSubmit} loading={submitting} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Não possui conta? </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable accessibilityRole="link">
            <Text style={styles.footerLink}>Clique aqui e faça seu cadastro</Text>
          </Pressable>
        </Link>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    minHeight: tokens.touchTargetMin,
    justifyContent: 'center',
  },
  forgotText: {
    ...tokens.typography.link,
    color: tokens.colors.link,
  },
  formError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
  },
  footer: {
    marginTop: tokens.spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...tokens.typography.link,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  footerLink: {
    color: tokens.colors.link,
    fontWeight: '600',
  },
});

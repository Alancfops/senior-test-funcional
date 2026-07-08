import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { ButtonRow } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { registerRequest } from '@/features/auth/api';
import { isMockAuthEnabled, mockLogin } from '@/features/auth/mock';
import { RegisterFormValues, registerSchema } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api/client';
import { saveAccessToken, saveSessionUser } from '@/lib/auth/storage';
import { tokens } from '@/theme/tokens';

/** Figma — Cadastro fisioterapeuta / Criar Conta (RF001). Tela branca full-screen, sem header azul. */
export default function RegisterScreen() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      if (isMockAuthEnabled()) {
        const session = mockLogin(values.email, values.password);
        await saveAccessToken(session.accessToken);
        await saveSessionUser({ fullName: values.fullName, email: values.email });
        router.replace('/(main)');
        return;
      }

      const { accessToken } = await registerRequest(values.fullName, values.email, values.password);
      await saveAccessToken(accessToken);
      await saveSessionUser({ fullName: values.fullName, email: values.email });
      router.replace('/(main)');
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 409) {
        setFormError('Este e-mail já está cadastrado.');
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError('Não foi possível concluir o cadastro. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreenLayout
      variant="plain"
      title="Criar Conta"
      subtitle="Preencha seus dados para realizar o cadastro do aplicativo.">
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Qual seu nome?"
            labelTone="neutral"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.fullName?.message}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Digite seu e-mail:"
            labelTone="neutral"
            required
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
            label="Crie uma senha forte:"
            labelTone="neutral"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureToggle
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Confirmar senha:"
            labelTone="neutral"
            required
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            secureToggle
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
        )}
      />

      <PasswordRequirements password={passwordValue} />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {formError}
        </Text>
      ) : null}

      <ButtonRow
        onBack={() => router.back()}
        actionLabel="Criar Conta"
        onAction={onSubmit}
        loading={submitting}
      />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  formError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
  },
});

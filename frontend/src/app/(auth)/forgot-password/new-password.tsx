import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { z } from 'zod';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { ButtonRow } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { resetPasswordRequest } from '@/features/auth/api';
import { pushForgotPasswordError } from '@/features/auth/forgot-password-navigation';
import { passwordSchema } from '@/features/auth/schemas';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

type NewPasswordForm = z.infer<typeof newPasswordSchema>;

/** Figma — Nova Senha (RF003 passo 4). */
export default function ForgotPasswordNewPasswordScreen() {
  const { email, token } = useLocalSearchParams<{ email?: string; token?: string }>();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async (values) => {
    if (!email || !token) {
      router.replace('/(auth)/forgot-password');
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      await resetPasswordRequest(email, token, values.password);
      router.replace('/(auth)/login');
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        pushForgotPasswordError(router, {
          errorName: 'Código inválido',
          errorMessage: error.message || 'Código inválido ou expirado. Solicite um novo e-mail.',
          email,
        });
        return;
      }
      if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError('Não foi possível alterar a senha. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreenLayout title="Nova Senha">
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Crie uma senha forte:"
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
        wideAction
        onBack={() => router.back()}
        actionLabel="Criar Nova Senha"
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

import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { ButtonRow } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { forgotPasswordRequest } from '@/features/auth/api';
import {
  pushForgotPasswordError,
  resolveForgotPasswordSendError,
} from '@/features/auth/forgot-password-navigation';

const emailOnlySchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Digite um e-mail válido'),
});

type EmailForm = z.infer<typeof emailOnlySchema>;

/** Figma — Esqueceu a Senha? (RF003 passo 1). */
export default function ForgotPasswordEmailScreen() {
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<EmailForm>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await forgotPasswordRequest(values.email.trim());
      router.push({
        pathname: '/(auth)/forgot-password/sent',
        params: { email: values.email.trim().toLowerCase() },
      });
    } catch (error) {
      const resolved = resolveForgotPasswordSendError(error);
      pushForgotPasswordError(router, {
        ...resolved,
        email: values.email.trim().toLowerCase(),
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthScreenLayout
      title="Esqueceu a Senha?"
      subtitle="Digite o e-mail cadastrado e enviaremos um código para você criar uma nova senha.">
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
            returnKeyType="send"
            onSubmitEditing={onSubmit}
          />
        )}
      />

      <ButtonRow
        onBack={() => router.back()}
        actionLabel="Enviar"
        onAction={onSubmit}
        loading={submitting}
      />
    </AuthScreenLayout>
  );
}

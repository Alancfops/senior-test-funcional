import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { ButtonRow } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { passwordSchema } from '@/features/auth/schemas';

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
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async () => {
    setSubmitting(true);
    // API RF003 pendente — navega ao login após UI concluída
    setTimeout(() => {
      setSubmitting(false);
      router.replace('/(auth)/login');
    }, 400);
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

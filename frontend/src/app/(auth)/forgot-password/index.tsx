import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { ButtonRow } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';

const emailOnlySchema = z.object({
  email: z.string().trim().min(1, 'Informe o e-mail.').email('Digite um e-mail válido'),
});

type EmailForm = z.infer<typeof emailOnlySchema>;

/** Figma — Esqueceu a Senha? (RF003 passo 1). */
export default function ForgotPasswordEmailScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<EmailForm>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(() => {
    router.push('/(auth)/forgot-password/sent');
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

      <ButtonRow onBack={() => router.back()} actionLabel="Enviar" onAction={onSubmit} />
    </AuthScreenLayout>
  );
}

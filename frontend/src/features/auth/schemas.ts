import { z } from 'zod';

import { passwordSchema } from '@/features/auth/password-rules';

const fullNameSchema = z
  .string()
  .trim()
  .min(1, 'Informe o nome completo.')
  .max(250, 'Nome muito longo (máx. 250 caracteres).')
  .regex(
    /^[A-Za-zÀ-ÿ\s]+$/,
    'Nome não pode conter números ou caracteres especiais.',
  );

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail.')
  .email('Digite um e-mail válido');

export { passwordSchema } from '@/features/auth/password-rules';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha.'),
});

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

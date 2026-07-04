import { z } from 'zod';

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

export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres.')
  .refine((value) => (value.match(/\d/g) ?? []).length >= 4, {
    message: 'A senha deve ter pelo menos 4 números.',
  })
  .refine((value) => (value.match(/[A-Za-zÀ-ÿ]/g) ?? []).length >= 2, {
    message: 'A senha deve ter pelo menos 2 letras.',
  })
  .refine((value) => /[A-ZÀ-Ý]/.test(value), {
    message: 'A senha deve ter pelo menos 1 letra maiúscula.',
  })
  .refine((value) => /[a-zà-ÿ]/.test(value), {
    message: 'A senha deve ter pelo menos 1 letra minúscula.',
  });

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

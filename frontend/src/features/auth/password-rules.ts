import { z } from 'zod';

export type PasswordRule = {
  label: string;
  test: (password: string) => boolean;
  message: string;
};

/** RF001 / RF003 — mesma política no front, back e checklist visual. */
export const passwordRules: PasswordRule[] = [
  {
    label: 'Mínimo de 8 caracteres',
    test: (password) => password.length >= 8,
    message: 'A senha deve ter no mínimo 8 caracteres.',
  },
  {
    label: 'Pelo menos 4 números',
    test: (password) => (password.match(/\d/g) ?? []).length >= 4,
    message: 'A senha deve ter pelo menos 4 números.',
  },
  {
    label: 'Pelo menos 2 letras',
    test: (password) => (password.match(/[A-Za-zÀ-ÿ]/g) ?? []).length >= 2,
    message: 'A senha deve ter pelo menos 2 letras.',
  },
  {
    label: 'Uma letra maiúscula',
    test: (password) => /[A-ZÀ-Ý]/.test(password),
    message: 'A senha deve ter pelo menos 1 letra maiúscula.',
  },
  {
    label: 'Uma letra minúscula',
    test: (password) => /[a-zà-ÿ]/.test(password),
    message: 'A senha deve ter pelo menos 1 letra minúscula.',
  },
];

export const passwordSchema = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.test, { message: rule.message }),
  z.string(),
);

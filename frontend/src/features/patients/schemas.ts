import { z } from 'zod';

import { GENDER_OPTIONS, GenderValue, SCHOOLING_OPTIONS, SchoolingValue } from '@/features/patients/constants';
import { BRAZIL_MOBILE_PHONE_DISPLAY_REGEX } from '@/lib/format/brazil-mobile-phone';

const genderValues = GENDER_OPTIONS.map((o) => o.value) as [string, ...string[]];
const schoolingValues = SCHOOLING_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const patientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Informe o nome completo.')
    .max(250, 'Nome muito longo (máx. 250 caracteres).')
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, 'Nome não pode conter números.'),
  age: z
    .string()
    .trim()
    .min(1, 'Informe a idade.')
    .refine((value) => /^\d+$/.test(value), 'Digite um valor válido')
    .refine((value) => {
      const n = Number(value);
      return n >= 0 && n <= 120;
    }, 'Digite um valor válido'),
  gender: z
    .string()
    .min(1, 'Selecione o sexo.')
    .refine(
      (value): value is GenderValue => genderValues.includes(value as GenderValue),
      'Selecione o sexo.',
    ),
  schoolingBand: z
    .string()
    .min(1, 'Selecione a escolaridade.')
    .refine(
      (value): value is SchoolingValue => schoolingValues.includes(value as SchoolingValue),
      'Selecione a escolaridade.',
    ),
  phone: z
    .string()
    .trim()
    .min(1, 'Informe e-mail ou telefone.')
    .refine(
      (value) =>
        BRAZIL_MOBILE_PHONE_DISPLAY_REGEX.test(value) ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      'Informe um e-mail ou telefone celular válido.',
    ),
});

export type PatientFormValues = {
  fullName: string;
  age: string;
  gender: string;
  schoolingBand: string;
  phone: string;
};

export function parsePatientAge(age: string) {
  return Number.parseInt(age, 10);
}

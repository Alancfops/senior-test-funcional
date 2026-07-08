import { z } from 'zod';

import { GENDER_OPTIONS, GenderValue, SCHOOLING_OPTIONS, SchoolingValue } from '@/features/patients/constants';

const genderValues = GENDER_OPTIONS.map((o) => o.value) as [string, ...string[]];
const schoolingValues = SCHOOLING_OPTIONS.map((o) => o.value) as [string, ...string[]];

const phoneRegex = /^(\(?\d{2}\)?\s?)?(?:9\s?)?\d{4}[-\s]?\d{4}$/;

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
    .refine(
      (value) => value === '' || schoolingValues.includes(value as SchoolingValue),
      'Selecione uma escolaridade válida.',
    ),
  phone: z
    .string()
    .trim()
    .min(1, 'Informe o telefone.')
    .regex(phoneRegex, 'Digite um telefone celular válido.'),
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

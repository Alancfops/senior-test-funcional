export const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'outro', label: 'Outro' },
] as const;

export const SCHOOLING_OPTIONS = [
  { value: 'analfabeto', label: 'Analfabeto' },
  { value: '1_4_anos', label: '1 a 4 anos de estudo' },
  { value: '5_8_anos', label: '5 a 8 anos de estudo' },
  { value: '9_11_anos', label: '9 a 11 anos de estudo' },
  { value: 'mais_11_anos', label: 'Mais de 11 anos de estudo' },
] as const;

export type GenderValue = (typeof GENDER_OPTIONS)[number]['value'];
export type SchoolingValue = (typeof SCHOOLING_OPTIONS)[number]['value'];

export function getGenderLabel(value: string) {
  return GENDER_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getSchoolingLabel(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return SCHOOLING_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: '1',
    patientName: 'Albertino Silva',
    description: 'Escala de Equilíbrio de Berg',
    when: 'Hoje',
  },
  {
    id: '2',
    patientName: 'Maria de Luordes',
    description: 'Sem testes cadastrados',
    when: '—',
  },
];

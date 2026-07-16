import type { QuestionnaireDefinition } from '@/features/assessments/types';

const KATZ_LEVELS = [
  { value: 'independente', label: 'Independente' },
  { value: 'assistencia', label: 'Assistência' },
  { value: 'dependente', label: 'Dependente' },
] as const;

/** Katz — 6 ABVD, três níveis por item (assess.md). */
export const KATZ_QUESTIONNAIRE: QuestionnaireDefinition = {
  code: 'katz',
  name: 'Índice de Katz',
  items: [
    {
      id: 'katz_1',
      title: 'Tomar banho',
      instructions:
        'Instruções: Avalie se o paciente toma banho (leito, banheira ou chuveiro) sem ajuda, com assistência parcial ou dependente.',
      config: { kind: 'categorical', options: KATZ_LEVELS },
    },
    {
      id: 'katz_2',
      title: 'Vestir-se',
      instructions:
        'Instruções: Inclui pegar roupas, vestir-se e manusear fechos ou órteses/próteses quando utilizadas.',
      config: { kind: 'categorical', options: KATZ_LEVELS },
    },
    {
      id: 'katz_3',
      title: 'Uso do vaso sanitário',
      instructions:
        'Instruções: Ida ao banheiro, higiene íntima e arrumação das roupas após eliminações.',
      config: { kind: 'categorical', options: KATZ_LEVELS },
    },
    {
      id: 'katz_4',
      title: 'Transferências',
      instructions:
        'Instruções: Deitar/levantar da cama e sentar/levantar da cadeira, com ou sem dispositivo de apoio.',
      config: { kind: 'categorical', options: KATZ_LEVELS },
    },
    {
      id: 'katz_5',
      title: 'Continência',
      instructions: 'Instruções: Controle de micção e evacuação.',
      config: { kind: 'categorical', options: KATZ_LEVELS },
    },
    {
      id: 'katz_6',
      title: 'Alimentação',
      instructions: 'Instruções: Alimentar-se, incluindo cortar carne ou passar manteiga quando necessário.',
      config: { kind: 'categorical', options: KATZ_LEVELS },
    },
  ],
};

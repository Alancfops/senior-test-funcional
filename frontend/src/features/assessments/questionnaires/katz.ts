import type { QuestionnaireDefinition } from '@/features/assessments/types';

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
      config: {
        kind: 'categorical',
        options: [
          { value: 'independente', label: 'Independente', description: 'Não recebe ajuda.' },
          {
            value: 'assistencia',
            label: 'Assistência',
            description: 'Recebe ajuda para lavar apenas uma parte do corpo (ex.: costas ou uma perna).',
          },
          {
            value: 'dependente',
            label: 'Dependente',
            description: 'Recebe ajuda para lavar mais de uma parte do corpo, ou não toma banho sozinho.',
          },
        ],
      },
    },
    {
      id: 'katz_2',
      title: 'Vestir-se',
      instructions:
        'Instruções: Inclui pegar roupas, vestir-se e manusear fechos ou órteses/próteses quando utilizadas.',
      config: {
        kind: 'categorical',
        options: [
          {
            value: 'independente',
            label: 'Independente',
            description: 'Pega as roupas e veste-se completamente, sem ajuda.',
          },
          {
            value: 'assistencia',
            label: 'Assistência',
            description: 'Veste-se sem ajuda, exceto para amarrar os sapatos.',
          },
          {
            value: 'dependente',
            label: 'Dependente',
            description: 'Recebe ajuda para pegar as roupas ou vestir-se, ou permanece sem roupa.',
          },
        ],
      },
    },
    {
      id: 'katz_3',
      title: 'Uso do vaso sanitário',
      instructions:
        'Instruções: Ida ao banheiro, higiene íntima e arrumação das roupas após eliminações.',
      config: {
        kind: 'categorical',
        options: [
          {
            value: 'independente',
            label: 'Independente',
            description: 'Vai ao banheiro, limpa-se e ajeita as roupas sem ajuda.',
          },
          {
            value: 'assistencia',
            label: 'Assistência',
            description: 'Recebe ajuda para ir, limpar-se, ajeitar roupas ou usar comadre/urinol.',
          },
          {
            value: 'dependente',
            label: 'Dependente',
            description: 'Não vai ao banheiro ou equivalente para eliminações fisiológicas.',
          },
        ],
      },
    },
    {
      id: 'katz_4',
      title: 'Transferências',
      instructions:
        'Instruções: Deitar/levantar da cama e sentar/levantar da cadeira, com ou sem dispositivo de apoio.',
      config: {
        kind: 'categorical',
        options: [
          {
            value: 'independente',
            label: 'Independente',
            description: 'Deita, levanta e senta sem ajuda (pode usar bengala ou andador).',
          },
          {
            value: 'assistencia',
            label: 'Assistência',
            description: 'Deita, levanta e/ou senta com ajuda.',
          },
          {
            value: 'dependente',
            label: 'Dependente',
            description: 'Não sai da cama.',
          },
        ],
      },
    },
    {
      id: 'katz_5',
      title: 'Continência',
      instructions: 'Instruções: Controle de micção e evacuação.',
      config: {
        kind: 'categorical',
        options: [
          {
            value: 'independente',
            label: 'Independente',
            description: 'Controla inteiramente a micção e a evacuação.',
          },
          {
            value: 'assistencia',
            label: 'Assistência',
            description: 'Tem acidentes ocasionais.',
          },
          {
            value: 'dependente',
            label: 'Dependente',
            description: 'Precisa de ajuda para controle ou usa cateter / é incontinente.',
          },
        ],
      },
    },
    {
      id: 'katz_6',
      title: 'Alimentação',
      instructions: 'Instruções: Alimentar-se, incluindo cortar carne ou passar manteiga quando necessário.',
      config: {
        kind: 'categorical',
        options: [
          {
            value: 'independente',
            label: 'Independente',
            description: 'Alimenta-se sem ajuda.',
          },
          {
            value: 'assistencia',
            label: 'Assistência',
            description: 'Alimenta-se sozinho, mas recebe ajuda para cortar carne ou passar manteiga.',
          },
          {
            value: 'dependente',
            label: 'Dependente',
            description: 'Recebe ajuda para alimentar-se ou é alimentado por outra pessoa.',
          },
        ],
      },
    },
  ],
};

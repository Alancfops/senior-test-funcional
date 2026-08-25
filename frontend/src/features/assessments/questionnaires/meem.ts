import type { QuestionnaireDefinition } from '@/features/assessments/types';
import { MEEM_ITEM_SCORE_LABELS } from '@/features/assessments/score-labels';

function meemNumeric(id: string, min: number, max: number) {
  return {
    kind: 'numeric' as const,
    min,
    max,
    scoreLabels: MEEM_ITEM_SCORE_LABELS[id],
  };
}

/** MEEM — blocos pontuáveis (assess.md / Folstein 1975). Sem total parcial na coleta (RF010). */
export const MEEM_QUESTIONNAIRE: QuestionnaireDefinition = {
  code: 'meem',
  name: 'Mini Exame do Estado Mental (MEEM)',
  items: [
    {
      id: 'meem_or_1',
      title: 'Orientação — dia da semana',
      instructions: 'Pergunte: Qual é o dia da semana?',
      config: meemNumeric('meem_or_1', 0, 1),
    },
    {
      id: 'meem_or_2',
      title: 'Orientação — dia do mês',
      instructions: 'Pergunte: Qual é o dia do mês?',
      config: meemNumeric('meem_or_2', 0, 1),
    },
    {
      id: 'meem_or_3',
      title: 'Orientação — mês',
      instructions: 'Pergunte: Qual é o mês?',
      config: meemNumeric('meem_or_3', 0, 1),
    },
    {
      id: 'meem_or_4',
      title: 'Orientação — ano',
      instructions: 'Pergunte: Qual é o ano?',
      config: meemNumeric('meem_or_4', 0, 1),
    },
    {
      id: 'meem_or_5',
      title: 'Orientação — hora',
      instructions: 'Pergunte: Qual é a hora aproximada?',
      config: meemNumeric('meem_or_5', 0, 1),
    },
    {
      id: 'meem_or_6',
      title: 'Orientação — local',
      instructions: 'Pergunte: Onde estamos? (local)',
      config: meemNumeric('meem_or_6', 0, 1),
    },
    {
      id: 'meem_or_7',
      title: 'Orientação — instituição',
      instructions: 'Pergunte: Instituição (casa, rua)?',
      config: meemNumeric('meem_or_7', 0, 1),
    },
    {
      id: 'meem_or_8',
      title: 'Orientação — bairro',
      instructions: 'Pergunte: Qual é o bairro?',
      config: meemNumeric('meem_or_8', 0, 1),
    },
    {
      id: 'meem_or_9',
      title: 'Orientação — cidade',
      instructions: 'Pergunte: Qual é a cidade?',
      config: meemNumeric('meem_or_9', 0, 1),
    },
    {
      id: 'meem_or_10',
      title: 'Orientação — estado',
      instructions: 'Pergunte: Qual é o estado?',
      config: meemNumeric('meem_or_10', 0, 1),
    },
    {
      id: 'meem_registro',
      title: 'Registro (memória imediata)',
      instructions:
        'Instruções: Mencione as palavras vaso, carro e tijolo. Peça para repetir. 1 ponto por palavra correta.',
      config: meemNumeric('meem_registro', 0, 3),
    },
    {
      id: 'meem_atencao',
      title: 'Atenção e cálculo',
      instructions:
        'Instruções: Sete seriado (100−7…) ou soletrar MUNDO de trás para frente. 1 ponto por resposta correta (máx. 5).',
      config: meemNumeric('meem_atencao', 0, 5),
    },
    {
      id: 'meem_evocacao',
      title: 'Evocação (lembrança)',
      instructions:
        'Instruções: Peça as 3 palavras do bloco de Registro. 1 ponto por palavra lembrada.',
      config: meemNumeric('meem_evocacao', 0, 3),
    },
    {
      id: 'meem_l1',
      title: 'Linguagem — nomeação',
      instructions:
        'Instruções: Aponte um lápis e um relógio. Peça para nomear. 1 ponto por objeto correto.',
      config: meemNumeric('meem_l1', 0, 2),
    },
    {
      id: 'meem_l2',
      title: 'Linguagem — repetição',
      instructions: 'Instruções: Peça para repetir: “nem aqui, nem ali, nem lá”.',
      config: meemNumeric('meem_l2', 0, 1),
    },
    {
      id: 'meem_l3',
      title: 'Linguagem — comando em 3 etapas',
      instructions:
        'Instruções: Pegue o papel com a mão direita, dobre ao meio e coloque na mesa. 1 ponto por etapa.',
      config: meemNumeric('meem_l3', 0, 3),
    },
    {
      id: 'meem_l4',
      title: 'Linguagem — leitura e obediência',
      instructions: 'Instruções: Peça para ler e obedecer: FECHE OS OLHOS.',
      config: meemNumeric('meem_l4', 0, 1),
    },
    {
      id: 'meem_l5',
      title: 'Linguagem — escrita',
      instructions:
        'Instruções: Peça para escrever uma frase com sujeito e objeto (ignore ortografia).',
      config: meemNumeric('meem_l5', 0, 1),
    },
    {
      id: 'meem_l6',
      title: 'Linguagem — cópia do desenho',
      instructions:
        'Instruções: Copie o desenho (interseção em quadrilátero com lados e ângulos preservados).',
      config: meemNumeric('meem_l6', 0, 1),
    },
  ],
};

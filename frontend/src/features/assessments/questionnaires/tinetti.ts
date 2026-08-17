import type { QuestionnaireDefinition } from '@/features/assessments/types';
import { TINETTI_ITEM_SCORE_LABELS } from '@/features/assessments/score-labels';

function tinettiNumeric(id: string, min: number, max: number) {
  return {
    kind: 'numeric' as const,
    min,
    max,
    scoreLabels: TINETTI_ITEM_SCORE_LABELS[id],
  };
}

/** Tinetti — 16 itens observacionais (assess.md / Tinetti 1986). */
export const TINETTI_QUESTIONNAIRE: QuestionnaireDefinition = {
  code: 'tinetti',
  name: 'Escala de Tinetti (ou POMA)',
  items: [
    {
      id: 'tinetti_1',
      title: 'Equilíbrio sentado',
      instructions: 'Observação: paciente sentado na cadeira de exame.',
      config: tinettiNumeric('tinetti_1', 0, 1),
    },
    {
      id: 'tinetti_2',
      title: 'Levantando',
      instructions: 'Observação: capacidade de levantar da cadeira.',
      config: tinettiNumeric('tinetti_2', 0, 2),
    },
    {
      id: 'tinetti_3',
      title: 'Tentativas de levantar',
      instructions: 'Observação: número de tentativas para levantar.',
      config: tinettiNumeric('tinetti_3', 0, 2),
    },
    {
      id: 'tinetti_4',
      title: 'Imediatamente após levantar',
      instructions: 'Observação: primeiros 5 segundos em pé após levantar.',
      config: tinettiNumeric('tinetti_4', 0, 2),
    },
    {
      id: 'tinetti_5',
      title: 'Equilíbrio em pé',
      instructions: 'Observação: estabilidade em pé, base de sustentação.',
      config: tinettiNumeric('tinetti_5', 0, 2),
    },
    {
      id: 'tinetti_6',
      title: 'Teste dos três tempos',
      instructions:
        'Instruções: examinador empurra levemente o esterno; paciente com pés juntos.',
      config: tinettiNumeric('tinetti_6', 0, 2),
    },
    {
      id: 'tinetti_7',
      title: 'Olhos fechados',
      instructions: 'Observação: equilíbrio em pé, pés juntos, olhos fechados.',
      config: tinettiNumeric('tinetti_7', 0, 1),
    },
    {
      id: 'tinetti_8',
      title: 'Girando 360°',
      instructions: 'Observação: giro completo de 360 graus.',
      config: tinettiNumeric('tinetti_8', 0, 2),
    },
    {
      id: 'tinetti_9',
      title: 'Sentando',
      instructions: 'Observação: sentar-se na cadeira com segurança.',
      config: tinettiNumeric('tinetti_9', 0, 2),
    },
    {
      id: 'tinetti_10',
      title: 'Iniciação da marcha',
      instructions:
        'Instruções: paciente caminha no ritmo usual e depois rápido, com dispositivos usuais.',
      config: tinettiNumeric('tinetti_10', 0, 1),
    },
    {
      id: 'tinetti_11',
      title: 'Comprimento e altura do passo',
      instructions:
        'Observação: avalie comprimento e altura do passo de cada perna em balanceio (até 4 pontos no total).',
      config: {
        kind: 'composite_sum',
        payloadKey: 'tinetti_11',
        min: 0,
        max: 4,
        parts: [
          {
            id: 'tinetti_11_rd_len',
            title: 'a) Perna direita — comprimento',
            options: [
              { value: 0, label: 'Não passa o membro esquerdo (0)' },
              { value: 1, label: 'Passa o membro esquerdo (1)' },
            ],
          },
          {
            id: 'tinetti_11_rd_hgt',
            title: 'a) Perna direita — altura',
            options: [
              { value: 0, label: 'Pé direito não se afasta do solo (0)' },
              { value: 1, label: 'Pé direito se afasta completamente do solo (1)' },
            ],
          },
          {
            id: 'tinetti_11_le_len',
            title: 'b) Perna esquerda — comprimento',
            options: [
              { value: 0, label: 'Não passa o membro direito (0)' },
              { value: 1, label: 'Passa o membro direito (1)' },
            ],
          },
          {
            id: 'tinetti_11_le_hgt',
            title: 'b) Perna esquerda — altura',
            options: [
              { value: 0, label: 'Pé esquerdo não se afasta do solo (0)' },
              { value: 1, label: 'Pé esquerdo se afasta completamente do solo (1)' },
            ],
          },
        ],
      },
    },
    {
      id: 'tinetti_12',
      title: 'Simetria do passo',
      instructions: 'Observação: passos direito e esquerdo simétricos.',
      config: tinettiNumeric('tinetti_12', 0, 1),
    },
    {
      id: 'tinetti_13',
      title: 'Continuidade do passo',
      instructions: 'Observação: passos contínuos, sem paradas.',
      config: tinettiNumeric('tinetti_13', 0, 1),
    },
    {
      id: 'tinetti_14',
      title: 'Desvio da linha reta',
      instructions: 'Observação: caminhada em linha reta (~3 m).',
      config: tinettiNumeric('tinetti_14', 0, 2),
    },
    {
      id: 'tinetti_15',
      title: 'Tronco',
      instructions: 'Observação: oscilação do tronco e uso dos braços na marcha.',
      config: tinettiNumeric('tinetti_15', 0, 2),
    },
    {
      id: 'tinetti_16',
      title: 'Base de apoio',
      instructions: 'Observação: distância entre calcanhares durante a marcha.',
      config: tinettiNumeric('tinetti_16', 0, 1),
    },
  ],
};

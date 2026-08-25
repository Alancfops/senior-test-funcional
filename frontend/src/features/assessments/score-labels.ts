import type { NumericItemConfig } from '@/features/assessments/types';

/** Escala 0–4 generalizada — Berg (Miyamoto 2004). Mesma legenda em todos os 14 itens. */
export const BERG_GENERAL_SCORE_LABELS: NumericItemConfig['scoreLabels'] = [
  { score: 0, label: 'Incapaz de completar a tarefa ou necessita ajuda máxima.' },
  { score: 1, label: 'Executa com ajuda mínima ou de forma muito limitada.' },
  { score: 2, label: 'Completa com dificuldade, supervisão ou várias tentativas.' },
  { score: 3, label: 'Completa com uso das mãos ou supervisão leve.' },
  { score: 4, label: 'Execução independente e segura.' },
];

/** Legendas por item — Tinetti (assess.md / Tinetti 1986). Item 11 usa coleta composta. */
export const TINETTI_ITEM_SCORE_LABELS: Record<string, NumericItemConfig['scoreLabels']> = {
  tinetti_1: [
    { score: 0, label: 'Escorrega.' },
    { score: 1, label: 'Equilíbrio.' },
  ],
  tinetti_2: [
    { score: 0, label: 'Incapaz.' },
    { score: 1, label: 'Usa os braços.' },
    { score: 2, label: 'Sem os braços.' },
  ],
  tinetti_3: [
    { score: 0, label: 'Incapaz.' },
    { score: 1, label: 'Mais de uma tentativa.' },
    { score: 2, label: 'Única tentativa.' },
  ],
  tinetti_4: [
    { score: 0, label: 'Desequilibrado.' },
    { score: 1, label: 'Estável, mas usa suporte.' },
    { score: 2, label: 'Estável, sem suporte.' },
  ],
  tinetti_5: [
    { score: 0, label: 'Desequilibrado.' },
    { score: 1, label: 'Suporte ou base de sustentação > 12 cm.' },
    { score: 2, label: 'Sem suporte e base estreita.' },
  ],
  tinetti_6: [
    { score: 0, label: 'Começa a cair.' },
    { score: 1, label: 'Agarra ou balança os braços.' },
    { score: 2, label: 'Equilibrado.' },
  ],
  tinetti_7: [
    { score: 0, label: 'Desequilíbrio, instável.' },
    { score: 1, label: 'Equilibrado.' },
  ],
  tinetti_8: [
    { score: 0, label: 'Passos descontínuos.' },
    { score: 1, label: 'Instável (desequilíbrios).' },
    { score: 2, label: 'Estável (equilibrado).' },
  ],
  tinetti_9: [
    { score: 0, label: 'Inseguro (erra a distância ou cai na cadeira).' },
    { score: 1, label: 'Usa os braços ou movimentação abrupta.' },
    { score: 2, label: 'Seguro, movimentação suave.' },
  ],
  tinetti_10: [
    { score: 0, label: 'Hesitação ou múltiplas tentativas para iniciar.' },
    { score: 1, label: 'Sem hesitação.' },
  ],
  tinetti_12: [
    { score: 0, label: 'Passos direito e esquerdo desiguais.' },
    { score: 1, label: 'Passos direito e esquerdo parecem iguais.' },
  ],
  tinetti_13: [
    { score: 0, label: 'Parada ou descontinuidade entre os passos.' },
    { score: 1, label: 'Passos parecem contínuos.' },
  ],
  tinetti_14: [
    { score: 0, label: 'Desvio marcado.' },
    { score: 1, label: 'Desvio leve/moderado ou usa dispositivo de marcha.' },
    { score: 2, label: 'Caminha em linha reta sem dispositivo.' },
  ],
  tinetti_15: [
    { score: 0, label: 'Oscilação marcada ou usa dispositivo de marcha.' },
    { score: 1, label: 'Sem oscilação, mas flexão dos joelhos, dor lombar ou braços afastados.' },
    { score: 2, label: 'Sem oscilação, flexão ou uso dos braços/dispositivo.' },
  ],
  tinetti_16: [
    { score: 0, label: 'Calcanhares afastados.' },
    { score: 1, label: 'Calcanhares quase se tocando durante a marcha.' },
  ],
};

export const TINETTI_11_PART_IDS = [
  'tinetti_11_rd_len',
  'tinetti_11_rd_hgt',
  'tinetti_11_le_len',
  'tinetti_11_le_hgt',
] as const;

export function getScoreLabelForValue(
  labels: NumericItemConfig['scoreLabels'] | undefined,
  value: number | null,
): string | null {
  if (!labels || value === null) {
    return null;
  }

  return labels.find((entry) => entry.score === value)?.label ?? null;
}

/** MEEM — item binário (0/1): acerto na resposta. */
export const MEEM_BINARY_SCORE_LABELS: NumericItemConfig['scoreLabels'] = [
  { score: 0, label: 'Resposta incorreta ou ausente.' },
  { score: 1, label: 'Resposta correta.' },
];

/** MEEM — blocos com contagem de acertos (registro, evocação). */
export const MEEM_THREE_WORD_SCORE_LABELS: NumericItemConfig['scoreLabels'] = [
  { score: 0, label: 'Nenhuma palavra correta.' },
  { score: 1, label: '1 palavra correta.' },
  { score: 2, label: '2 palavras corretas.' },
  { score: 3, label: '3 palavras corretas.' },
];

/** MEEM — atenção e cálculo (0–5 acertos). */
export const MEEM_ATTENTION_SCORE_LABELS: NumericItemConfig['scoreLabels'] = [
  { score: 0, label: 'Nenhuma resposta correta.' },
  { score: 1, label: '1 resposta correta.' },
  { score: 2, label: '2 respostas corretas.' },
  { score: 3, label: '3 respostas corretas.' },
  { score: 4, label: '4 respostas corretas.' },
  { score: 5, label: '5 respostas corretas (máximo do bloco).' },
];

/** MEEM — nomeação de objetos (0–2). */
export const MEEM_NAMING_SCORE_LABELS: NumericItemConfig['scoreLabels'] = [
  { score: 0, label: 'Nenhum objeto nomeado corretamente.' },
  { score: 1, label: '1 objeto nomeado corretamente.' },
  { score: 2, label: '2 objetos nomeados corretamente.' },
];

/** MEEM — comando em 3 etapas (0–3). */
export const MEEM_THREE_STEP_SCORE_LABELS: NumericItemConfig['scoreLabels'] = [
  { score: 0, label: 'Nenhuma etapa executada corretamente.' },
  { score: 1, label: '1 etapa correta.' },
  { score: 2, label: '2 etapas corretas.' },
  { score: 3, label: '3 etapas corretas (comando completo).' },
];

export const MEEM_ITEM_SCORE_LABELS: Record<string, NumericItemConfig['scoreLabels']> = {
  meem_or_1: MEEM_BINARY_SCORE_LABELS,
  meem_or_2: MEEM_BINARY_SCORE_LABELS,
  meem_or_3: MEEM_BINARY_SCORE_LABELS,
  meem_or_4: MEEM_BINARY_SCORE_LABELS,
  meem_or_5: MEEM_BINARY_SCORE_LABELS,
  meem_or_6: MEEM_BINARY_SCORE_LABELS,
  meem_or_7: MEEM_BINARY_SCORE_LABELS,
  meem_or_8: MEEM_BINARY_SCORE_LABELS,
  meem_or_9: MEEM_BINARY_SCORE_LABELS,
  meem_or_10: MEEM_BINARY_SCORE_LABELS,
  meem_registro: MEEM_THREE_WORD_SCORE_LABELS,
  meem_atencao: MEEM_ATTENTION_SCORE_LABELS,
  meem_evocacao: MEEM_THREE_WORD_SCORE_LABELS,
  meem_l1: MEEM_NAMING_SCORE_LABELS,
  meem_l2: MEEM_BINARY_SCORE_LABELS,
  meem_l3: MEEM_THREE_STEP_SCORE_LABELS,
  meem_l4: MEEM_BINARY_SCORE_LABELS,
  meem_l5: MEEM_BINARY_SCORE_LABELS,
  meem_l6: MEEM_BINARY_SCORE_LABELS,
};

export function getCategoricalDescriptionForValue(
  options: readonly { value: string; description?: string }[],
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value)?.description ?? null;
}

export function getOptionDescriptionForValue(
  options: readonly { value: number; label: string; description?: string }[],
  value: number | null | undefined,
): string | null {
  if (typeof value !== 'number') {
    return null;
  }

  const option = options.find((entry) => entry.value === value);
  if (!option) {
    return null;
  }

  return option.description ?? option.label;
}

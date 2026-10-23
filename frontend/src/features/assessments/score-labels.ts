import type { NumericItemConfig } from '@/features/assessments/types';

/** Legendas por item — Berg (assess.md §3 / Miyamoto 2004). Critérios 0–4 variam por item. */
export const BERG_ITEM_SCORE_LABELS: Record<string, NumericItemConfig['scoreLabels']> = {
  berg_1: [
    { score: 0, label: 'Necessita de ajuda moderada ou máxima para levantar-se.' },
    { score: 1, label: 'Necessita de ajuda mínima para levantar-se ou estabilizar-se.' },
    { score: 2, label: 'Capaz de levantar-se utilizando as mãos após diversas tentativas.' },
    { score: 3, label: 'Capaz de levantar-se independentemente utilizando as mãos.' },
    { score: 4, label: 'Capaz de levantar-se sem utilizar as mãos e estabilizar-se independentemente.' },
  ],
  berg_2: [
    { score: 0, label: 'Incapaz de permanecer em pé por 30 segundos sem apoio.' },
    { score: 1, label: 'Necessita de várias tentativas para permanecer em pé por 30 segundos sem apoio.' },
    { score: 2, label: 'Capaz de permanecer em pé por 30 segundos sem apoio.' },
    { score: 3, label: 'Capaz de permanecer em pé por 2 minutos com supervisão.' },
    { score: 4, label: 'Capaz de permanecer em pé com segurança por 2 minutos.' },
  ],
  berg_3: [
    { score: 0, label: 'Incapaz de permanecer sentado sem apoio durante 10 segundos.' },
    { score: 1, label: 'Capaz de permanecer sentado por 10 segundos.' },
    { score: 2, label: 'Capaz de permanecer sentado por 30 segundos.' },
    { score: 3, label: 'Capaz de permanecer sentado por 2 minutos sob supervisão.' },
    { score: 4, label: 'Capaz de permanecer sentado com segurança e com firmeza por 2 minutos.' },
  ],
  berg_4: [
    { score: 0, label: 'Necessita de ajuda para sentar-se.' },
    { score: 1, label: 'Senta-se independentemente, mas tem descida sem controle.' },
    { score: 2, label: 'Utiliza a parte posterior das pernas contra a cadeira para controlar a descida.' },
    { score: 3, label: 'Controla a descida utilizando as mãos.' },
    { score: 4, label: 'Senta-se com segurança com uso mínimo das mãos.' },
  ],
  berg_5: [
    { score: 0, label: 'Necessita de duas pessoas para ajudar ou supervisionar para realizar a tarefa com segurança.' },
    { score: 1, label: 'Necessita de uma pessoa para ajudar.' },
    { score: 2, label: 'Capaz de transferir-se seguindo orientações verbais e/ou supervisão.' },
    { score: 3, label: 'Capaz de transferir-se com segurança com o uso das mãos.' },
    { score: 4, label: 'Capaz de transferir-se com segurança com uso mínimo das mãos.' },
  ],
  berg_6: [
    { score: 0, label: 'Necessita de ajuda para não cair.' },
    { score: 1, label: 'Incapaz de permanecer com os olhos fechados durante 3 segundos, mas mantém-se em pé.' },
    { score: 2, label: 'Capaz de permanecer em pé por 3 segundos.' },
    { score: 3, label: 'Capaz de permanecer em pé por 10 segundos com supervisão.' },
    { score: 4, label: 'Capaz de permanecer em pé por 10 segundos com segurança.' },
  ],
  berg_7: [
    { score: 0, label: 'Necessita de ajuda para posicionar-se e é incapaz de permanecer nessa posição por 15 segundos.' },
    { score: 1, label: 'Necessita de ajuda para posicionar-se, mas é capaz de permanecer com os pés juntos durante 15 segundos.' },
    { score: 2, label: 'Capaz de posicionar os pés juntos independentemente e permanecer por 30 segundos.' },
    { score: 3, label: 'Capaz de posicionar os pés juntos independentemente e permanecer por 1 minuto com supervisão.' },
    { score: 4, label: 'Capaz de posicionar os pés juntos independentemente e permanecer por 1 minuto com segurança.' },
  ],
  berg_8: [
    { score: 0, label: 'Perde o equilíbrio na tentativa, ou necessita de apoio externo.' },
    { score: 1, label: 'Pode avançar à frente, mas necessita de supervisão.' },
    { score: 2, label: 'Pode avançar à frente > 5 cm com segurança.' },
    { score: 3, label: 'Pode avançar à frente > 12,5 cm com segurança.' },
    { score: 4, label: 'Pode avançar à frente > 25 cm com segurança.' },
  ],
  berg_9: [
    { score: 0, label: 'Incapaz de tentar, ou necessita de ajuda para não perder o equilíbrio ou cair.' },
    { score: 1, label: 'Incapaz de pegá-lo, necessitando de supervisão enquanto está tentando.' },
    { score: 2, label: 'Incapaz de pegá-lo, mas se estica até ficar a 2–5 cm do chinelo e mantém o equilíbrio independentemente.' },
    { score: 3, label: 'Capaz de pegar o chinelo, mas necessita de supervisão.' },
    { score: 4, label: 'Capaz de pegar o chinelo com facilidade e segurança.' },
  ],
  berg_10: [
    { score: 0, label: 'Necessita de ajuda para não perder o equilíbrio ou cair.' },
    { score: 1, label: 'Necessita de supervisão para virar.' },
    { score: 2, label: 'Vira somente para os lados, mas mantém o equilíbrio.' },
    { score: 3, label: 'Olha para trás somente de um lado, o lado contrário demonstra menor distribuição do peso.' },
    { score: 4, label: 'Olha para trás de ambos os lados com uma boa distribuição do peso.' },
  ],
  berg_11: [
    { score: 0, label: 'Necessita de ajuda enquanto gira.' },
    { score: 1, label: 'Necessita de supervisão próxima ou orientações verbais.' },
    { score: 2, label: 'Capaz de girar 360 graus com segurança, mas lentamente.' },
    { score: 3, label: 'Capaz de girar 360 graus com segurança somente para um lado em 4 segundos ou menos.' },
    { score: 4, label: 'Capaz de girar 360 graus com segurança em 4 segundos ou menos.' },
  ],
  berg_12: [
    { score: 0, label: 'Incapaz de tentar, ou necessita de ajuda para não cair.' },
    { score: 1, label: 'Capaz de completar > 2 movimentos com o mínimo de ajuda.' },
    { score: 2, label: 'Capaz de completar 4 movimentos sem ajuda.' },
    { score: 3, label: 'Capaz de permanecer em pé independentemente e completar 8 movimentos em > 20 segundos.' },
    { score: 4, label: 'Capaz de permanecer em pé independentemente e com segurança, completando 8 movimentos em 20 segundos.' },
  ],
  berg_13: [
    { score: 0, label: 'Perde o equilíbrio ao tentar dar um passo ou ficar de pé.' },
    { score: 1, label: 'Necessita de ajuda para dar o passo, porém permanece por 15 segundos.' },
    { score: 2, label: 'Capaz de dar um pequeno passo, independentemente, e permanecer por 30 segundos.' },
    { score: 3, label: 'Capaz de colocar um pé um pouco mais à frente do outro e levemente para o lado, independentemente, e permanecer por 30 segundos.' },
    { score: 4, label: 'Capaz de colocar um pé imediatamente à frente do outro, independentemente, e permanecer por 30 segundos.' },
  ],
  berg_14: [
    { score: 0, label: 'Incapaz de tentar, ou necessita de ajuda para não cair.' },
    { score: 1, label: 'Tenta levantar uma perna, mas é incapaz de permanecer por 3 segundos, embora permaneça em pé independentemente.' },
    { score: 2, label: 'Capaz de levantar uma perna independentemente e permanecer por ≥ 3 segundos.' },
    { score: 3, label: 'Capaz de levantar uma perna independentemente e permanecer por 5–10 segundos.' },
    { score: 4, label: 'Capaz de levantar uma perna independentemente e permanecer por > 10 segundos.' },
  ],
};

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
  value: number | string | null | undefined,
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

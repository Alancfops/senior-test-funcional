import type { QuestionnaireDefinition } from '@/features/assessments/types';

/** Tinetti — 16 itens observacionais (assess.md / Tinetti 1986). */
export const TINETTI_QUESTIONNAIRE: QuestionnaireDefinition = {
  code: 'tinetti',
  name: 'Escala de Tinetti (ou POMA)',
  items: [
    {
      id: 'tinetti_1',
      title: 'Equilíbrio sentado',
      instructions: 'Observação: paciente sentado na cadeira de exame.',
      config: { kind: 'numeric', min: 0, max: 1 },
    },
    {
      id: 'tinetti_2',
      title: 'Levantando',
      instructions: 'Observação: capacidade de levantar da cadeira.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_3',
      title: 'Tentativas de levantar',
      instructions: 'Observação: número de tentativas para levantar.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_4',
      title: 'Imediatamente após levantar',
      instructions: 'Observação: primeiros 5 segundos em pé após levantar.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_5',
      title: 'Equilíbrio em pé',
      instructions: 'Observação: estabilidade em pé, base de sustentação.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_6',
      title: 'Teste dos três tempos',
      instructions:
        'Instruções: examinador empurra levemente o esterno; paciente com pés juntos.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_7',
      title: 'Olhos fechados',
      instructions: 'Observação: equilíbrio em pé, pés juntos, olhos fechados.',
      config: { kind: 'numeric', min: 0, max: 1 },
    },
    {
      id: 'tinetti_8',
      title: 'Girando 360°',
      instructions: 'Observação: giro completo de 360 graus.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_9',
      title: 'Sentando',
      instructions: 'Observação: sentar-se na cadeira com segurança.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_10',
      title: 'Iniciação da marcha',
      instructions:
        'Instruções: paciente caminha no ritmo usual e depois rápido, com dispositivos usuais.',
      config: { kind: 'numeric', min: 0, max: 1 },
    },
    {
      id: 'tinetti_11',
      title: 'Comprimento e altura do passo',
      instructions:
        'Observação: comprimento e altura do passo das pernas direita e esquerda (até 4 pontos).',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'tinetti_12',
      title: 'Simetria do passo',
      instructions: 'Observação: passos direito e esquerdo simétricos.',
      config: { kind: 'numeric', min: 0, max: 1 },
    },
    {
      id: 'tinetti_13',
      title: 'Continuidade do passo',
      instructions: 'Observação: passos contínuos, sem paradas.',
      config: { kind: 'numeric', min: 0, max: 1 },
    },
    {
      id: 'tinetti_14',
      title: 'Desvio da linha reta',
      instructions: 'Observação: caminhada em linha reta (~3 m).',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_15',
      title: 'Tronco',
      instructions: 'Observação: oscilação do tronco e uso dos braços na marcha.',
      config: { kind: 'numeric', min: 0, max: 2 },
    },
    {
      id: 'tinetti_16',
      title: 'Base de apoio',
      instructions: 'Observação: distância entre calcanhares durante a marcha.',
      config: { kind: 'numeric', min: 0, max: 1 },
    },
  ],
};

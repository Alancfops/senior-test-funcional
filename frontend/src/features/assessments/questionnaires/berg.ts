import type { QuestionnaireDefinition } from '@/features/assessments/types';

/** Berg — 14 itens, 0–4 (assess.md / Miyamoto 2004). */
export const BERG_QUESTIONNAIRE: QuestionnaireDefinition = {
  code: 'berg',
  name: 'Escala de Equilíbrio de Berg',
  items: [
    {
      id: 'berg_1',
      title: 'Sentado — em pé',
      instructions: 'Instruções: Levante-se. Tente não usar as mãos para se apoiar.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_2',
      title: 'Em pé sem apoio',
      instructions: 'Instruções: Fique em pé por 2 minutos sem se apoiar.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_3',
      title: 'Sentado sem apoio',
      instructions:
        'Instruções: Fique sentado sem apoiar as costas, com os braços cruzados, por 2 minutos.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_4',
      title: 'Em pé para sentado',
      instructions: 'Instruções: Sente-se.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_5',
      title: 'Transferência',
      instructions:
        'Instruções: Transfira-se de uma cadeira com apoio de braço para uma sem apoio, e vice-versa.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_6',
      title: 'Em pé — olhos fechados',
      instructions: 'Instruções: Fique em pé e feche os olhos por 10 segundos.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_7',
      title: 'Em pé — pés juntos',
      instructions: 'Instruções: Junte os pés e fique em pé sem se apoiar.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_8',
      title: 'Alcançar à frente',
      instructions:
        'Instruções: Levante o braço a 90° e tente alcançar à frente o máximo possível, mantendo-se em pé.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_9',
      title: 'Pegar objeto do chão',
      instructions: 'Instruções: Pegue o sapato/chinelo que está na frente dos seus pés.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_10',
      title: 'Olhar para trás',
      instructions:
        'Instruções: Vire-se para olhar por cima do ombro esquerdo e direito, mantendo os pés no chão.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_11',
      title: 'Girar 360°',
      instructions:
        'Instruções: Gire-se completamente. Pause. Gire-se no sentido contrário.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_12',
      title: 'Pés alternados no degrau',
      instructions:
        'Instruções: Toque cada pé alternadamente no degrau/banquinho (4 vezes cada pé).',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_13',
      title: 'Um pé à frente',
      instructions:
        'Instruções: Coloque um pé à frente do outro e permaneça em pé sem apoio.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
    {
      id: 'berg_14',
      title: 'Em pé sobre uma perna',
      instructions: 'Instruções: Fique em pé sobre uma perna o máximo que conseguir.',
      config: { kind: 'numeric', min: 0, max: 4 },
    },
  ],
};

import type { QuestionnaireDefinition } from '@/features/assessments/types';
import { BERG_ITEM_SCORE_LABELS } from '@/features/assessments/score-labels';

function bergNumeric(id: string) {
  return { kind: 'numeric' as const, min: 0, max: 4, scoreLabels: BERG_ITEM_SCORE_LABELS[id] };
}

/** Berg — 14 itens, 0–4 (assess.md / Miyamoto 2004). */
export const BERG_QUESTIONNAIRE: QuestionnaireDefinition = {
  code: 'berg',
  name: 'Escala de Equilíbrio de Berg',
  items: [
    {
      id: 'berg_1',
      title: 'Sentado — em pé',
      instructions: 'Instruções: Levante-se. Tente não usar as mãos para se apoiar.',
      config: bergNumeric('berg_1'),
    },
    {
      id: 'berg_2',
      title: 'Em pé sem apoio',
      instructions: 'Instruções: Fique em pé por 2 minutos sem se apoiar.',
      config: bergNumeric('berg_2'),
    },
    {
      id: 'berg_3',
      title: 'Sentado sem apoio nas costas',
      instructions:
        'Instruções: Com os pés apoiados no chão ou num banquinho, fique sentado sem apoiar as costas, com os braços cruzados, por 2 minutos.',
      config: bergNumeric('berg_3'),
    },
    {
      id: 'berg_4',
      title: 'Em pé para sentado',
      instructions: 'Instruções: Sente-se.',
      config: bergNumeric('berg_4'),
    },
    {
      id: 'berg_5',
      title: 'Transferência',
      instructions:
        'Instruções: Arrume as cadeiras perpendicularmente ou uma de frente para a outra para uma transferência em pivô. Peça ao paciente para transferir-se de uma cadeira com apoio de braço para uma sem apoio de braço, e vice-versa. Pode-se usar duas cadeiras (uma com e outra sem apoio de braço) ou uma cama e uma cadeira.',
      config: bergNumeric('berg_5'),
    },
    {
      id: 'berg_6',
      title: 'Em pé — olhos fechados',
      instructions: 'Instruções: Fique em pé e feche os olhos por 10 segundos.',
      config: bergNumeric('berg_6'),
    },
    {
      id: 'berg_7',
      title: 'Em pé — pés juntos',
      instructions: 'Instruções: Junte os pés e fique em pé sem se apoiar.',
      config: bergNumeric('berg_7'),
    },
    {
      id: 'berg_8',
      title: 'Alcançar à frente',
      instructions:
        'Instruções: Levante o braço a 90°. Estique os dedos e tente alcançar à frente o mais longe possível. O examinador posiciona a régua no fim da ponta dos dedos com o braço a 90°; ao esticar, os dedos não devem tocar a régua. Registre a distância alcançada na inclinação máxima. Quando possível, peça para usar ambos os braços para evitar rotação do tronco.',
      config: bergNumeric('berg_8'),
    },
    {
      id: 'berg_9',
      title: 'Pegar objeto do chão',
      instructions: 'Instruções: Pegue o sapato/chinelo que está na frente dos seus pés.',
      config: bergNumeric('berg_9'),
    },
    {
      id: 'berg_10',
      title: 'Olhar para trás',
      instructions:
        'Instruções: Vire-se para olhar diretamente atrás de você por cima do ombro esquerdo, sem tirar os pés do chão. Faça o mesmo por cima do ombro direito. O examinador pode posicionar um objeto diretamente atrás do paciente para estimular o movimento.',
      config: bergNumeric('berg_10'),
    },
    {
      id: 'berg_11',
      title: 'Girar 360°',
      instructions:
        'Instruções: Gire-se completamente. Pause. Gire-se no sentido contrário.',
      config: bergNumeric('berg_11'),
    },
    {
      id: 'berg_12',
      title: 'Pés alternados no degrau',
      instructions:
        'Instruções: Toque cada pé alternadamente no degrau/banquinho (4 vezes cada pé).',
      config: bergNumeric('berg_12'),
    },
    {
      id: 'berg_13',
      title: 'Um pé à frente',
      instructions:
        'Instruções: (Demonstre para o paciente.) Coloque um pé diretamente à frente do outro, na mesma linha; se achar que não irá conseguir, coloque o pé um pouco mais à frente do outro e levemente para o lado.',
      config: bergNumeric('berg_13'),
    },
    {
      id: 'berg_14',
      title: 'Em pé sobre uma perna',
      instructions: 'Instruções: Fique em pé sobre uma perna o máximo que conseguir.',
      config: bergNumeric('berg_14'),
    },
  ],
};

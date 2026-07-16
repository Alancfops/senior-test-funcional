import { ImageSourcePropType } from 'react-native';

export const TUG_TRIAL_COUNT = 3;

export const TUG_TRIALS = [
  {
    index: 0,
    label: 'Primeiro Ensaio',
    progress: '01/03',
    image: require('@/assets/images/instruments/tug/trial-1.png') as ImageSourcePropType,
    instructions:
      'Parta sentado na cadeira, costas apoiadas e braços nos apoios. Ao comando, levante-se, caminhe 3 metros, gire, retorne e sente-se. O tempo começa ao iniciar o levantamento e termina ao sentar.',
  },
  {
    index: 1,
    label: 'Segundo Ensaio',
    progress: '02/03',
    image: require('@/assets/images/instruments/tug/trial-2.png') as ImageSourcePropType,
    instructions:
      'Repita o percurso em linha reta de 3 metros até o marco, utilizando o dispositivo auxiliar habitual do paciente, se houver. Registre o tempo total do ensaio após a tentativa prática.',
  },
  {
    index: 2,
    label: 'Terceiro Ensaio',
    progress: '03/03',
    image: require('@/assets/images/instruments/tug/trial-3.png') as ImageSourcePropType,
    instructions:
      'Realize o terceiro ensaio com o mesmo comando padronizado. Gire no marco conforme o protocolo e retorne à cadeira antes de parar o cronômetro.',
  },
] as const;

export function formatStopwatchMs(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatTrialSeconds(seconds: number) {
  return formatStopwatchMs(Math.round(seconds * 1000));
}

export function averageTugTrials(trials: readonly (number | null)[]) {
  const valid = trials.filter((value): value is number => value !== null && value > 0);
  if (valid.length === 0) {
    return 0;
  }
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function classifyTugAverage(averageSeconds: number): string {
  if (averageSeconds < 10) {
    return 'Desempenho funcional muito bom para idosos ativos (média abaixo de 10 segundos).';
  }
  if (averageSeconds < 13.5) {
    return 'Desempenho funcional esperado, com atenção clínica ao contexto (média entre 10 e 13,4 segundos).';
  }
  return 'Maior risco de quedas em idosos da comunidade (média igual ou acima de 13,5 segundos).';
}

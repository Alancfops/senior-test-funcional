import type { TimeseriesPoint } from '@/features/assessments/api';

export type ChartInstrumentCode = 'tug' | 'katz' | 'berg' | 'tinetti' | 'meem';

/** Escala Y por instrumento — pontuação máxima de cada escala (TUG é dinâmico). */
export const CHART_MAX_VALUE: Record<ChartInstrumentCode, number> = {
  tug: 20,
  katz: 6,
  berg: 56,
  tinetti: 28,
  meem: 30,
};

export const CHART_IMPROVEMENT_HINT: Record<ChartInstrumentCode, string> = {
  tug: 'Para TUG, queda da curva costuma indicar melhora (menos segundos).',
  katz: 'Para Katz, queda da curva costuma indicar melhora (menos domínios dependentes).',
  berg: 'Para Berg, subida da curva costuma indicar melhora.',
  tinetti: 'Para Tinetti, subida da curva costuma indicar melhora.',
  meem: 'Para MEEM, subida da curva costuma indicar melhora.',
};

export const CHART_EMPTY_MESSAGE =
  'Realize mais avaliações para exibir o gráfico de linha.';

export function isChartInstrumentCode(code: string): code is ChartInstrumentCode {
  return code in CHART_MAX_VALUE;
}

export function getChartMaxValue(code: ChartInstrumentCode, points: readonly { value: number }[]) {
  const configured = CHART_MAX_VALUE[code];
  if (code === 'tug' && points.length > 0) {
    const peak = Math.max(...points.map((point) => point.value));
    return Math.max(configured, Math.ceil(peak * 1.2));
  }
  return configured;
}

/** Divide o eixo em 3–5 faixas iguais com valores inteiros (ex.: Berg 0/14/28/42/56). */
export function buildYAxisTicks(maxValue: number) {
  const segments = [3, 4, 5].find((count) => maxValue % count === 0) ?? 3;
  const step = maxValue / segments;
  return Array.from({ length: segments + 1 }, (_, index) => Math.round(step * index));
}

export function formatChartDateLabel(isoDate: string) {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .toUpperCase();

  return `${day}/${month}`;
}

export function mapTimeseriesToChartPoints(points: TimeseriesPoint[]) {
  return points.map((point) => {
    const durationMs =
      new Date(point.finalizedAt).getTime() - new Date(point.startedAt).getTime();

    return {
      id: point.assessmentId,
      label: formatChartDateLabel(point.finalizedAt),
      value: point.rawValue,
      scoreSummary: point.rawLabel,
      durationMs: durationMs > 0 ? durationMs : undefined,
    };
  });
}

import { describe, expect, it } from 'vitest';

import type { AssessmentResultRecord } from '@/features/assessments/api';
import {
  buildQuestionnairePayload,
  buildTugPayload,
  mapAssessmentResultToDisplay,
} from '@/features/assessments/map-result';
import {
  CHART_EMPTY_MESSAGE,
  formatChartDateLabel,
  getChartMaxValue,
  mapTimeseriesToChartPoints,
} from '@/features/assessments/chart-config';
import { formatDurationMs } from '@/features/assessments/display-result';

describe('buildQuestionnairePayload', () => {
  it('remove valores vazios e preserva respostas válidas', () => {
    expect(
      buildQuestionnairePayload({
        katz_1: 'dependente',
        katz_2: 'assistencia',
        katz_3: null,
        berg_1: 4,
      }),
    ).toEqual({
      katz_1: 'dependente',
      katz_2: 'assistencia',
      berg_1: 4,
    });
  });

  it('agrega subitens do Tinetti 11 em tinetti_11', () => {
    expect(
      buildQuestionnairePayload({
        tinetti_11_rd_len: 1,
        tinetti_11_rd_hgt: 0,
        tinetti_11_le_len: 1,
        tinetti_11_le_hgt: 1,
      }),
    ).toEqual({ tinetti_11: 3 });
  });
});

describe('buildTugPayload', () => {
  it('monta payload com três ensaios positivos', () => {
    expect(buildTugPayload([12, 14, 16])).toEqual({
      trial1Sec: 12,
      trial2Sec: 14,
      trial3Sec: 16,
    });
  });
});

describe('mapAssessmentResultToDisplay', () => {
  const baseResult: AssessmentResultRecord = {
    rawValue: 42,
    rawLabel: '42/56',
    classificationLabel: 'Baixo risco de quedas (41–56)',
    classificationCode: 'BERG_LOW',
    classificationMeta: {},
    computedAt: '2026-07-22T18:00:00.000Z',
  };

  it('mapeia Berg com pontuação da API', () => {
    expect(mapAssessmentResultToDisplay('berg', baseResult)).toEqual({
      scoreLabel: 'Pontuação',
      scoreValue: '42',
      maxScore: '56',
      classificationLabel: 'Interpretação',
      interpretation: 'Baixo risco de quedas (41–56)',
    });
  });

  it('mapeia TUG com média em segundos', () => {
    expect(
      mapAssessmentResultToDisplay('tug', {
        ...baseResult,
        rawValue: 14.2,
        classificationLabel: 'Desempenho funcional esperado…',
      }),
    ).toMatchObject({
      scoreLabel: 'Média',
      scoreValue: '14.2',
      maxScore: 's',
    });
  });
});

describe('chart-config', () => {
  it('formata rótulo de data do eixo X', () => {
    expect(formatChartDateLabel('2026-07-22T18:00:00.000Z')).toMatch(/JUL/i);
  });

  it('só habilita gráfico com dois ou mais pontos', () => {
    const onePoint = mapTimeseriesToChartPoints([
      {
        assessmentId: '1',
        startedAt: '2026-07-01T11:50:00.000Z',
        finalizedAt: '2026-07-01T12:00:00.000Z',
        rawValue: 40,
        rawLabel: '40/56',
        classificationLabel: 'Moderado',
        classificationCode: 'BERG_MODERATE',
      },
    ]);
    expect(onePoint).toHaveLength(1);
    expect(onePoint[0]?.scoreSummary).toBe('40/56');
    expect(onePoint[0]?.durationMs).toBe(600000);
    expect(CHART_EMPTY_MESSAGE).toContain('mais avaliações');
  });

  it('formata tempo de aplicação em minutos e segundos', () => {
    expect(formatDurationMs(125000)).toBe('02:05');
    expect(formatDurationMs(45000)).toBe('00:45');
  });

  it('ajusta escala do TUG conforme pico', () => {
    expect(getChartMaxValue('tug', [{ value: 15 }])).toBeGreaterThanOrEqual(18);
  });
});

describe('activity-list-filters', () => {
  it('normaliza seleção dos 5 instrumentos para “Todos os testes”', async () => {
    const { normalizeActivityListFilters, isAllActivityTestsFilter, countActiveActivityFilters } =
      await import('@/features/filters/activity-list-filters');

    const allFive = normalizeActivityListFilters({
      instrumentCodes: ['TUG', 'KATZ', 'BERG', 'TINETTI', 'MEEM'],
    });

    expect(allFive.instrumentCodes).toEqual([]);
    expect(isAllActivityTestsFilter(allFive)).toBe(true);
    expect(countActiveActivityFilters(allFive)).toBe(0);
  });
});

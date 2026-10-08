import { describe, expect, it } from 'vitest';

import { buildYAxisTicks, getChartMaxValue } from '@/features/assessments/chart-config';

describe('chart-config', () => {
  it('caps Berg at its 56-point maximum', () => {
    expect(getChartMaxValue('berg', [{ value: 44 }])).toBe(56);
  });

  it.each([
    [56, [0, 14, 28, 42, 56]],
    [28, [0, 7, 14, 21, 28]],
    [30, [0, 10, 20, 30]],
    [6, [0, 2, 4, 6]],
    [20, [0, 5, 10, 15, 20]],
  ])('builds whole-number ticks for max %i', (max, ticks) => {
    expect(buildYAxisTicks(max)).toEqual(ticks);
  });
});

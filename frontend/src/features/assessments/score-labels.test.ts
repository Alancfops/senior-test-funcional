import { describe, expect, it } from 'vitest';

import { BERG_QUESTIONNAIRE } from '@/features/assessments/questionnaires/berg';

describe('Berg — legendas por item', () => {
  it('cada um dos 14 itens tem legenda própria para as notas 0–4', () => {
    expect(BERG_QUESTIONNAIRE.items).toHaveLength(14);

    for (const item of BERG_QUESTIONNAIRE.items) {
      if (item.config.kind !== 'numeric') {
        throw new Error(`${item.id} deveria ser numérico`);
      }
      expect(item.config.scoreLabels?.map((entry) => entry.score)).toEqual([0, 1, 2, 3, 4]);
    }

    const labelSets = new Set(
      BERG_QUESTIONNAIRE.items.map((item) =>
        item.config.kind === 'numeric' ? JSON.stringify(item.config.scoreLabels) : '',
      ),
    );
    expect(labelSets.size).toBe(14);
  });

  it('item 8 usa as distâncias do protocolo', () => {
    const item = BERG_QUESTIONNAIRE.items.find((entry) => entry.id === 'berg_8');
    const labels = item?.config.kind === 'numeric' ? item.config.scoreLabels : undefined;
    expect(labels?.find((entry) => entry.score === 3)?.label).toContain('> 12,5 cm');
  });
});

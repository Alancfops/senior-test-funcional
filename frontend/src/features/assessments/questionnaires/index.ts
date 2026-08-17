import { BERG_QUESTIONNAIRE } from '@/features/assessments/questionnaires/berg';
import { KATZ_QUESTIONNAIRE } from '@/features/assessments/questionnaires/katz';
import { MEEM_QUESTIONNAIRE } from '@/features/assessments/questionnaires/meem';
import { TINETTI_QUESTIONNAIRE } from '@/features/assessments/questionnaires/tinetti';
import type { QuestionnaireAnswers, QuestionnaireDefinition, QuestionnaireItem } from '@/features/assessments/types';

const REGISTRY: Record<string, QuestionnaireDefinition> = {
  berg: BERG_QUESTIONNAIRE,
  katz: KATZ_QUESTIONNAIRE,
  tinetti: TINETTI_QUESTIONNAIRE,
  meem: MEEM_QUESTIONNAIRE,
};

export function getQuestionnaireDefinition(code: string): QuestionnaireDefinition | undefined {
  return REGISTRY[code];
}

export const ITEMS_PER_PAGE = 3;

export function paginateItems<T>(items: readonly T[], page: number, perPage: number) {
  const start = page * perPage;
  return items.slice(start, start + perPage);
}

export function getTotalPages(itemCount: number, perPage: number) {
  return Math.ceil(itemCount / perPage);
}

export function formatProgress(currentItemIndex: number, totalItems: number) {
  return `${String(currentItemIndex + 1).padStart(2, '0')}/${String(totalItems).padStart(2, '0')}`;
}

export function isItemComplete(
  item: QuestionnaireItem,
  answers: QuestionnaireAnswers,
): boolean {
  if (item.config.kind === 'composite_sum') {
    return item.config.parts.every((part) => typeof answers[part.id] === 'number');
  }

  const value = answers[item.id];
  return value !== null && value !== undefined && value !== '';
}

export function isPageComplete(
  pageItems: readonly QuestionnaireItem[],
  answers: QuestionnaireAnswers,
) {
  return pageItems.every((item) => isItemComplete(item, answers));
}

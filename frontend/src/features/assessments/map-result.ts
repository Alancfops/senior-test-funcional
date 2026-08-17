import { TINETTI_11_PART_IDS } from '@/features/assessments/score-labels';
import type { AssessmentResultRecord } from '@/features/assessments/api';
import type {
  DisplayResult,
  QuestionnaireAnswers,
  QuestionnaireInstrumentCode,
} from '@/features/assessments/types';

const UI_ONLY_ANSWER_KEYS = new Set<string>(TINETTI_11_PART_IDS);

export function buildQuestionnairePayload(answers: QuestionnaireAnswers) {
  const payload: Record<string, number | string> = {};

  for (const [key, value] of Object.entries(answers)) {
    if (UI_ONLY_ANSWER_KEYS.has(key)) {
      continue;
    }
    if (value === null || value === undefined || value === '') {
      continue;
    }
    payload[key] = value;
  }

  if (TINETTI_11_PART_IDS.every((key) => typeof answers[key] === 'number')) {
    payload.tinetti_11 = TINETTI_11_PART_IDS.reduce(
      (total, key) => total + (answers[key] as number),
      0,
    );
  }

  return payload;
}

const MAX_SCORE: Record<QuestionnaireInstrumentCode, string> = {
  katz: '6',
  berg: '56',
  tinetti: '28',
  meem: '30',
};

const SCORE_LABEL: Record<QuestionnaireInstrumentCode, string> = {
  katz: 'Estrato Katz',
  berg: 'Pontuação',
  tinetti: 'Pontuação',
  meem: 'Pontuação',
};

export function buildTugPayload(trials: readonly (number | null)[]) {
  if (trials.length !== 3) {
    throw new Error('TUG exige três ensaios.');
  }

  const [trial1Sec, trial2Sec, trial3Sec] = trials;
  if (
    trial1Sec === null ||
    trial2Sec === null ||
    trial3Sec === null ||
    trial1Sec <= 0 ||
    trial2Sec <= 0 ||
    trial3Sec <= 0
  ) {
    throw new Error('Registre os três tempos do TUG antes de finalizar.');
  }

  return { trial1Sec, trial2Sec, trial3Sec };
}

export function mapAssessmentResultToDisplay(
  instrumentCode: string,
  result: AssessmentResultRecord,
): DisplayResult {
  if (instrumentCode === 'tug') {
    return {
      scoreLabel: 'Média',
      scoreValue: result.rawValue.toFixed(1),
      maxScore: 's',
      classificationLabel: 'Interpretação',
      interpretation: result.classificationLabel,
    };
  }

  const code = instrumentCode as QuestionnaireInstrumentCode;

  return {
    scoreLabel: SCORE_LABEL[code],
    scoreValue: String(result.rawValue),
    maxScore: MAX_SCORE[code],
    classificationLabel: 'Interpretação',
    interpretation: result.classificationLabel,
  };
}

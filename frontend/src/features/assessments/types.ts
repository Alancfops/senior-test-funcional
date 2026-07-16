export type NumericItemConfig = {
  kind: 'numeric';
  min: number;
  max: number;
};

export type CategoricalItemConfig = {
  kind: 'categorical';
  options: readonly { value: string; label: string }[];
};

export type QuestionnaireItemConfig = NumericItemConfig | CategoricalItemConfig;

export type QuestionnaireItem = {
  id: string;
  title: string;
  instructions: string;
  config: QuestionnaireItemConfig;
};

export type QuestionnaireDefinition = {
  code: string;
  name: string;
  items: readonly QuestionnaireItem[];
};

export type QuestionnaireAnswers = Record<string, number | string | null>;

export type QuestionnaireInstrumentCode = 'katz' | 'berg' | 'tinetti' | 'meem';
export type AssessmentInstrumentCode = QuestionnaireInstrumentCode | 'tug';

export type QuestionnaireSession = {
  patientId: string;
  instrumentCode: string;
  answers: QuestionnaireAnswers;
  startedAt: number;
  schoolingBand?: string;
  /** Tempos em segundos — TUG (3 ensaios). */
  tugTrials?: (number | null)[];
};

export type DisplayResult = {
  scoreLabel: string;
  scoreValue: string;
  maxScore: string;
  interpretation: string;
  classificationLabel: string;
};

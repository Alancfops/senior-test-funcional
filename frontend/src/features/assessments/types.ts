export type NumericItemConfig = {
  kind: 'numeric';
  min: number;
  max: number;
  /** Legenda da pontuação selecionada — exibida abaixo do stepper. */
  scoreLabels?: readonly { score: number; label: string }[];
};

export type CompositeSumPart = {
  id: string;
  title: string;
  options: readonly { value: number; label: string; description?: string }[];
};

export type CompositeSumItemConfig = {
  kind: 'composite_sum';
  payloadKey: string;
  min: number;
  max: number;
  parts: readonly CompositeSumPart[];
};

export type CategoricalOption = {
  value: string;
  label: string;
  /** Legenda exibida abaixo quando a opção está selecionada. */
  description?: string;
};

export type CategoricalItemConfig = {
  kind: 'categorical';
  options: readonly CategoricalOption[];
};

export type QuestionnaireItemConfig =
  | NumericItemConfig
  | CompositeSumItemConfig
  | CategoricalItemConfig;

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
  assessmentId?: string;
  schoolingBandUsed?: string;
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

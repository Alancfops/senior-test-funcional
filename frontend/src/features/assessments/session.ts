import type { QuestionnaireAnswers, QuestionnaireSession } from '@/features/assessments/types';

let activeSession: QuestionnaireSession | null = null;

export function startQuestionnaireSession(patientId: string, instrumentCode: string) {
  activeSession = {
    patientId,
    instrumentCode,
    answers: {},
    startedAt: Date.now(),
  };
  return activeSession;
}

export function getQuestionnaireSession() {
  return activeSession;
}

export function updateQuestionnaireAnswers(answers: QuestionnaireAnswers) {
  if (!activeSession) {
    return;
  }
  activeSession = { ...activeSession, answers: { ...activeSession.answers, ...answers } };
}

export function clearQuestionnaireSession() {
  activeSession = null;
}

export function ensureQuestionnaireSession(patientId: string, instrumentCode: string) {
  if (
    activeSession?.patientId === patientId &&
    activeSession.instrumentCode === instrumentCode
  ) {
    return activeSession;
  }
  return startQuestionnaireSession(patientId, instrumentCode);
}

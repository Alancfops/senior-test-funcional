import {
  createAssessmentDraftRequest,
  patchAssessmentDraftRequest,
  toApiInstrumentCode,
} from '@/features/assessments/api';
import { buildQuestionnairePayload, buildTugPayload } from '@/features/assessments/map-result';
import type { QuestionnaireAnswers, QuestionnaireSession } from '@/features/assessments/types';

let activeSession: QuestionnaireSession | null = null;

export function startQuestionnaireSession(
  patientId: string,
  instrumentCode: string,
  options?: { assessmentId?: string; schoolingBandUsed?: string | null },
) {
  activeSession = {
    patientId,
    instrumentCode,
    answers: {},
    startedAt: Date.now(),
    assessmentId: options?.assessmentId,
    schoolingBandUsed: options?.schoolingBandUsed ?? undefined,
    tugTrials: instrumentCode === 'tug' ? [null, null, null] : undefined,
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

export function updateTugTrials(trials: (number | null)[]) {
  if (!activeSession) {
    return;
  }
  activeSession = { ...activeSession, tugTrials: trials };
}

export function setQuestionnaireAssessmentId(assessmentId: string) {
  if (!activeSession) {
    return;
  }
  activeSession = { ...activeSession, assessmentId };
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

export async function ensureQuestionnaireDraftSession(
  patientId: string,
  instrumentCode: string,
  schoolingBandUsed?: string | null,
) {
  const existing = ensureQuestionnaireSession(patientId, instrumentCode);

  if (existing.assessmentId) {
    return existing;
  }

  const draft = await createAssessmentDraftRequest({
    patientId,
    instrumentCode: toApiInstrumentCode(instrumentCode),
    ...(instrumentCode === 'meem' && schoolingBandUsed
      ? { schoolingBandUsed }
      : {}),
  });

  activeSession = {
    ...existing,
    assessmentId: draft.id,
    schoolingBandUsed: draft.schoolingBandUsed ?? schoolingBandUsed ?? undefined,
  };

  return activeSession;
}

export async function syncTugDraftPayload(trials: readonly (number | null)[]) {
  if (!activeSession?.assessmentId) {
    throw new Error('Sessão de avaliação sem rascunho na API.');
  }

  updateTugTrials([...trials]);

  await patchAssessmentDraftRequest(activeSession.assessmentId, {
    payload: buildTugPayload(activeSession.tugTrials ?? trials),
  });
}

export async function syncQuestionnaireDraftPayload(answers: QuestionnaireAnswers) {
  if (!activeSession?.assessmentId) {
    throw new Error('Sessão de avaliação sem rascunho na API.');
  }

  updateQuestionnaireAnswers(answers);

  await patchAssessmentDraftRequest(activeSession.assessmentId, {
    payload: buildQuestionnairePayload(activeSession.answers),
    ...(activeSession.instrumentCode === 'meem' && activeSession.schoolingBandUsed
      ? { schoolingBandUsed: activeSession.schoolingBandUsed }
      : {}),
  });
}

import { apiRequest } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/storage';

export type AssessmentResultRecord = {
  rawValue: number;
  rawLabel: string;
  classificationLabel: string;
  classificationCode: string;
  classificationMeta: Record<string, unknown>;
  computedAt: string;
};

export type AssessmentRecord = {
  id: string;
  patientId: string;
  instrumentCode: string;
  status: 'DRAFT' | 'FINALIZED';
  startedAt: string;
  finalizedAt: string | null;
  payload: Record<string, unknown>;
  schoolingBandUsed: string | null;
  notesObservation: string | null;
  result: AssessmentResultRecord | null;
};

export type FinalizeAssessmentRecord = AssessmentRecord & {
  delta: {
    previousAssessmentId: string;
    rawValueDelta: number;
  } | null;
};

export type CreateAssessmentDraftPayload = {
  patientId: string;
  instrumentCode: string;
  schoolingBandUsed?: string;
  notesObservation?: string;
};

export type PatchAssessmentDraftPayload = {
  payload?: Record<string, number | string>;
  schoolingBandUsed?: string;
  notesObservation?: string | null;
};

export function toApiInstrumentCode(code: string) {
  return code.trim().toUpperCase();
}

export async function createAssessmentDraftRequest(payload: CreateAssessmentDraftPayload) {
  const token = await getAccessToken();
  return apiRequest<AssessmentRecord>('/assessments/draft', {
    method: 'POST',
    token,
    body: {
      ...payload,
      instrumentCode: toApiInstrumentCode(payload.instrumentCode),
    },
  });
}

export async function patchAssessmentDraftRequest(
  assessmentId: string,
  payload: PatchAssessmentDraftPayload,
) {
  const token = await getAccessToken();
  return apiRequest<AssessmentRecord>(`/assessments/${assessmentId}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}

export async function finalizeAssessmentRequest(assessmentId: string) {
  const token = await getAccessToken();
  return apiRequest<FinalizeAssessmentRecord>(`/assessments/${assessmentId}/finalize`, {
    method: 'POST',
    token,
  });
}

export type TimeseriesPoint = {
  assessmentId: string;
  startedAt: string;
  finalizedAt: string;
  rawValue: number;
  rawLabel: string;
  classificationLabel: string;
  classificationCode: string;
};

export type TimeseriesResponse = {
  instrumentCode: string;
  points: TimeseriesPoint[];
  canShowChart: boolean;
};

export async function getTimeseriesRequest(patientId: string, instrumentCode: string) {
  const token = await getAccessToken();
  const code = toApiInstrumentCode(instrumentCode);
  return apiRequest<TimeseriesResponse>(
    `/patients/${patientId}/instruments/${code}/timeseries`,
    {
      method: 'GET',
      token,
    },
  );
}

export type RecentActivityRecord = {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: string;
  instrumentCode: string;
  instrumentDisplayName: string;
  finalizedAt: string;
  resultSummary: string;
};

export type RecentActivitiesResponse = {
  data: RecentActivityRecord[];
};

export type ListRecentActivitiesParams = {
  limit?: number;
  search?: string;
  instrumentCodes?: string[];
};

export async function listRecentActivitiesRequest(params: ListRecentActivitiesParams = {}) {
  const token = await getAccessToken();
  const query = new URLSearchParams();

  if (params.limit) {
    query.set('limit', String(params.limit));
  }
  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.instrumentCodes?.length) {
    for (const code of params.instrumentCodes) {
      query.append('instrumentCode', code);
    }
  }

  const suffix = query.toString();
  return apiRequest<RecentActivitiesResponse>(
    `/assessments/recent${suffix ? `?${suffix}` : ''}`,
    {
      method: 'GET',
      token,
    },
  );
}

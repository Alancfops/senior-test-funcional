import type { TimeseriesPoint } from '@/features/assessments/api';
import { apiRequest } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/storage';

export type PatientRecord = {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  contact: string;
  schoolingBand: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export type PatientsListResponse = {
  data: PatientRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AvatarImagePayload = {
  mimeType: 'image/jpeg' | 'image/png';
  base64: string;
};

export type CreatePatientPayload = {
  fullName: string;
  age: number;
  gender: string;
  contact: string;
  schoolingBand: string;
  avatarImage?: AvatarImagePayload;
};

export type ListPatientsParams = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'fullName' | 'age' | 'gender';
  sortOrder?: 'asc' | 'desc';
  gender?: 'masculino' | 'feminino' | 'outro';
};

export async function getPatientByIdRequest(id: string) {
  const token = await getAccessToken();
  return apiRequest<PatientRecord>(`/patients/${id}`, {
    method: 'GET',
    token,
  });
}

export async function listPatientsRequest(params: ListPatientsParams = {}) {
  const token = await getAccessToken();
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }
  if (params.page) {
    query.set('page', String(params.page));
  }
  if (params.limit) {
    query.set('limit', String(params.limit));
  }
  if (params.sortBy) {
    query.set('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    query.set('sortOrder', params.sortOrder);
  }
  if (params.gender) {
    query.set('gender', params.gender);
  }

  const suffix = query.toString();
  return apiRequest<PatientsListResponse>(`/patients${suffix ? `?${suffix}` : ''}`, {
    method: 'GET',
    token,
  });
}

export async function createPatientRequest(payload: CreatePatientPayload) {
  const token = await getAccessToken();
  return apiRequest<PatientRecord>('/patients', {
    method: 'POST',
    token,
    body: payload,
  });
}

export type UpdatePatientPayload = CreatePatientPayload;

export async function updatePatientRequest(patientId: string, payload: UpdatePatientPayload) {
  const token = await getAccessToken();
  return apiRequest<PatientRecord>(`/patients/${patientId}`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}

export type PatientAssessmentSummary = {
  id: string;
  instrumentCode: string;
  instrumentName: string;
  displayDate: string;
  resultSummary: string;
  classificationLabel: string;
  relativeWhen?: string;
  finalizedAt: string;
};

export type PatientAssessmentsListResponse = {
  data: Array<{
    id: string;
    instrumentCode: string;
    instrumentDisplayName: string;
    finalizedAt: string;
    result: {
      rawValue: number;
      rawLabel: string;
      classificationLabel: string;
      classificationCode: string;
    } | null;
  }>;
};

export type PatientAssessmentDetailResponse = {
  id: string;
  patientId: string;
  instrumentCode: string;
  instrumentDisplayName: string;
  status: 'DRAFT' | 'FINALIZED';
  startedAt: string;
  finalizedAt: string | null;
  payload: Record<string, unknown>;
  schoolingBandUsed: string | null;
  notesObservation: string | null;
  result: {
    rawValue: number;
    rawLabel: string;
    classificationLabel: string;
    classificationCode: string;
    classificationMeta: Record<string, unknown>;
    computedAt: string;
  } | null;
  timeseries: {
    instrumentCode: string;
    points: TimeseriesPoint[];
    canShowChart: boolean;
  };
};

export async function listPatientAssessmentsRequest(patientId: string) {
  const token = await getAccessToken();
  return apiRequest<PatientAssessmentsListResponse>(`/patients/${patientId}/assessments`, {
    method: 'GET',
    token,
  });
}

export async function getPatientAssessmentRequest(patientId: string, assessmentId: string) {
  const token = await getAccessToken();
  return apiRequest<PatientAssessmentDetailResponse>(
    `/patients/${patientId}/assessments/${assessmentId}`,
    {
      method: 'GET',
      token,
    },
  );
}

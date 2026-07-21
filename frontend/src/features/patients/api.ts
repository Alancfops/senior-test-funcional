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

import { apiRequest } from '@/lib/api/client';

type AuthTokenResponse = {
  accessToken: string;
};

export async function loginRequest(email: string, password: string) {
  return apiRequest<AuthTokenResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function registerRequest(fullName: string, email: string, password: string) {
  return apiRequest<AuthTokenResponse>('/auth/register', {
    method: 'POST',
    body: { fullName, email, password },
  });
}

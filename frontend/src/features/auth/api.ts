import { apiRequest } from '@/lib/api/client';

type AuthUser = {
  fullName: string;
  email: string;
};

type AuthTokenResponse = {
  accessToken: string;
  user: AuthUser;
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

export async function forgotPasswordRequest(email: string) {
  return apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPasswordRequest(
  email: string,
  token: string,
  password: string,
) {
  return apiRequest<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: { email, token, password },
  });
}

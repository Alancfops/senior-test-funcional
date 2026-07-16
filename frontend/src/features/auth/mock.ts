import { env } from '@/lib/config/env';

const MOCK_ACCESS_TOKEN = 'mock-access-token-dev';

export type MockAuthSession = {
  accessToken: string;
  fullName: string;
  email: string;
};

export const MOCK_DEMO = {
  email: 'alan@email.com',
  password: '12345',
} as const;

export class MockAuthError extends Error {
  constructor(message = 'E-mail ou senha inválidos.') {
    super(message);
    this.name = 'MockAuthError';
  }
}

export function isMockAuthEnabled() {
  return env.mockAuth;
}

export function mockLogin(email: string, password: string): MockAuthSession {
  if (!env.mockAuth) {
    throw new Error('Mock auth desabilitado.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== MOCK_DEMO.email || password !== MOCK_DEMO.password) {
    throw new MockAuthError();
  }

  return {
    accessToken: MOCK_ACCESS_TOKEN,
    fullName: 'Alan',
    email: MOCK_DEMO.email,
  };
}

export function mockRegister(fullName: string, email: string): MockAuthSession {
  if (!env.mockAuth) {
    throw new Error('Mock auth desabilitado.');
  }

  return {
    accessToken: MOCK_ACCESS_TOKEN,
    fullName: fullName.trim(),
    email: email.trim(),
  };
}

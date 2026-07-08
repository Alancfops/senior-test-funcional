import { env } from '@/lib/config/env';

const MOCK_ACCESS_TOKEN = 'mock-access-token-dev';

export type MockAuthSession = {
  accessToken: string;
  fullName: string;
  email: string;
};

/** Credenciais de demonstração exibidas no fluxo mock (qualquer e-mail/senha válidos também funcionam). */
export const MOCK_DEMO = {
  email: 'jane.doe@email.com',
  password: 'Senha@123',
} as const;

export function isMockAuthEnabled() {
  return env.mockAuth;
}

export function mockLogin(email: string, _password: string): MockAuthSession {
  if (!env.mockAuth) {
    throw new Error('Mock auth desabilitado.');
  }

  const displayName =
    email.trim().toLowerCase() === MOCK_DEMO.email ? 'Jane Doe' : email.split('@')[0] ?? 'Profissional';

  return {
    accessToken: MOCK_ACCESS_TOKEN,
    fullName: displayName.replace(/\b\w/g, (c) => c.toUpperCase()),
    email: email.trim(),
  };
}

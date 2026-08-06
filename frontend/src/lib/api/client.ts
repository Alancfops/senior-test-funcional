import { env } from '@/lib/config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  /** Sobrescreve o timeout padrão (ms). */
  timeoutMs?: number;
};

const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        `Tempo esgotado ao conectar em ${env.apiUrl}. Confira se a API está rodando (make start) e se EXPO_PUBLIC_API_URL aponta para o IP correto do seu PC.`,
        0,
      );
    }

    throw new ApiError(
      `Não foi possível conectar ao servidor (${env.apiUrl}). Verifique a rede e se a API está em execução.`,
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError('Resposta inválida do servidor.', response.status);
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof (data as { message: unknown }).message === 'string'
        ? (data as { message: string }).message
        : 'Não foi possível concluir a operação. Tente novamente.';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

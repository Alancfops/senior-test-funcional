import type { Router } from 'expo-router';

import { ApiError } from '@/lib/api/client';

export type ForgotPasswordErrorParams = {
  errorName: string;
  errorMessage: string;
  email?: string;
};

export function pushForgotPasswordError(
  router: Pick<Router, 'push'>,
  params: ForgotPasswordErrorParams,
) {
  router.push({
    pathname: '/(auth)/forgot-password/error',
    params: {
      errorName: params.errorName,
      errorMessage: params.errorMessage,
      ...(params.email ? { email: params.email } : {}),
    },
  });
}

export function resolveForgotPasswordSendError(error: unknown): ForgotPasswordErrorParams {
  if (error instanceof ApiError) {
    if (error.statusCode === 0) {
      return {
        errorName: 'Sem conexão',
        errorMessage:
          'Não foi possível conectar ao servidor. Verifique a rede e se a API está em execução.',
      };
    }
    if (error.statusCode >= 500) {
      return {
        errorName: 'Falha no envio',
        errorMessage:
          'Não foi possível enviar o e-mail de recuperação. Tente novamente em instantes.',
      };
    }
    return {
      errorName: 'Falha no envio',
      errorMessage: error.message,
    };
  }

  return {
    errorName: 'Falha no envio',
    errorMessage: 'Não foi possível enviar o código. Tente novamente.',
  };
}

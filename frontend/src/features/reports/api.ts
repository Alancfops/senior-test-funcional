import { env } from '@/lib/config/env';
import { ApiError } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/storage';

export type AssessmentReportResponse = {
  buffer: ArrayBuffer;
  filename: string;
};

function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) {
    return null;
  }

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      // fallback abaixo
    }
  }

  const asciiMatch = header.match(/filename="([^"]+)"/i);
  return asciiMatch?.[1] ?? null;
}

export async function generateAssessmentReportRequest(
  assessmentId: string,
  fallbackFilename: string,
): Promise<AssessmentReportResponse> {
  const token = await getAccessToken();

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}/reports/assessments/${assessmentId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/pdf',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique a rede e se a API está em execução.',
      0,
    );
  }

  if (!response.ok) {
    const text = await response.text();
    let message = 'Não foi possível gerar o relatório. Tente novamente.';

    if (text) {
      try {
        const data = JSON.parse(text) as { message?: string };
        if (typeof data.message === 'string') {
          message = data.message;
        }
      } catch {
        // resposta não-JSON
      }
    }

    throw new ApiError(message, response.status);
  }

  const filename =
    parseContentDispositionFilename(response.headers.get('Content-Disposition')) ??
    fallbackFilename;

  return {
    buffer: await response.arrayBuffer(),
    filename,
  };
}

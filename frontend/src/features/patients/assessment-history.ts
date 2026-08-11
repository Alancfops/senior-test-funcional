import { formatAssessmentDate } from '@/features/assessments/display-result';
import { getAssessmentInstrument } from '@/features/assessments/instruments';
import type { PatientAssessmentSummary } from '@/features/patients/api';

export function mapPatientAssessmentSummary(item: {
  id: string;
  instrumentCode: string;
  instrumentDisplayName: string;
  finalizedAt: string;
  result: {
    rawValue: number;
    rawLabel: string;
    classificationLabel: string;
  } | null;
}): PatientAssessmentSummary {
  const instrumentCode = item.instrumentCode.toLowerCase();
  const meta = getAssessmentInstrument(instrumentCode);

  return {
    id: item.id,
    instrumentCode,
    instrumentName: item.instrumentDisplayName || meta?.name || item.instrumentCode,
    displayDate: formatAssessmentDate(new Date(item.finalizedAt)),
    resultSummary: item.result?.rawLabel ?? '—',
    classificationLabel: item.result?.classificationLabel ?? '',
    finalizedAt: item.finalizedAt,
  };
}

export type InstrumentCategorySummary = {
  instrumentCode: string;
  instrumentName: string;
  relativeWhen: string;
  sessionCount: number;
};

/** Agrupa avaliações finalizadas por instrumento (categoria) — perfil RF006. */
export function groupAssessmentsByInstrument(
  assessments: PatientAssessmentSummary[],
): InstrumentCategorySummary[] {
  const byCode = new Map<string, PatientAssessmentSummary[]>();

  for (const item of assessments) {
    const list = byCode.get(item.instrumentCode) ?? [];
    list.push(item);
    byCode.set(item.instrumentCode, list);
  }

  return Array.from(byCode.entries())
    .map(([instrumentCode, items]) => {
      const sorted = [...items].sort(
        (a, b) => new Date(b.finalizedAt).getTime() - new Date(a.finalizedAt).getTime(),
      );
      const latest = sorted[0];

      return {
        instrumentCode,
        instrumentName: latest.instrumentName,
        relativeWhen: latest.relativeWhen ?? latest.displayDate,
        sessionCount: items.length,
      };
    })
    .sort((a, b) => a.instrumentName.localeCompare(b.instrumentName, 'pt-BR'));
}

export function formatRelativeWhen(finalizedAt: string) {
  const date = new Date(finalizedAt);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86400000);

  if (diffDays === 0) {
    return 'Hoje';
  }
  if (diffDays === 1) {
    return 'Ontem';
  }
  return formatAssessmentDate(date);
}

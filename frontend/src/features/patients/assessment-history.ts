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
  };
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

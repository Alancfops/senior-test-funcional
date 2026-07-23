const INVALID_FILENAME_CHARS = /[/\\:*?"<>|]/g;

export function buildAssessmentReportFilename(patientFullName: string): string {
  const cleaned = patientFullName
    .trim()
    .replace(INVALID_FILENAME_CHARS, '')
    .replace(/\s+/g, ' ')
    .slice(0, 100);

  const name = cleaned || 'Paciente';
  return `Relatório - ${name}.pdf`;
}

/**
 * Iniciais do paciente para avatar sem foto.
 * Ex.: "Maria de Luordes" → "ML" (primeiro + último nome).
 */
export function getPatientInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toLocaleUpperCase('pt-BR');
  }

  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return `${first}${last}`.toLocaleUpperCase('pt-BR');
}

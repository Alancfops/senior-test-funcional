export type ActivityInstrumentCode = 'TUG' | 'KATZ' | 'BERG' | 'TINETTI' | 'MEEM';

export type ActivityListFilters = {
  instrumentCodes: ActivityInstrumentCode[];
};

export const DEFAULT_ACTIVITY_LIST_FILTERS: ActivityListFilters = {
  instrumentCodes: [],
};

export const ACTIVITY_INSTRUMENT_OPTIONS: Array<{
  value: ActivityInstrumentCode;
  label: string;
}> = [
  { value: 'TUG', label: 'TUG' },
  { value: 'KATZ', label: 'Katz' },
  { value: 'BERG', label: 'Berg' },
  { value: 'TINETTI', label: 'Tinetti' },
  { value: 'MEEM', label: 'MEEM' },
];

const ALL_ACTIVITY_INSTRUMENT_CODES = ACTIVITY_INSTRUMENT_OPTIONS.map((option) => option.value);

/** Se os 5 instrumentos estão marcados, equivale a “Todos os testes”. */
export function normalizeActivityListFilters(filters: ActivityListFilters): ActivityListFilters {
  if (filters.instrumentCodes.length < ALL_ACTIVITY_INSTRUMENT_CODES.length) {
    return filters;
  }

  const hasAll = ALL_ACTIVITY_INSTRUMENT_CODES.every((code) =>
    filters.instrumentCodes.includes(code),
  );

  if (!hasAll) {
    return filters;
  }

  return { instrumentCodes: [] };
}

export function isAllActivityTestsFilter(filters: ActivityListFilters) {
  return normalizeActivityListFilters(filters).instrumentCodes.length === 0;
}

export function countActiveActivityFilters(filters: ActivityListFilters) {
  return normalizeActivityListFilters(filters).instrumentCodes.length;
}

export function toggleActivityInstrument(
  filters: ActivityListFilters,
  code: ActivityInstrumentCode,
): ActivityListFilters {
  const next = filters.instrumentCodes.includes(code)
    ? { instrumentCodes: filters.instrumentCodes.filter((item) => item !== code) }
    : { instrumentCodes: [...filters.instrumentCodes, code] };

  return normalizeActivityListFilters(next);
}

export function isActivityInstrumentSelected(
  filters: ActivityListFilters,
  code: ActivityInstrumentCode,
) {
  return normalizeActivityListFilters(filters).instrumentCodes.includes(code);
}

import { GENDER_OPTIONS } from '@/features/patients/constants';

export type PatientSortBy = 'fullName' | 'age' | 'gender';
export type SortOrder = 'asc' | 'desc';
export type PatientGenderFilter = (typeof GENDER_OPTIONS)[number]['value'] | null;

export type PatientListFilters = {
  sortBy: PatientSortBy;
  sortOrder: SortOrder;
  gender: PatientGenderFilter;
};

export const DEFAULT_PATIENT_LIST_FILTERS: PatientListFilters = {
  sortBy: 'fullName',
  sortOrder: 'asc',
  gender: null,
};

export const PATIENT_SORT_OPTIONS: Array<{
  id: string;
  label: string;
  sortBy: PatientSortBy;
  sortOrder: SortOrder;
}> = [
  { id: 'name-asc', label: 'Nome (A → Z)', sortBy: 'fullName', sortOrder: 'asc' },
  { id: 'name-desc', label: 'Nome (Z → A)', sortBy: 'fullName', sortOrder: 'desc' },
  { id: 'age-asc', label: 'Idade (menor → maior)', sortBy: 'age', sortOrder: 'asc' },
  { id: 'age-desc', label: 'Idade (maior → menor)', sortBy: 'age', sortOrder: 'desc' },
  { id: 'gender-asc', label: 'Sexo (A → Z)', sortBy: 'gender', sortOrder: 'asc' },
];

export function countActivePatientFilters(filters: PatientListFilters) {
  let count = 0;
  if (filters.gender) {
    count += 1;
  }
  if (getPatientSortOptionId(filters) !== 'name-asc') {
    count += 1;
  }
  return count;
}

export function getPatientSortOptionId(filters: PatientListFilters) {
  return (
    PATIENT_SORT_OPTIONS.find(
      (option) => option.sortBy === filters.sortBy && option.sortOrder === filters.sortOrder,
    )?.id ?? 'name-asc'
  );
}

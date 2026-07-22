import { FilterOption, FilterSection, FilterSheet } from '@/components/main/FilterSheet';
import {
  getPatientSortOptionId,
  PATIENT_SORT_OPTIONS,
  PatientListFilters,
} from '@/features/filters/patient-list-filters';
import { GENDER_OPTIONS } from '@/features/patients/constants';

type PatientListFilterSheetProps = {
  visible: boolean;
  draftFilters: PatientListFilters;
  onChangeDraft: (filters: PatientListFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
};

export function PatientListFilterSheet({
  visible,
  draftFilters,
  onChangeDraft,
  onClose,
  onApply,
  onClear,
}: PatientListFilterSheetProps) {
  const selectedSortId = getPatientSortOptionId(draftFilters);

  return (
    <FilterSheet
      visible={visible}
      title="Filtrar pacientes"
      onClose={onClose}
      onApply={onApply}
      onClear={onClear}>
      <FilterSection title="Ordenar por">
        {PATIENT_SORT_OPTIONS.map((option) => (
          <FilterOption
            key={option.id}
            label={option.label}
            selected={selectedSortId === option.id}
            onPress={() =>
              onChangeDraft({
                ...draftFilters,
                sortBy: option.sortBy,
                sortOrder: option.sortOrder,
              })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Sexo">
        <FilterOption
          label="Todos"
          selected={draftFilters.gender === null}
          onPress={() => onChangeDraft({ ...draftFilters, gender: null })}
        />
        {GENDER_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            selected={draftFilters.gender === option.value}
            onPress={() => onChangeDraft({ ...draftFilters, gender: option.value })}
          />
        ))}
      </FilterSection>
    </FilterSheet>
  );
}

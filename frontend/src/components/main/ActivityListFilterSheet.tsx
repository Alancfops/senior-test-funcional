import { Text } from 'react-native';

import { FilterOption, FilterSection, FilterSheet } from '@/components/main/FilterSheet';
import {
  ACTIVITY_INSTRUMENT_OPTIONS,
  ActivityInstrumentCode,
  ActivityListFilters,
  isActivityInstrumentSelected,
  isAllActivityTestsFilter,
  toggleActivityInstrument,
} from '@/features/filters/activity-list-filters';
import { tokens } from '@/theme/tokens';

type ActivityListFilterSheetProps = {
  visible: boolean;
  draftFilters: ActivityListFilters;
  onChangeDraft: (filters: ActivityListFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
};

/** Filtro de avaliações — seleção múltipla de instrumentos. */
export function ActivityListFilterSheet({
  visible,
  draftFilters,
  onChangeDraft,
  onClose,
  onApply,
  onClear,
}: ActivityListFilterSheetProps) {
  const allSelected = isAllActivityTestsFilter(draftFilters);

  function toggleInstrument(code: ActivityInstrumentCode) {
    onChangeDraft(toggleActivityInstrument(draftFilters, code));
  }

  return (
    <FilterSheet
      visible={visible}
      title="Filtrar avaliações"
      onClose={onClose}
      onApply={onApply}
      onClear={onClear}>
      <FilterSection title="Tipo de teste">
        <Text style={{ ...tokens.typography.caption, color: tokens.colors.textMuted }}>
          Selecione um ou mais testes. Sem seleção, mostra todos.
        </Text>
        <FilterOption
          label="Todos os testes"
          selected={allSelected}
          onPress={() => onChangeDraft({ instrumentCodes: [] })}
        />
        {ACTIVITY_INSTRUMENT_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            label={option.label}
            selected={isActivityInstrumentSelected(draftFilters, option.value)}
            onPress={() => toggleInstrument(option.value)}
          />
        ))}
      </FilterSection>
    </FilterSheet>
  );
}

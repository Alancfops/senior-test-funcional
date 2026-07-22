import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  filterActive?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  onFilterPress,
  placeholder = 'Buscar',
  filterActive = false,
}: SearchBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <TextInput
          accessibilityLabel="Buscar"
          placeholder={placeholder}
          placeholderTextColor={tokens.colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          returnKeyType="search"
        />
        <Ionicons name="search" size={20} color={tokens.colors.primary} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={filterActive ? 'Filtrar, filtros ativos' : 'Filtrar'}
        accessibilityState={{ selected: filterActive }}
        onPress={onFilterPress}
        style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
        <Ionicons name="options-outline" size={22} color={tokens.colors.primary} />
        {filterActive ? <View style={styles.filterBadge} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  inputWrap: {
    flex: 1,
    minHeight: tokens.touchTargetMin,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  input: {
    flex: 1,
    ...tokens.typography.body,
    color: tokens.colors.text,
    paddingVertical: tokens.spacing.sm,
  },
  filterButton: {
    width: tokens.touchTargetMin,
    height: tokens.touchTargetMin,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
});

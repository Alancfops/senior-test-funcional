import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export function CheckboxField({ label, checked, onToggle }: CheckboxFieldProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onToggle}
      style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    minHeight: tokens.touchTargetMin,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
  },
  boxChecked: {
    backgroundColor: tokens.colors.primary,
  },
  checkmark: {
    color: tokens.colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  label: {
    ...tokens.typography.label,
    color: tokens.colors.primary,
  },
});

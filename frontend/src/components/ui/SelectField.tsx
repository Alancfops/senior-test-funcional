import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
};

export function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  required,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${selected?.label ?? placeholder}`}
        accessibilityHint="Abre a lista de opções"
        onPress={() => setOpen(true)}
        style={[styles.trigger, error ? styles.triggerError : null]}>
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={tokens.colors.textMuted} />
      </Pressable>

      {error ? (
        <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropTap} onPress={() => setOpen(false)} accessibilityLabel="Fechar" />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}>
                  <Text
                    style={[
                      styles.optionText,
                      option.value === value && styles.optionTextSelected,
                    ]}>
                    {option.label}
                  </Text>
                  {option.value === value ? (
                    <Ionicons name="checkmark" size={18} color={tokens.colors.primary} />
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    ...tokens.typography.label,
    color: tokens.colors.text,
    fontWeight: '400',
  },
  required: {
    color: tokens.colors.error,
  },
  trigger: {
    minHeight: tokens.touchTargetMin,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: tokens.colors.error,
  },
  triggerText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  placeholder: {
    color: tokens.colors.placeholder,
  },
  error: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  backdropTap: {
    flex: 1,
  },
  sheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radius.lg,
    borderTopRightRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    maxHeight: '60%',
    gap: tokens.spacing.sm,
  },
  sheetTitle: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
  option: {
    minHeight: tokens.touchTargetMin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  optionTextSelected: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },
});

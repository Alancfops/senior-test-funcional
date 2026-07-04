import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';

import { tokens } from '@/theme/tokens';

type TextInputProps = RNTextInputProps & {
  label: string;
  error?: string;
  required?: boolean;
  secureToggle?: boolean;
  /** Cadastro Figma — labels escuras; demais telas auth — azul. */
  labelTone?: 'brand' | 'neutral';
};

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput(
  {
    label,
    error,
    required,
    secureToggle,
    secureTextEntry,
    style,
    accessibilityLabel,
    labelTone = 'brand',
    ...rest
  },
  ref,
) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);
  const inputId = label.replace(/\s/g, '-').toLowerCase();

  return (
    <View style={styles.wrapper}>
      <Text
        nativeID={`${inputId}-label`}
        style={[styles.label, labelTone === 'neutral' && styles.labelNeutral]}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        <RNTextInput
          ref={ref}
          accessibilityLabel={accessibilityLabel ?? label}
          placeholderTextColor={tokens.colors.placeholder}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          style={[styles.input, style]}
          {...rest}
        />
        {secureToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            onPress={() => setHidden((v) => !v)}
            hitSlop={8}
            style={styles.trailing}>
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={tokens.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    ...tokens.typography.label,
    color: tokens.colors.label,
  },
  labelNeutral: {
    color: tokens.colors.text,
    fontWeight: '400',
  },
  required: {
    color: tokens.colors.error,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
  },
  inputRowError: {
    borderColor: tokens.colors.error,
  },
  input: {
    flex: 1,
    ...tokens.typography.body,
    color: tokens.colors.text,
    paddingVertical: tokens.spacing.sm,
  },
  trailing: {
    marginLeft: tokens.spacing.sm,
    minWidth: 32,
    alignItems: 'center',
  },
  error: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
  },
});

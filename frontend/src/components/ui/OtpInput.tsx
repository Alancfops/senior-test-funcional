import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  function handleChange(text: string) {
    const cleaned = text.replace(/\D/g, '').slice(0, length);
    onChange(cleaned);
  }

  return (
    <Pressable
      accessibilityRole="none"
      accessibilityLabel="Código de 6 dígitos"
      onPress={() => inputRef.current?.focus()}
      style={styles.wrap}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        accessibilityLabel="Digite o código de 6 dígitos"
      />
      <View style={styles.boxRow}>
        {digits.map((digit, index) => (
          <View key={index} style={styles.box}>
            <Text style={styles.digit}>{digit.trim()}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tokens.spacing.xs,
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 48,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
  },
  digit: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
});

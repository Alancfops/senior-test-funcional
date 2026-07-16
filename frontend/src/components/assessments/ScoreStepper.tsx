import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type ScoreStepperProps = {
  value: number | null;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

/** Seletor numérico — Figma pontuação com setas. */
export function ScoreStepper({ value, min, max, onChange }: ScoreStepperProps) {
  function decrement() {
    if (value === null) {
      onChange(min);
      return;
    }
    onChange(Math.max(min, value - 1));
  }

  function increment() {
    if (value === null) {
      onChange(min);
      return;
    }
    onChange(Math.min(max, value + 1));
  }

  const display = value === null ? '—' : String(value);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Pontuação</Text>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Diminuir pontuação"
          onPress={decrement}
          disabled={value !== null && value <= min}
          style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}>
          <Ionicons name="chevron-back" size={18} color={tokens.colors.primary} />
        </Pressable>
        <View style={styles.valueCircle} accessibilityLabel={`Pontuação ${display}`}>
          <Text style={styles.valueText}>{display}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aumentar pontuação"
          onPress={increment}
          disabled={value !== null && value >= max}
          style={({ pressed }) => [styles.chevron, pressed && styles.pressed]}>
          <Ionicons name="chevron-forward" size={18} color={tokens.colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
    gap: 4,
    minWidth: 112,
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chevron: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  valueCircle: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getScoreLabelForValue } from '@/features/assessments/score-labels';
import { tokens } from '@/theme/tokens';

type ScoreStepperProps = {
  value: number | null;
  min: number;
  max: number;
  onChange: (value: number) => void;
  scoreLabels?: readonly { score: number; label: string }[];
};

/** Seletor numérico — Figma pontuação com setas. */
export function ScoreStepper({ value, min, max, onChange, scoreLabels }: ScoreStepperProps) {
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
  const atMin = value !== null && value <= min;
  const atMax = value !== null && value >= max;
  const activeLabel = getScoreLabelForValue(scoreLabels, value);

  return (
    <View style={styles.wrap}>
      <View style={styles.controls}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Diminuir pontuação"
          onPress={decrement}
          disabled={atMin}
          style={({ pressed }) => [
            styles.chevron,
            atMin && styles.chevronDisabled,
            pressed && !atMin && styles.pressed,
          ]}>
          <Ionicons
            name="chevron-back"
            size={18}
            color={atMin ? tokens.colors.textMuted : tokens.colors.primary}
          />
        </Pressable>
        <View style={styles.valueColumn}>
          <Text style={styles.label}>Pontuação</Text>
          <View style={styles.valueCircle} accessibilityLabel={`Pontuação ${display}`}>
            <Text style={styles.valueText}>{display}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Aumentar pontuação"
          onPress={increment}
          disabled={atMax}
          style={({ pressed }) => [
            styles.chevron,
            atMax && styles.chevronDisabled,
            pressed && !atMax && styles.pressed,
          ]}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={atMax ? tokens.colors.textMuted : tokens.colors.primary}
          />
        </Pressable>
      </View>
      {activeLabel ? (
        <Text style={styles.scoreHint} accessibilityLiveRegion="polite">
          {activeLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
    gap: 4,
    maxWidth: 148,
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  valueColumn: {
    alignItems: 'center',
    gap: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  chevron: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronDisabled: {
    opacity: 0.45,
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
  scoreHint: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'right',
    lineHeight: 16,
    marginTop: 2,
  },
});

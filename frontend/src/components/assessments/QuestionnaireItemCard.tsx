import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScoreStepper } from '@/components/assessments/ScoreStepper';
import {
  getCategoricalDescriptionForValue,
  getOptionDescriptionForValue,
} from '@/features/assessments/score-labels';
import type { QuestionnaireAnswers, QuestionnaireItem } from '@/features/assessments/types';
import { tokens } from '@/theme/tokens';

type QuestionnaireItemCardProps = {
  item: QuestionnaireItem;
  value: number | string | null;
  answers: QuestionnaireAnswers;
  onChange: (value: number | string) => void;
  onPartChange: (partId: string, value: number) => void;
};

export function QuestionnaireItemCard({
  item,
  value,
  answers,
  onChange,
  onPartChange,
}: QuestionnaireItemCardProps) {
  if (item.config.kind === 'composite_sum') {
    const partTotal = item.config.parts.reduce((sum, part) => {
      const partValue = answers[part.id];
      return sum + (typeof partValue === 'number' ? partValue : 0);
    }, 0);
    const allPartsAnswered = item.config.parts.every(
      (part) => typeof answers[part.id] === 'number',
    );

    return (
      <View style={styles.card}>
        <View style={styles.compositeHeader}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.instructions}>{item.instructions}</Text>
          </View>
          <View style={styles.compositeTotal} accessibilityLabel={`Pontuação total ${partTotal} de ${item.config.max}`}>
            <Text style={styles.compositeTotalLabel}>Total</Text>
            <Text style={styles.compositeTotalValue}>
              {allPartsAnswered ? partTotal : '—'}/{item.config.max}
            </Text>
          </View>
        </View>

        <View style={styles.compositeParts}>
          {item.config.parts.map((part) => {
            const partValue = answers[part.id];
            const partHint = getOptionDescriptionForValue(part.options, partValue);
            return (
              <View key={part.id} style={styles.compositePart}>
                <Text style={styles.partTitle}>{part.title}</Text>
                <View style={styles.options}>
                  {part.options.map((option) => {
                    const selected = partValue === option.value;
                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        onPress={() => onPartChange(part.id, option.value)}
                        style={({ pressed }) => [
                          styles.option,
                          selected && styles.optionSelected,
                          pressed && styles.pressed,
                        ]}>
                        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {partHint ? (
                  <Text style={styles.selectionHint} accessibilityLiveRegion="polite">
                    {partHint}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  const categoricalHint =
    item.config.kind === 'categorical'
      ? getCategoricalDescriptionForValue(item.config.options, typeof value === 'string' ? value : null)
      : null;

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.instructions}>{item.instructions}</Text>
        </View>

        {item.config.kind === 'numeric' ? (
          <ScoreStepper
            value={typeof value === 'number' ? value : null}
            min={item.config.min}
            max={item.config.max}
            scoreLabels={item.config.scoreLabels}
            onChange={onChange}
          />
        ) : null}
      </View>

      {item.config.kind === 'categorical' ? (
        <View style={styles.options}>
          {item.config.options.map((option) => {
            const selected = value === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => onChange(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {categoricalHint ? (
        <Text style={styles.selectionHint} accessibilityLiveRegion="polite">
          {categoricalHint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    gap: tokens.spacing.sm,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  mainRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    alignItems: 'flex-start',
  },
  compositeHeader: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    alignItems: 'flex-start',
  },
  compositeTotal: {
    alignItems: 'center',
    minWidth: 52,
    paddingTop: 2,
  },
  compositeTotalLabel: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  compositeTotalValue: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.primary,
  },
  compositeParts: {
    gap: tokens.spacing.sm,
  },
  compositePart: {
    gap: tokens.spacing.xs,
  },
  partTitle: {
    ...tokens.typography.caption,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  instructions: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    lineHeight: 18,
  },
  options: {
    gap: tokens.spacing.xs,
  },
  option: {
    minHeight: tokens.touchTargetMin,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    justifyContent: 'center',
    backgroundColor: tokens.colors.pageBackground,
  },
  optionSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: 'rgba(54, 102, 224, 0.08)',
  },
  optionText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  optionTextSelected: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
  selectionHint: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    lineHeight: 18,
    paddingTop: 2,
  },
});

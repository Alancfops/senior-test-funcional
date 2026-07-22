import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type AssessmentListItemProps = {
  instrumentName: string;
  displayDate: string;
  resultSummary?: string;
  onPress?: () => void;
};

/** Figma — card de teste no perfil (lista RF006). */
export function AssessmentListItem({
  instrumentName,
  displayDate,
  resultSummary,
  onPress,
}: AssessmentListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${instrumentName}. Data de avaliação ${displayDate}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.content}>
        <Text style={styles.title}>{instrumentName}</Text>
        {resultSummary ? <Text style={styles.result}>{resultSummary}</Text> : null}
        <Text style={styles.date}>Data de Avaliação: {displayDate}.</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tokens.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  result: {
    ...tokens.typography.caption,
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  date: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
});

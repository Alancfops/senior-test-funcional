import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssessmentListItem } from '@/components/patients/AssessmentListItem';
import type { PatientAssessmentSummary } from '@/features/patients/api';
import { tokens } from '@/theme/tokens';

type PatientInstrumentSessionsSectionProps = {
  instrumentName: string;
  assessments: PatientAssessmentSummary[];
  onAddTest?: () => void;
  onOpenAssessment: (assessmentId: string) => void;
};

/** Lista de sessões de um instrumento — sem dados cadastrais (RF006). */
export function PatientInstrumentSessionsSection({
  instrumentName,
  assessments,
  onAddTest,
  onOpenAssessment,
}: PatientInstrumentSessionsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Testes
        </Text>
        {onAddTest ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nova avaliação"
            accessibilityHint={`Iniciar nova avaliação de ${instrumentName}`}
            onPress={onAddTest}
            hitSlop={8}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Ionicons name="clipboard-outline" size={22} color={tokens.colors.primary} />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={12} color={tokens.colors.onPrimary} />
            </View>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.list}>
        {assessments.map((item) => (
          <AssessmentListItem
            key={item.id}
            instrumentName={item.instrumentName}
            displayDate={item.displayDate}
            resultSummary={item.resultSummary}
            onPress={() => onOpenAssessment(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: tokens.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...tokens.typography.title,
    fontSize: 18,
    color: tokens.colors.text,
  },
  addButton: {
    width: tokens.touchTargetMin,
    height: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    right: 4,
    bottom: 6,
    width: 18,
    height: 18,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  list: {
    gap: tokens.spacing.sm,
  },
});

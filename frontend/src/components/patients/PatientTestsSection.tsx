import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { Button } from '@/components/ui/Button';
import type { PatientAssessmentSummary } from '@/features/patients/api';
import { groupAssessmentsByInstrument } from '@/features/patients/assessment-history';
import { tokens } from '@/theme/tokens';

type PatientTestsSectionProps = {
  assessments: PatientAssessmentSummary[];
  patientName: string;
  patientGender?: string | null;
  onStartTest: () => void;
  onAddTest?: () => void;
  onOpenInstrumentCategory: (instrumentCode: string) => void;
};

/** Figma — seção Testes: vazio (Iniciar Teste) ou categorias por instrumento. */
export function PatientTestsSection({
  assessments,
  patientName,
  patientGender,
  onStartTest,
  onAddTest,
  onOpenInstrumentCategory,
}: PatientTestsSectionProps) {
  const hasAssessments = assessments.length > 0;
  const categories = groupAssessmentsByInstrument(assessments);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Testes
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova avaliação"
          accessibilityHint="Abrir seleção de paciente e teste"
          onPress={onAddTest ?? onStartTest}
          hitSlop={8}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <Ionicons name="clipboard-outline" size={22} color={tokens.colors.primary} />
          <View style={styles.addBadge}>
            <Ionicons name="add" size={12} color={tokens.colors.onPrimary} />
          </View>
        </Pressable>
      </View>

      {!hasAssessments ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>Não Há Testes Cadastrados</Text>
          <Text style={styles.emptyHint}>
            Nenhuma avaliação realizada para este paciente. Inicie um teste funcional para registrar
            o histórico clínico.
          </Text>
          <Button label="Iniciar Teste" onPress={onStartTest} accessibilityHint="Inicia fluxo de avaliação" />
        </View>
      ) : (
        <View style={styles.list}>
          {categories.map((category, index) => (
            <ActivityCard
              key={category.instrumentCode}
              patientName={patientName}
              patientGender={patientGender}
              description={category.instrumentName}
              when={category.relativeWhen}
              tone={activityToneForIndex(index)}
              onPress={() => onOpenInstrumentCategory(category.instrumentCode)}
            />
          ))}
        </View>
      )}
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
  emptyBlock: {
    alignItems: 'center',
    gap: tokens.spacing.md,
    paddingVertical: tokens.spacing.lg,
  },
  emptyTitle: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.error,
    textAlign: 'center',
  },
  emptyHint: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  list: {
    gap: tokens.spacing.sm,
  },
});

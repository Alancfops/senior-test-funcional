import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { AssessmentListItem } from '@/components/patients/AssessmentListItem';
import { Button } from '@/components/ui/Button';
import { MockAssessment } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

type PatientTestsSectionProps = {
  assessments: MockAssessment[];
  patientName: string;
  onStartTest: () => void;
  onAddTest?: () => void;
  onOpenAssessment: (assessmentId: string) => void;
};

/** Figma — seção Testes: vazio (Iniciar Teste) ou lista de avaliações. */
export function PatientTestsSection({
  assessments,
  patientName,
  onStartTest,
  onAddTest,
  onOpenAssessment,
}: PatientTestsSectionProps) {
  const hasAssessments = assessments.length > 0;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Testes
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova avaliação"
          accessibilityHint="Abrirá a seleção de instrumentos quando disponível"
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
          {assessments.length === 1 ? (
            <ActivityCard
              patientName={patientName}
              description={assessments[0].instrumentName}
              when={assessments[0].relativeWhen ?? assessments[0].displayDate}
              tone={activityToneForIndex(0)}
              onPress={() => onOpenAssessment(assessments[0].id)}
            />
          ) : (
            assessments.map((item) => (
              <AssessmentListItem
                key={item.id}
                instrumentName={item.instrumentName}
                displayDate={item.displayDate}
                onPress={() => onOpenAssessment(item.id)}
              />
            ))
          )}
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
    color: tokens.colors.primary,
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

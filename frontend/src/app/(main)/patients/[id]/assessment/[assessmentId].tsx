import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { PatientProfileHeader } from '@/components/patients/PatientProfileHeader';
import { getMockAssessment } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — detalhe / resultado de um teste no perfil (RF006 área de detalhe — mock). */
export default function PatientAssessmentDetailScreen() {
  const { id, assessmentId } = useLocalSearchParams<{ id: string; assessmentId: string }>();
  const data = getMockAssessment(id ?? '', assessmentId ?? '');

  if (!data) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Avaliação não encontrada.</Text>
      </View>
    );
  }

  const { patient, assessment } = data;

  return (
    <View style={styles.root}>
      <PatientProfileHeader fullName={patient.fullName} age={patient.age} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Testes
        </Text>

        <ActivityCard
          patientName={patient.fullName}
          description={assessment.instrumentName}
          when={assessment.relativeWhen ?? assessment.displayDate}
          tone={activityToneForIndex(0)}
          onPress={() => router.back()}
        />

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Resultado</Text>
          <Text style={styles.detailBody}>
            Gráfico de evolução e respostas detalhadas desta aplicação serão exibidos aqui quando a
            API (RF006 / RF012) estiver integrada.
          </Text>
          <Text style={styles.detailMeta}>Data da avaliação: {assessment.displayDate}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    ...tokens.typography.title,
    fontSize: 18,
    color: tokens.colors.text,
  },
  detailCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  detailTitle: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  detailBody: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
  },
  detailMeta: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.pageBackground,
    padding: tokens.spacing.lg,
  },
  notFoundText: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
});

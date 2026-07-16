import { Href, router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentCollectHeader } from '@/components/assessments/AssessmentCollectHeader';
import { EvolutionChart } from '@/components/assessments/EvolutionChart';
import { ButtonRow } from '@/components/ui/Button';
import {
  buildDisplayResult,
  formatAssessmentDate,
  formatDurationMs,
  MOCK_EVOLUTION_POINTS,
} from '@/features/assessments/display-result';
import { getQuestionnaireDefinition } from '@/features/assessments/questionnaires';
import { clearQuestionnaireSession, getQuestionnaireSession } from '@/features/assessments/session';
import { getMockPatientById } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — Resultado RF011 (prévia Fase A; API finalize na Fase D). */
export default function AssessmentResultScreen() {
  const insets = useSafeAreaInsets();
  const { instrumentCode, patientId, startedAt } = useLocalSearchParams<{
    instrumentCode: string;
    patientId: string;
    startedAt?: string;
  }>();

  const definition = getQuestionnaireDefinition(instrumentCode ?? '');
  const patient = getMockPatientById(patientId ?? '');
  const session = getQuestionnaireSession();

  if (!definition || !patient || !session || session.instrumentCode !== instrumentCode) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Resultado indisponível. Refaça a avaliação.</Text>
      </View>
    );
  }

  const started = Number(startedAt ?? session.startedAt);
  const finishedAt = new Date();
  const display = buildDisplayResult(definition, session.answers, patient.schoolingBand);
  const progressLabel = `${String(definition.items.length).padStart(2, '0')}/${String(definition.items.length).padStart(2, '0')}`;

  function handleReapply() {
    clearQuestionnaireSession();
    router.replace({
      pathname: '/(main)/assessments/[instrumentCode]/collect',
      params: { instrumentCode, patientId },
    } as Href);
  }

  function handleSave() {
    Alert.alert(
      'Resultado salvo (demonstração)',
      'Na Fase D, o resultado será persistido via POST .../finalize na API.',
      [{ text: 'OK', onPress: () => router.replace('/(main)/(tabs)' as Href) }],
    );
    clearQuestionnaireSession();
  }

  return (
    <View style={styles.root}>
      <AssessmentCollectHeader
        fullName={patient.fullName}
        age={patient.age}
        screenTitle="Resultado"
        onBack={() => router.back()}
      />

      <View style={styles.progressRow}>
        <Text style={styles.instrumentName} accessibilityRole="header">
          Resultado
        </Text>
        <Text style={styles.progress}>{progressLabel}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + tokens.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.scoreCard}>
          <View style={styles.scoreColumn}>
            <Text style={styles.scoreLabel}>{display.scoreLabel}</Text>
            <Text style={styles.scoreValue} accessibilityLabel={`${display.scoreValue} de ${display.maxScore}`}>
              {display.scoreValue}
              <Text style={styles.scoreMax}> / {display.maxScore}</Text>
            </Text>
          </View>
          <View style={styles.interpretationColumn}>
            <Text style={styles.scoreLabel}>{display.classificationLabel}</Text>
            <Text style={styles.interpretation}>{display.interpretation}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            Data de Avaliação: {formatAssessmentDate(finishedAt)}
          </Text>
          <Text style={styles.metaText}>
            Tempo de Aplicação: {formatDurationMs(finishedAt.getTime() - started)}
          </Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle} accessibilityRole="header">
            Gráfico
          </Text>
          <View style={styles.chartCard}>
            <EvolutionChart points={MOCK_EVOLUTION_POINTS} />
          </View>
          <Text style={styles.chartHint}>
            Curva ilustrativa com dados mock. Com integração API (RF012), o gráfico usa histórico real
            do paciente.
          </Text>
        </View>

        <Text style={styles.phaseHint}>
          Prévia local (Fase A). Classificação oficial virá do servidor no finalize (Fase D).
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + tokens.spacing.md }]}>
        <ButtonRow
          backLabel="Reaplicar Teste"
          actionLabel="Salvar Resultado"
          onBack={handleReapply}
          onAction={handleSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
  },
  instrumentName: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  progress: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  scoreCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    flexDirection: 'row',
    gap: tokens.spacing.lg,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  scoreColumn: {
    minWidth: 96,
    gap: 4,
  },
  interpretationColumn: {
    flex: 1,
    gap: 4,
  },
  scoreLabel: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    color: tokens.colors.primary,
  },
  scoreMax: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.textMuted,
  },
  interpretation: {
    ...tokens.typography.subtitle,
    color: tokens.colors.text,
    lineHeight: 20,
  },
  metaRow: {
    gap: 4,
  },
  metaText: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  chartSection: {
    gap: tokens.spacing.sm,
  },
  chartTitle: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  chartCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    alignItems: 'center',
  },
  chartHint: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  phaseHint: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageBackground,
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
    textAlign: 'center',
  },
});

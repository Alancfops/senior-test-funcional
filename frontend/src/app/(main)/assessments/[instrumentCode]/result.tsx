import { Ionicons } from '@expo/vector-icons';
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
import {
  averageTugTrials,
  classifyTugAverage,
  formatTrialSeconds,
  TUG_TRIALS,
} from '@/features/assessments/tug/constants';
import { getQuestionnaireDefinition } from '@/features/assessments/questionnaires';
import { clearQuestionnaireSession, getQuestionnaireSession } from '@/features/assessments/session';
import { getMockPatientById } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Gráfico mock TUG — médias em segundos (RF012). */
const MOCK_TUG_EVOLUTION_POINTS = [
  { label: 'Out', value: 14 },
  { label: 'Nov', value: 13 },
  { label: 'Dez', value: 12 },
  { label: 'Jan', value: 11 },
  { label: 'Fev', value: 10 },
  { label: 'Mar', value: 9 },
];

/** Figma — Resultado RF011 (prévia Fase A; API finalize na Fase D). */
export default function AssessmentResultScreen() {
  const insets = useSafeAreaInsets();
  const { instrumentCode, patientId, startedAt } = useLocalSearchParams<{
    instrumentCode: string;
    patientId: string;
    startedAt?: string;
  }>();

  const patient = getMockPatientById(patientId ?? '');
  const session = getQuestionnaireSession();
  const isTug = instrumentCode === 'tug';
  const definition = isTug ? undefined : getQuestionnaireDefinition(instrumentCode ?? '');

  if (!patient || !session || session.instrumentCode !== instrumentCode) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Resultado indisponível. Refaça a avaliação.</Text>
      </View>
    );
  }

  if (!isTug && !definition) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Resultado indisponível. Refaça a avaliação.</Text>
      </View>
    );
  }

  const started = Number(startedAt ?? session.startedAt);
  const finishedAt = new Date();
  const tugTrials = session.tugTrials ?? [null, null, null];
  const tugAverage = averageTugTrials(tugTrials);
  const display = definition
    ? buildDisplayResult(definition, session.answers, patient.schoolingBand)
    : null;
  const progressLabel = isTug
    ? '03/03'
    : `${String(definition!.items.length).padStart(2, '0')}/${String(definition!.items.length).padStart(2, '0')}`;

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
          {isTug ? 'TUG — Resultado' : 'Resultado'}
        </Text>
        <Text style={styles.progress}>{progressLabel}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + tokens.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        {isTug ? (
          <>
            <View style={styles.trialList}>
              {TUG_TRIALS.map((trial, index) => {
                const seconds = tugTrials[index];
                return (
                  <View key={trial.index} style={styles.trialCard}>
                    <View style={styles.trialText}>
                      <Text style={styles.trialLabel}>{trial.label}</Text>
                      <Text style={styles.trialTime}>
                        {seconds !== null ? formatTrialSeconds(seconds) : '—'}
                      </Text>
                    </View>
                    {seconds !== null ? (
                      <View style={styles.checkCircle}>
                        <Ionicons name="checkmark" size={18} color={tokens.colors.onPrimary} />
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                Data de Avaliação: {formatAssessmentDate(finishedAt)}
              </Text>
              <Text style={styles.metaText}>
                Tempo Total de Aplicação: {formatDurationMs(finishedAt.getTime() - started)}
              </Text>
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.scoreColumn}>
                <Text style={styles.scoreLabel}>Média</Text>
                <Text style={styles.scoreValue}>
                  {tugAverage.toFixed(1)}
                  <Text style={styles.scoreMax}> s</Text>
                </Text>
              </View>
              <View style={styles.interpretationColumn}>
                <Text style={styles.scoreLabel}>Interpretação</Text>
                <Text style={styles.interpretation}>{classifyTugAverage(tugAverage)}</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.scoreCard}>
              <View style={styles.scoreColumn}>
                <Text style={styles.scoreLabel}>{display!.scoreLabel}</Text>
                <Text style={styles.scoreValue} accessibilityLabel={`${display!.scoreValue} de ${display!.maxScore}`}>
                  {display!.scoreValue}
                  <Text style={styles.scoreMax}> / {display!.maxScore}</Text>
                </Text>
              </View>
              <View style={styles.interpretationColumn}>
                <Text style={styles.scoreLabel}>{display!.classificationLabel}</Text>
                <Text style={styles.interpretation}>{display!.interpretation}</Text>
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
          </>
        )}

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle} accessibilityRole="header">
            Gráfico
          </Text>
          <View style={styles.chartCard}>
            <EvolutionChart
              points={isTug ? MOCK_TUG_EVOLUTION_POINTS : MOCK_EVOLUTION_POINTS}
              maxValue={isTug ? 20 : 90}
            />
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
  trialList: {
    gap: tokens.spacing.sm,
  },
  trialCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  trialText: {
    flex: 1,
    gap: 2,
  },
  trialLabel: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  trialTime: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

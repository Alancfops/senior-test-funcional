import { Ionicons } from '@expo/vector-icons';
import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentCollectHeader } from '@/components/assessments/AssessmentCollectHeader';
import { EvolutionChart } from '@/components/assessments/EvolutionChart';
import { ButtonRow } from '@/components/ui/Button';
import {
  finalizeAssessmentRequest,
  getTimeseriesRequest,
} from '@/features/assessments/api';
import {
  CHART_EMPTY_MESSAGE,
  CHART_IMPROVEMENT_HINT,
  getChartMaxValue,
  isChartInstrumentCode,
  mapTimeseriesToChartPoints,
} from '@/features/assessments/chart-config';
import {
  formatAssessmentDate,
  formatDurationMs,
} from '@/features/assessments/display-result';
import {
  getAssessmentInstrument,
  isQuestionnaireInstrumentCode,
} from '@/features/assessments/instruments';
import { mapAssessmentResultToDisplay } from '@/features/assessments/map-result';
import { getQuestionnaireDefinition } from '@/features/assessments/questionnaires';
import { clearQuestionnaireSession, getQuestionnaireSession } from '@/features/assessments/session';
import { formatTrialSeconds, TUG_TRIALS } from '@/features/assessments/tug/constants';
import type { DisplayResult } from '@/features/assessments/types';
import { getPatientByIdRequest, PatientRecord } from '@/features/patients/api';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — Resultado RF011 + gráfico evolutivo RF012 (≥2 avaliações). */
export default function AssessmentResultScreen() {
  const insets = useSafeAreaInsets();
  const { instrumentCode, patientId } = useLocalSearchParams<{
    instrumentCode: string;
    patientId: string;
  }>();

  const session = getQuestionnaireSession();
  const isTug = instrumentCode === 'tug';
  const isQuestionnaire = instrumentCode ? isQuestionnaireInstrumentCode(instrumentCode) : false;
  const instrumentMeta = getAssessmentInstrument(instrumentCode ?? '');
  const definition = isQuestionnaire ? getQuestionnaireDefinition(instrumentCode) : undefined;

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [display, setDisplay] = useState<DisplayResult | null>(null);
  const [chartPoints, setChartPoints] = useState<ReturnType<typeof mapTimeseriesToChartPoints>>([]);
  const [canShowChart, setCanShowChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [finalizedAssessmentId, setFinalizedAssessmentId] = useState<string | null>(null);
  const [applicationDurationMs, setApplicationDurationMs] = useState<number | null>(null);
  const [assessmentDate, setAssessmentDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!patientId || !instrumentCode || !session?.assessmentId) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const patientRecord = await getPatientByIdRequest(patientId);
        if (cancelled) {
          return;
        }
        setPatient(patientRecord);

        const finalized = await finalizeAssessmentRequest(session.assessmentId!);
        if (cancelled) {
          return;
        }
        if (!finalized.result) {
          setLoadError('Resultado indisponível. Refaça a avaliação.');
          return;
        }

        setDisplay(mapAssessmentResultToDisplay(instrumentCode, finalized.result));
        setFinalizedAssessmentId(finalized.id);

        const finalizedAt = finalized.finalizedAt
          ? new Date(finalized.finalizedAt)
          : new Date();
        const started = new Date(finalized.startedAt);
        setAssessmentDate(finalizedAt);
        setApplicationDurationMs(Math.max(0, finalizedAt.getTime() - started.getTime()));

        const timeseries = await getTimeseriesRequest(patientId, instrumentCode);
        if (cancelled) {
          return;
        }
        setChartPoints(mapTimeseriesToChartPoints(timeseries.points));
        setCanShowChart(timeseries.canShowChart);
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (error instanceof ApiError) {
          setLoadError(error.message);
        } else {
          setLoadError('Não foi possível finalizar a avaliação.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [patientId, instrumentCode, session?.assessmentId]);

  const progressLabel = useMemo(() => {
    if (isTug) {
      return '03/03';
    }
    if (definition) {
      const total = String(definition.items.length).padStart(2, '0');
      return `${total}/${total}`;
    }
    return '';
  }, [definition, isTug]);

  const screenTitle = useMemo(() => {
    if (isTug) {
      return 'TUG — Resultado';
    }
    return definition?.name ?? instrumentMeta?.name ?? 'Resultado';
  }, [definition, instrumentMeta, isTug]);

  const chartMaxValue = useMemo(() => {
    if (!instrumentCode || !isChartInstrumentCode(instrumentCode)) {
      return 90;
    }
    return getChartMaxValue(instrumentCode, chartPoints);
  }, [chartPoints, instrumentCode]);

  if (!session || session.instrumentCode !== instrumentCode) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Resultado indisponível. Refaça a avaliação.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
        <Text style={styles.loadingText}>Calculando resultado…</Text>
      </View>
    );
  }

  if (loadError || !patient || !display) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>{loadError ?? 'Resultado indisponível. Refaça a avaliação.'}</Text>
      </View>
    );
  }

  const tugTrials = session.tugTrials ?? [null, null, null];
  const improvementHint =
    instrumentCode && isChartInstrumentCode(instrumentCode)
      ? CHART_IMPROVEMENT_HINT[instrumentCode]
      : '';

  function handleReapply() {
    clearQuestionnaireSession();
    router.replace({
      pathname: '/(main)/assessments/[instrumentCode]/collect',
      params: { instrumentCode, patientId },
    } as Href);
  }

  function handleSave() {
    clearQuestionnaireSession();
    router.replace('/(main)/(tabs)' as Href);
  }

  return (
    <View style={styles.root}>
      <AssessmentCollectHeader
        fullName={patient.fullName}
        age={patient.age}
        avatarUrl={patient.avatarUrl}
        screenTitle="Resultado"
        onBack={() => router.back()}
      />

      <View style={styles.progressRow}>
        <Text style={styles.instrumentName} accessibilityRole="header" numberOfLines={2}>
          {screenTitle}
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
        ) : null}

        <View style={styles.scoreCard}>
          <View style={styles.scoreColumn}>
            <Text style={styles.scoreLabel}>{display.scoreLabel}</Text>
            <Text
              style={styles.scoreValue}
              accessibilityLabel={`${display.scoreValue} de ${display.maxScore}`}>
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
          <Text style={styles.metaText}>Data de Avaliação: {formatAssessmentDate(assessmentDate)}</Text>
          <Text style={styles.metaText}>
            Tempo de Aplicação:{' '}
            {applicationDurationMs !== null ? formatDurationMs(applicationDurationMs) : '—'}
          </Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle} accessibilityRole="header">
            Gráfico
          </Text>
          <View style={styles.chartCard}>
            {canShowChart && chartPoints.length >= 2 ? (
              <EvolutionChart
                points={chartPoints}
                maxValue={chartMaxValue}
                highlightedPointId={finalizedAssessmentId ?? undefined}
              />
            ) : (
              <Text style={styles.chartEmpty}>{CHART_EMPTY_MESSAGE}</Text>
            )}
          </View>
          {canShowChart && improvementHint ? (
            <Text style={styles.chartHint}>{improvementHint}</Text>
          ) : null}
        </View>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.pageBackground,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  loadingText: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  instrumentName: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
    flex: 1,
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
    minHeight: 180,
    justifyContent: 'center',
  },
  chartEmpty: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.md,
  },
  chartHint: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageBackground,
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

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EvolutionChart } from '@/components/assessments/EvolutionChart';
import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { PatientProfileHeader } from '@/components/patients/PatientProfileHeader';
import { Button } from '@/components/ui/Button';
import {
  CHART_EMPTY_MESSAGE,
  CHART_IMPROVEMENT_HINT,
  getChartMaxValue,
  isChartInstrumentCode,
  mapTimeseriesToChartPoints,
} from '@/features/assessments/chart-config';
import { mapAssessmentResultToDisplay } from '@/features/assessments/map-result';
import { formatAssessmentDate, formatDurationMs } from '@/features/assessments/display-result';
import {
  formatRelativeWhen,
  mapPatientAssessmentSummary,
} from '@/features/patients/assessment-history';
import {
  getPatientAssessmentRequest,
  getPatientByIdRequest,
  PatientRecord,
} from '@/features/patients/api';
import { generateAssessmentReportRequest } from '@/features/reports/api';
import { buildAssessmentReportFilename } from '@/features/reports/report-filename';
import { openAssessmentReportPdf } from '@/features/reports/open-report-pdf';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — detalhe de um teste no perfil (RF006). */
export default function PatientAssessmentDetailScreen() {
  const { id, assessmentId } = useLocalSearchParams<{ id: string; assessmentId: string }>();
  const patientId = id ?? '';
  const assessmentUuid = assessmentId ?? '';

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [instrumentName, setInstrumentName] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [relativeWhen, setRelativeWhen] = useState('');
  const [display, setDisplay] = useState<ReturnType<typeof mapAssessmentResultToDisplay> | null>(
    null,
  );
  const [chartPoints, setChartPoints] = useState<ReturnType<typeof mapTimeseriesToChartPoints>>([]);
  const [canShowChart, setCanShowChart] = useState(false);
  const [instrumentCode, setInstrumentCode] = useState('');
  const [applicationDurationMs, setApplicationDurationMs] = useState<number | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    if (!patientId || !assessmentUuid) {
      return;
    }

    let cancelled = false;

    setLoading(true);
    setLoadError(null);
    setPatient(null);
    setDisplay(null);
    setChartPoints([]);
    setInstrumentName('');
    setDisplayDate('');
    setRelativeWhen('');
    setCanShowChart(false);
    setInstrumentCode('');
    setApplicationDurationMs(null);

    async function load() {
      try {
        const [patientRecord, assessment] = await Promise.all([
          getPatientByIdRequest(patientId),
          getPatientAssessmentRequest(patientId, assessmentUuid),
        ]);

        if (cancelled) {
          return;
        }

        setPatient(patientRecord);

        const summary = mapPatientAssessmentSummary({
          id: assessment.id,
          instrumentCode: assessment.instrumentCode,
          instrumentDisplayName: assessment.instrumentDisplayName,
          finalizedAt: assessment.finalizedAt ?? assessment.startedAt,
          result: assessment.result,
        });

        setInstrumentName(summary.instrumentName);
        setDisplayDate(summary.displayDate);
        setRelativeWhen(formatRelativeWhen(assessment.finalizedAt ?? assessment.startedAt));
        setInstrumentCode(summary.instrumentCode);

        const finalizedAt = assessment.finalizedAt ?? assessment.startedAt;
        const durationMs =
          new Date(finalizedAt).getTime() - new Date(assessment.startedAt).getTime();
        setApplicationDurationMs(durationMs > 0 ? durationMs : null);

        if (assessment.result) {
          setDisplay(mapAssessmentResultToDisplay(summary.instrumentCode, assessment.result));
        }

        setChartPoints(mapTimeseriesToChartPoints(assessment.timeseries.points));
        setCanShowChart(assessment.timeseries.canShowChart);
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (error instanceof ApiError) {
          setLoadError(error.message);
        } else {
          setLoadError('Avaliação não encontrada.');
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
  }, [patientId, assessmentUuid]);

  const chartMaxValue = useMemo(() => {
    if (!isChartInstrumentCode(instrumentCode)) {
      return 90;
    }
    return getChartMaxValue(instrumentCode, chartPoints);
  }, [chartPoints, instrumentCode]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.primary} />
      </View>
    );
  }

  if (!patient || loadError || !display) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>{loadError ?? 'Avaliação não encontrada.'}</Text>
      </View>
    );
  }

  const improvementHint = isChartInstrumentCode(instrumentCode)
    ? CHART_IMPROVEMENT_HINT[instrumentCode]
    : '';

  async function handleGenerateReport() {
    if (!assessmentUuid || generatingReport) {
      return;
    }

    setGeneratingReport(true);

    try {
      const fallbackFilename = buildAssessmentReportFilename(patient.fullName);
      const { buffer, filename } = await generateAssessmentReportRequest(
        assessmentUuid,
        fallbackFilename,
      );
      await openAssessmentReportPdf(buffer, filename);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Não foi possível gerar o relatório.';

      Alert.alert('Relatório PDF', message);
    } finally {
      setGeneratingReport(false);
    }
  }

  return (
    <View style={styles.root}>
      <PatientProfileHeader
        fullName={patient.fullName}
        age={patient.age}
        avatarUrl={patient.avatarUrl}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Testes
        </Text>

        <ActivityCard
          patientName={patient.fullName}
          patientGender={patient.gender}
          description={instrumentName}
          when={relativeWhen || displayDate}
          tone={activityToneForIndex(0)}
          onPress={() => router.back()}
        />

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Resultado</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreColumn}>
              <Text style={styles.scoreLabel}>{display.scoreLabel}</Text>
              <Text style={styles.scoreValue}>
                {display.scoreValue}
                <Text style={styles.scoreMax}> / {display.maxScore}</Text>
              </Text>
            </View>
            <View style={styles.interpretationColumn}>
              <Text style={styles.scoreLabel}>{display.classificationLabel}</Text>
              <Text style={styles.detailBody}>{display.interpretation}</Text>
            </View>
          </View>
          <Text style={styles.detailMeta}>Data da avaliação: {displayDate}</Text>
          <Text style={styles.detailMeta}>
            Tempo de aplicação:{' '}
            {applicationDurationMs !== null ? formatDurationMs(applicationDurationMs) : '—'}
          </Text>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.detailTitle}>Gráfico</Text>
          <View style={styles.chartCard}>
            {canShowChart && chartPoints.length >= 2 ? (
              <EvolutionChart
                points={chartPoints}
                maxValue={chartMaxValue}
                highlightedPointId={assessmentUuid}
              />
            ) : (
              <Text style={styles.chartEmpty}>{CHART_EMPTY_MESSAGE}</Text>
            )}
          </View>
          {canShowChart && improvementHint ? (
            <Text style={styles.chartHint}>{improvementHint}</Text>
          ) : null}

          <Button
            label="Gerar relatório PDF"
            onPress={handleGenerateReport}
            loading={generatingReport}
            accessibilityHint="Gera e abre o relatório PDF desta avaliação com os dados do paciente e do profissional"
          />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.pageBackground,
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
  scoreRow: {
    flexDirection: 'row',
    gap: tokens.spacing.lg,
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
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    color: tokens.colors.primary,
  },
  scoreMax: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.colors.textMuted,
  },
  detailBody: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
  },
  detailMeta: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  chartSection: {
    gap: tokens.spacing.sm,
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

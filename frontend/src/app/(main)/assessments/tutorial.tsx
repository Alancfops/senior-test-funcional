import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssessmentScreenHeader } from '@/components/assessments/AssessmentScreenHeader';
import { ButtonRow } from '@/components/ui/Button';
import { getAssessmentInstrument } from '@/features/assessments/instruments';
import { getPatientByIdRequest, PatientRecord } from '@/features/patients/api';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — Tutorial RF009 (passos 1 e 2 por instrumento). */
export default function AssessmentTutorialScreen() {
  const { patientId, instrumentCode, step } = useLocalSearchParams<{
    patientId: string;
    instrumentCode: string;
    step: string;
  }>();

  const instrument = getAssessmentInstrument(instrumentCode ?? '');
  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const currentStep = step === '2' ? 2 : 1;

  useEffect(() => {
    if (!patientId) {
      return;
    }

    let cancelled = false;

    void getPatientByIdRequest(patientId)
      .then((record) => {
        if (!cancelled) {
          setPatient(record);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof ApiError ? error.message : 'Paciente não encontrado.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AssessmentScreenHeader title="Tutorial" onBack={() => router.back()} />
        <View style={styles.centered}>
          <ActivityIndicator color={tokens.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!instrument || !patient) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AssessmentScreenHeader title="Tutorial" onBack={() => router.back()} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{loadError ?? 'Sessão de avaliação inválida.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tutorialStep = currentStep === 1 ? instrument.tutorial.step1 : instrument.tutorial.step2;

  function handleBack() {
    if (currentStep === 2) {
      router.replace({
        pathname: '/(main)/assessments/tutorial',
        params: { patientId, instrumentCode, step: '1' },
      } as Href);
      return;
    }
    router.back();
  }

  function handleNext() {
    if (currentStep === 1) {
      router.replace({
        pathname: '/(main)/assessments/tutorial',
        params: { patientId, instrumentCode, step: '2' },
      } as Href);
      return;
    }

    router.push({
      pathname: '/(main)/assessments/[instrumentCode]/collect',
      params: { instrumentCode, patientId },
    } as Href);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AssessmentScreenHeader title="Tutorial" onBack={handleBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel={`Tutorial do ${instrument.name}, passo ${currentStep} de 2`}>
        <Text style={styles.instrumentTitle} accessibilityRole="header">
          {instrument.name}
        </Text>

        <Text style={styles.body}>{tutorialStep.body}</Text>

        {tutorialStep.bullets?.map((bullet) => (
          <View key={bullet} style={styles.bulletRow} accessibilityRole="text">
            <Text style={styles.bulletMarker} accessibilityElementsHidden importantForAccessibility="no">
              •
            </Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}

        {tutorialStep.scoringGuide && tutorialStep.scoringGuide.length > 0 ? (
          <View style={styles.scoringSection} accessibilityRole="summary">
            <Text style={styles.scoringTitle} accessibilityRole="header">
              Como pontuar
            </Text>
            {tutorialStep.scoringGuide.map((entry) => (
              <View key={entry.score} style={styles.scoringRow} accessibilityRole="text">
                <View style={styles.scoringScoreWrap}>
                  <Text style={styles.scoringScore}>{entry.score}</Text>
                </View>
                <Text style={styles.scoringDescription}>{entry.description}</Text>
              </View>
            ))}
            {tutorialStep.scoringGuideNote ? (
              <Text style={styles.scoringNote}>{tutorialStep.scoringGuideNote}</Text>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <ButtonRow
          backLabel="Voltar"
          actionLabel={currentStep === 1 ? 'Próximo' : 'Iniciar Teste'}
          onBack={handleBack}
          onAction={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    gap: tokens.spacing.md,
  },
  instrumentTitle: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
  body: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    paddingLeft: tokens.spacing.xs,
  },
  bulletMarker: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    lineHeight: 22,
  },
  bulletText: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  scoringSection: {
    marginTop: tokens.spacing.sm,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tokens.colors.border,
    gap: tokens.spacing.sm,
  },
  scoringTitle: {
    ...tokens.typography.subtitle,
    color: tokens.colors.text,
  },
  scoringRow: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    alignItems: 'center',
  },
  scoringScoreWrap: {
    width: 104,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoringScore: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: tokens.colors.primary,
    textAlign: 'center',
  },
  scoringDescription: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
    lineHeight: 22,
  },
  scoringNote: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageBackground,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  notFoundText: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
    textAlign: 'center',
  },
});

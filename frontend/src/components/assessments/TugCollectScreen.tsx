import { Image } from 'expo-image';
import { Href, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentCollectHeader } from '@/components/assessments/AssessmentCollectHeader';
import { StopwatchControl } from '@/components/assessments/StopwatchControl';
import { Button } from '@/components/ui/Button';
import {
  ensureQuestionnaireSession,
  getQuestionnaireSession,
  updateTugTrials,
} from '@/features/assessments/session';
import { TUG_TRIALS } from '@/features/assessments/tug/constants';
import type { MockPatient } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

type TugCollectScreenProps = {
  patient: MockPatient;
  patientId: string;
  instrumentCode: string;
};

/** Figma — TUG RF010: 3 ensaios com cronômetro e diagramas. */
export function TugCollectScreen({ patient, patientId, instrumentCode }: TugCollectScreenProps) {
  const insets = useSafeAreaInsets();
  const [trialIndex, setTrialIndex] = useState(0);
  const [trials, setTrials] = useState<(number | null)[]>([null, null, null]);
  const [formError, setFormError] = useState<string | null>(null);

  const trial = TUG_TRIALS[trialIndex];
  const isLastTrial = trialIndex >= TUG_TRIALS.length - 1;

  useEffect(() => {
    const session = ensureQuestionnaireSession(patientId, instrumentCode);
    if (session.tugTrials?.some((value) => value !== null)) {
      setTrials([...session.tugTrials]);
    }
  }, [patientId, instrumentCode]);

  const handleRecord = useCallback(
    (seconds: number) => {
      setTrials((prev) => {
        const next = [...prev];
        next[trialIndex] = seconds;
        updateTugTrials(next);
        return next;
      });
      setFormError(null);
    },
    [trialIndex],
  );

  function handleBack() {
    if (trialIndex > 0) {
      setTrialIndex((current) => current - 1);
      setFormError(null);
      return;
    }
    router.back();
  }

  function handleNext() {
    if (trials[trialIndex] === null) {
      setFormError('Pare o cronômetro para registrar o tempo deste ensaio antes de continuar.');
      return;
    }

    if (isLastTrial) {
      const session = getQuestionnaireSession();
      router.push({
        pathname: '/(main)/assessments/[instrumentCode]/result',
        params: {
          instrumentCode,
          patientId,
          startedAt: String(session?.startedAt ?? Date.now()),
        },
      } as Href);
      return;
    }

    setTrialIndex((current) => current + 1);
    setFormError(null);
  }

  return (
    <View style={styles.root}>
      <AssessmentCollectHeader
        fullName={patient.fullName}
        age={patient.age}
        onBack={handleBack}
        onEditPatient={() =>
          Alert.alert('Em breve', 'Edição rápida do paciente durante a sessão virá na Fase D.')
        }
      />

      <View style={styles.progressRow}>
        <Text style={styles.trialTitle}>
          TUG — {trial.label}
        </Text>
        <Text style={styles.progress}>{trial.progress}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + tokens.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image
            source={trial.image}
            style={styles.diagram}
            contentFit="contain"
            accessibilityLabel={`Diagrama ilustrativo do ${trial.label}`}
          />
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instruções:</Text>
          <Text style={styles.instructionsBody}>{trial.instructions}</Text>
        </View>

        <StopwatchControl
          key={trial.index}
          recordedSeconds={trials[trialIndex]}
          onRecord={handleRecord}
        />

        {formError ? (
          <Text style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {formError}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + tokens.spacing.md }]}>
        <Button
          label={isLastTrial ? 'Finalizar Teste' : 'Próximo Ensaio'}
          onPress={handleNext}
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
    gap: tokens.spacing.sm,
  },
  trialTitle: {
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
    gap: tokens.spacing.md,
  },
  imageWrap: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    minHeight: 160,
    maxHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  diagram: {
    width: '100%',
    height: 180,
  },
  instructionsCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    gap: tokens.spacing.xs,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionsTitle: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  instructionsBody: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
    lineHeight: 20,
  },
  formError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageBackground,
  },
});

import { Href, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssessmentScreenHeader } from '@/components/assessments/AssessmentScreenHeader';
import { ButtonRow } from '@/components/ui/Button';
import { getQuestionnaireInstrument } from '@/features/assessments/instruments';
import { getMockPatientById } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — Tutorial RF009 (passos 1 e 2 por instrumento). */
export default function AssessmentTutorialScreen() {
  const { patientId, instrumentCode, step } = useLocalSearchParams<{
    patientId: string;
    instrumentCode: string;
    step: string;
  }>();

  const instrument = getQuestionnaireInstrument(instrumentCode ?? '');
  const patient = getMockPatientById(patientId ?? '');
  const currentStep = step === '2' ? 2 : 1;

  if (!instrument || !patient) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AssessmentScreenHeader title="Tutorial" onBack={() => router.back()} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Sessão de avaliação inválida.</Text>
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

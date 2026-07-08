import { Href, router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PatientProfileHeader } from '@/components/patients/PatientProfileHeader';
import { PatientTestsSection } from '@/components/patients/PatientTestsSection';
import { getMockPatientById } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — Perfil de Paciente (RF006). Estados: sem testes / com histórico. */
export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patient = getMockPatientById(id ?? '');

  if (!patient) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Paciente não encontrado.</Text>
      </View>
    );
  }

  const patientId = patient.id;

  function handleStartTest() {
    Alert.alert('Em breve', 'O fluxo de avaliação (RF007) será implementado na próxima fase.');
  }

  function handleOpenAssessment(assessmentId: string) {
    router.push(`/(main)/patients/${patientId}/assessment/${assessmentId}` as Href);
  }

  return (
    <View style={styles.root}>
      <PatientProfileHeader fullName={patient.fullName} age={patient.age} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PatientTestsSection
          assessments={patient.assessments}
          patientName={patient.fullName}
          onStartTest={handleStartTest}
          onAddTest={handleStartTest}
          onOpenAssessment={handleOpenAssessment}
        />
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
    paddingBottom: tokens.spacing.xl,
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

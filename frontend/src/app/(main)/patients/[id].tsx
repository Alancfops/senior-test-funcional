import { Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PatientProfileHeader } from '@/components/patients/PatientProfileHeader';
import { PatientRegistrationSection } from '@/components/patients/PatientRegistrationSection';
import { PatientTestsSection } from '@/components/patients/PatientTestsSection';
import {
  getPatientByIdRequest,
  listPatientAssessmentsRequest,
  PatientAssessmentSummary,
  PatientRecord,
} from '@/features/patients/api';
import {
  formatRelativeWhen,
  mapPatientAssessmentSummary,
} from '@/features/patients/assessment-history';
import { getGenderLabel, getSchoolingLabel } from '@/features/patients/constants';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — Perfil de Paciente (RF006). */
export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const patientId = id ?? '';

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [assessments, setAssessments] = useState<PatientAssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPatient = useCallback(async () => {
    if (!patientId) {
      setPatient(null);
      setAssessments([]);
      setLoadError('Paciente não encontrado.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError(null);

    try {
      const [patientResponse, assessmentsResponse] = await Promise.all([
        getPatientByIdRequest(patientId),
        listPatientAssessmentsRequest(patientId),
      ]);

      setPatient(patientResponse);
      setAssessments(
        assessmentsResponse.data.map((item) => {
          const summary = mapPatientAssessmentSummary(item);
          return {
            ...summary,
            relativeWhen: formatRelativeWhen(item.finalizedAt),
          };
        }),
      );
    } catch (error) {
      setPatient(null);
      setAssessments([]);
      if (error instanceof ApiError && error.statusCode === 404) {
        setLoadError('Paciente não encontrado.');
      } else if (error instanceof ApiError && error.statusCode === 401) {
        setLoadError('Sessão expirada. Saia e faça login novamente.');
      } else if (error instanceof ApiError) {
        setLoadError(error.message);
      } else {
        setLoadError('Não foi possível carregar o paciente.');
      }
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useFocusEffect(
    useCallback(() => {
      void loadPatient();
    }, [loadPatient]),
  );

  function handleStartTest() {
    if (!patient) {
      return;
    }

    router.push({
      pathname: '/(main)/assessments/apply',
      params: { patientId: patient.id },
    } as Href);
  }

  function handleOpenAssessment(assessmentId: string) {
    if (!patient) {
      return;
    }

    router.push(`/(main)/patients/${patient.id}/assessment/${assessmentId}` as Href);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={tokens.colors.primary} accessibilityLabel="Carregando paciente" />
      </View>
    );
  }

  if (!patient || loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText} accessibilityRole="alert">
          {loadError ?? 'Paciente não encontrado.'}
        </Text>
      </View>
    );
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
        <PatientRegistrationSection
          genderLabel={getGenderLabel(patient.gender)}
          contact={patient.contact}
          schoolingLabel={getSchoolingLabel(patient.schoolingBand)}
        />

        <PatientTestsSection
          assessments={assessments}
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
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  centered: {
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

import { Href, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PatientInstrumentSessionsSection } from '@/components/patients/PatientInstrumentSessionsSection';
import { PatientProfileHeader } from '@/components/patients/PatientProfileHeader';
import { getAssessmentInstrument } from '@/features/assessments/instruments';
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
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** RF006 — sessões de um instrumento no perfil (sem dados cadastrais). */
export default function PatientInstrumentSessionsScreen() {
  const { id, instrumentCode } = useLocalSearchParams<{ id: string; instrumentCode: string }>();
  const patientId = id ?? '';
  const normalizedCode = (instrumentCode ?? '').toLowerCase();
  const instrumentMeta = getAssessmentInstrument(normalizedCode);

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [assessments, setAssessments] = useState<PatientAssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!patientId || !normalizedCode) {
      setPatient(null);
      setAssessments([]);
      setLoadError('Instrumento não encontrado.');
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
        assessmentsResponse.data
          .map((item) => {
            const summary = mapPatientAssessmentSummary(item);
            return {
              ...summary,
              relativeWhen: formatRelativeWhen(item.finalizedAt),
            };
          })
          .filter((item) => item.instrumentCode === normalizedCode)
          .sort((a, b) => new Date(b.finalizedAt).getTime() - new Date(a.finalizedAt).getTime()),
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
        setLoadError('Não foi possível carregar as avaliações.');
      }
    } finally {
      setLoading(false);
    }
  }, [patientId, normalizedCode]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  const instrumentName = useMemo(() => {
    if (assessments[0]?.instrumentName) {
      return assessments[0].instrumentName;
    }
    return instrumentMeta?.name ?? normalizedCode.toUpperCase();
  }, [assessments, instrumentMeta?.name, normalizedCode]);

  function handleStartTest() {
    if (!patient) {
      return;
    }

    router.push({
      pathname: '/(main)/assessments/apply',
      params: { patientId: patient.id, instrumentCode: normalizedCode },
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
        <ActivityIndicator color={tokens.colors.primary} accessibilityLabel="Carregando avaliações" />
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

  if (!instrumentMeta && assessments.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText} accessibilityRole="alert">
          Instrumento não encontrado.
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
        onEditPatient={() => {
          router.push(`/(main)/patients/${patient.id}/edit` as Href);
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <PatientInstrumentSessionsSection
          instrumentName={instrumentName}
          assessments={assessments}
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

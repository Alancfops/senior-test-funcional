import { Href, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssessmentScreenHeader } from '@/components/assessments/AssessmentScreenHeader';
import { SearchSelectField } from '@/components/assessments/SearchSelectField';
import { ButtonRow } from '@/components/ui/Button';
import { ALL_ASSESSMENT_INSTRUMENT_OPTIONS } from '@/features/assessments/instruments';
import { listPatientsRequest } from '@/features/patients/api';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — Aplicar Teste (RF007 + RF008). Pacientes da API; questionários integrados. */
export default function ApplyAssessmentScreen() {
  const { patientId: preselectedPatientId, instrumentCode: preselectedInstrumentCode } =
    useLocalSearchParams<{ patientId?: string; instrumentCode?: string }>();

  const [patientOptions, setPatientOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState('');
  const [instrumentCode, setInstrumentCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const loadPatients = useCallback(async () => {
    setLoadingPatients(true);
    setPatientsError(null);
    try {
      const response = await listPatientsRequest({ limit: 50 });
      setPatientOptions(
        response.data.map((patient) => ({
          value: patient.id,
          label: patient.fullName,
        })),
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setPatientsError(error.message);
      } else {
        setPatientsError('Não foi possível carregar pacientes.');
      }
      setPatientOptions([]);
    } finally {
      setLoadingPatients(false);
    }
  }, []);

  const instrumentOptions = useMemo(() => ALL_ASSESSMENT_INSTRUMENT_OPTIONS, []);

  useEffect(() => {
    void loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    if (preselectedPatientId && patientOptions.some((option) => option.value === preselectedPatientId)) {
      setPatientId(preselectedPatientId);
    }
  }, [preselectedPatientId, patientOptions]);

  useEffect(() => {
    if (
      preselectedInstrumentCode &&
      instrumentOptions.some((option) => option.value === preselectedInstrumentCode.toLowerCase())
    ) {
      setInstrumentCode(preselectedInstrumentCode.toLowerCase());
    }
  }, [preselectedInstrumentCode, instrumentOptions]);

  function handleStart() {
    if (!patientId || !instrumentCode) {
      setFormError('Selecione o paciente e o teste para continuar.');
      return;
    }

    setFormError(null);
    router.push({
      pathname: '/(main)/assessments/tutorial',
      params: { patientId, instrumentCode, step: '1' },
    } as Href);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AssessmentScreenHeader title="Aplicar Teste" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Selecione o paciente e o teste que será aplicado
        </Text>

        {loadingPatients ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={tokens.colors.primary} />
            <Text style={styles.loadingText}>Carregando pacientes…</Text>
          </View>
        ) : null}

        {patientsError ? (
          <Text style={styles.formError} accessibilityRole="alert">
            {patientsError}
          </Text>
        ) : null}

        <View style={styles.form}>
          <SearchSelectField
            label="Paciente"
            required
            value={patientId}
            placeholder="Buscar Paciente"
            searchPlaceholder="Buscar paciente…"
            options={patientOptions}
            onChange={setPatientId}
          />

          <SearchSelectField
            label="Selecione o teste"
            required
            value={instrumentCode}
            placeholder="Buscar Teste"
            searchPlaceholder="Buscar teste…"
            options={instrumentOptions}
            onChange={setInstrumentCode}
          />
        </View>

        {formError ? (
          <Text style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {formError}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <ButtonRow
            backLabel="Voltar"
            actionLabel="Iniciar"
            onBack={() => router.back()}
            onAction={handleStart}
            actionDisabled={!patientId || !instrumentCode || loadingPatients}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  subtitle: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  loadingText: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  form: {
    gap: tokens.spacing.md,
  },
  formError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
});

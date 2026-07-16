import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssessmentScreenHeader } from '@/components/assessments/AssessmentScreenHeader';
import { SearchSelectField } from '@/components/assessments/SearchSelectField';
import { ButtonRow } from '@/components/ui/Button';
import { QUESTIONNAIRE_INSTRUMENT_OPTIONS } from '@/features/assessments/instruments';
import { MOCK_PATIENTS } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — Aplicar Teste (RF007 + RF008). Questionários Katz, Berg, Tinetti e MEEM. */
export default function ApplyAssessmentScreen() {
  const { patientId: preselectedPatientId } = useLocalSearchParams<{ patientId?: string }>();

  const patientOptions = useMemo(
    () =>
      MOCK_PATIENTS.map((patient) => ({
        value: patient.id,
        label: patient.fullName,
      })),
    [],
  );

  const [patientId, setPatientId] = useState('');
  const [instrumentCode, setInstrumentCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedPatientId && patientOptions.some((option) => option.value === preselectedPatientId)) {
      setPatientId(preselectedPatientId);
    }
  }, [preselectedPatientId, patientOptions]);

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
            options={QUESTIONNAIRE_INSTRUMENT_OPTIONS}
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
            actionDisabled={!patientId || !instrumentCode}
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

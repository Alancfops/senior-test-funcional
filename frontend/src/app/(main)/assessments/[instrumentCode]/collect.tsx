import { Href, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssessmentCollectHeader } from '@/components/assessments/AssessmentCollectHeader';
import { QuestionnaireItemCard } from '@/components/assessments/QuestionnaireItemCard';
import { TugCollectScreen } from '@/components/assessments/TugCollectScreen';
import { ButtonRow } from '@/components/ui/Button';
import { getAssessmentInstrument } from '@/features/assessments/instruments';
import {
  formatProgress,
  getQuestionnaireDefinition,
  getTotalPages,
  isPageComplete,
  ITEMS_PER_PAGE,
  paginateItems,
} from '@/features/assessments/questionnaires';
import {
  ensureQuestionnaireSession,
  getQuestionnaireSession,
  updateQuestionnaireAnswers,
} from '@/features/assessments/session';
import type { QuestionnaireAnswers } from '@/features/assessments/types';
import { getMockPatientById } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — coleta RF010 (questionários + TUG). */
export default function AssessmentCollectScreen() {
  const insets = useSafeAreaInsets();
  const { instrumentCode, patientId } = useLocalSearchParams<{
    instrumentCode: string;
    patientId: string;
  }>();

  const patient = getMockPatientById(patientId ?? '');

  if (instrumentCode === 'tug' && patient) {
    return (
      <TugCollectScreen
        patient={patient}
        patientId={patientId ?? ''}
        instrumentCode={instrumentCode}
      />
    );
  }

  const instrumentMeta = getAssessmentInstrument(instrumentCode ?? '');
  const definition = getQuestionnaireDefinition(instrumentCode ?? '');

  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId || !instrumentCode) {
      return;
    }
    const session = ensureQuestionnaireSession(patientId, instrumentCode);
    if (Object.keys(session.answers).length > 0) {
      setAnswers(session.answers);
    }
  }, [patientId, instrumentCode]);

  const totalPages = definition ? getTotalPages(definition.items.length, ITEMS_PER_PAGE) : 0;
  const pageItems = useMemo(
    () => (definition ? paginateItems(definition.items, page, ITEMS_PER_PAGE) : []),
    [definition, page],
  );
  const progressIndex = page * ITEMS_PER_PAGE;
  const isLastPage = definition ? page >= totalPages - 1 : false;

  const handleAnswerChange = useCallback((itemId: string, value: number | string) => {
    setAnswers((prev) => {
      const next = { ...prev, [itemId]: value };
      updateQuestionnaireAnswers({ [itemId]: value });
      return next;
    });
    setPageError(null);
  }, []);

  if (!instrumentMeta || !definition || !patient) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Sessão de avaliação inválida.</Text>
      </View>
    );
  }

  function handleBack() {
    if (page > 0) {
      setPage((current) => current - 1);
      setPageError(null);
      return;
    }
    router.back();
  }

  function handleNext() {
    if (!isPageComplete(pageItems, answers)) {
      setPageError('Preencha a pontuação de todos os itens desta página para continuar.');
      return;
    }

    if (isLastPage) {
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

    setPage((current) => current + 1);
    setPageError(null);
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
        <Text style={styles.instrumentName} numberOfLines={1}>
          {definition.name}
        </Text>
        <Text style={styles.progress} accessibilityLabel={`Progresso ${formatProgress(progressIndex, definition.items.length)}`}>
          {formatProgress(progressIndex, definition.items.length)}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + tokens.spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {pageItems.map((item) => (
            <QuestionnaireItemCard
              key={item.id}
              item={item}
              value={answers[item.id] ?? null}
              onChange={(value) => handleAnswerChange(item.id, value)}
            />
          ))}
        </View>

        {pageError ? (
          <Text style={styles.pageError} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {pageError}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + tokens.spacing.md }]}>
        <ButtonRow
          backLabel="Voltar"
          actionLabel={isLastPage ? 'Finalizar Teste' : 'Próximo'}
          onBack={handleBack}
          onAction={handleNext}
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
    gap: tokens.spacing.md,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  pageError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    textAlign: 'center',
    marginTop: tokens.spacing.sm,
  },
  footer: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageBackground,
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

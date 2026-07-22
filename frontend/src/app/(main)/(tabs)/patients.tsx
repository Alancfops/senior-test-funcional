import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PatientListItem } from '@/components/patients/PatientListItem';
import { PatientListFilterSheet } from '@/components/main/PatientListFilterSheet';
import { SearchBar } from '@/components/main/SearchBar';
import { TabBlueHeader } from '@/components/main/TabBlueHeader';
import {
  countActivePatientFilters,
  DEFAULT_PATIENT_LIST_FILTERS,
  PatientListFilters,
} from '@/features/filters/patient-list-filters';
import { listPatientsRequest, PatientRecord } from '@/features/patients/api';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — Lista de Pacientes (RF005). */
export default function PatientsTabScreen() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<PatientListFilters>(DEFAULT_PATIENT_LIST_FILTERS);
  const [draftFilters, setDraftFilters] = useState<PatientListFilters>(DEFAULT_PATIENT_LIST_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setLoadError(null);

      void (async () => {
        try {
          const response = await listPatientsRequest({
            search,
            limit: 50,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            gender: filters.gender ?? undefined,
          });
          if (cancelled) {
            return;
          }
          setPatients(response.data);
        } catch (error) {
          if (cancelled) {
            return;
          }
          if (error instanceof ApiError && error.statusCode === 401) {
            setLoadError('Sessão expirada. Saia e faça login novamente.');
          } else if (error instanceof ApiError) {
            setLoadError(error.message);
          } else {
            setLoadError('Não foi possível carregar os pacientes.');
          }
          setPatients([]);
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [filters, search]),
  );

  const emptyMessage = useMemo(() => {
    if (loadError) {
      return loadError;
    }
    if (search.trim() || countActivePatientFilters(filters) > 0) {
      return 'Nenhum registro encontrado';
    }
    return 'Nenhum paciente cadastrado';
  }, [filters, loadError, search]);

  const hasActiveFilters = countActivePatientFilters(filters) > 0;

  function openFilterSheet() {
    setDraftFilters(filters);
    setFilterSheetVisible(true);
  }

  function applyFilters() {
    setFilters(draftFilters);
    setFilterSheetVisible(false);
  }

  function clearFilters() {
    setDraftFilters(DEFAULT_PATIENT_LIST_FILTERS);
    setFilters(DEFAULT_PATIENT_LIST_FILTERS);
    setFilterSheetVisible(false);
  }

  return (
    <View style={styles.root}>
      <TabBlueHeader title="Paciente">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onFilterPress={openFilterSheet}
          filterActive={hasActiveFilters}
          placeholder="Buscar paciente…"
        />
      </TabBlueHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Lista de Pacientes
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Adicionar paciente"
            accessibilityHint="Abre o formulário de cadastro"
            onPress={() => router.push('/(main)/patients/new' as Href)}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Ionicons name="person-add-outline" size={22} color={tokens.colors.primary} />
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            color={tokens.colors.primary}
            accessibilityLabel="Carregando pacientes"
            style={styles.loader}
          />
        ) : null}

        <View style={styles.list}>
          {!loading && patients.length === 0 ? (
            <Text style={styles.empty} accessibilityRole="alert">
              {emptyMessage}
            </Text>
          ) : (
            patients.map((patient) => (
              <PatientListItem
                key={patient.id}
                fullName={patient.fullName}
                age={patient.age}
                avatarUrl={patient.avatarUrl}
                onPress={() => router.push(`/(main)/patients/${patient.id}` as Href)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <PatientListFilterSheet
        visible={filterSheetVisible}
        draftFilters={draftFilters}
        onChangeDraft={setDraftFilters}
        onClose={() => setFilterSheetVisible(false)}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  content: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...tokens.typography.title,
    fontSize: 20,
    color: tokens.colors.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: tokens.radius.full,
    backgroundColor: 'rgba(54, 102, 224, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  loader: {
    marginVertical: tokens.spacing.lg,
  },
  list: {
    gap: tokens.spacing.sm,
  },
  empty: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.lg,
  },
});

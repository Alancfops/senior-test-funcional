import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PatientListItem } from '@/components/patients/PatientListItem';
import { SearchBar } from '@/components/main/SearchBar';
import { TabBlueHeader } from '@/components/main/TabBlueHeader';
import { listPatientsRequest, PatientRecord } from '@/features/patients/api';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

/** Figma — Lista de Pacientes (RF005). */
export default function PatientsTabScreen() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPatients = useCallback(async (query: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await listPatientsRequest({
        search: query,
        limit: 50,
      });
      setPatients(response.data);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setLoadError('Sessão expirada. Saia e faça login novamente.');
      } else if (error instanceof ApiError) {
        setLoadError(error.message);
      } else {
        setLoadError('Não foi possível carregar os pacientes.');
      }
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPatients(search);
    }, [loadPatients, search]),
  );

  const emptyMessage = useMemo(() => {
    if (loadError) {
      return loadError;
    }
    if (search.trim()) {
      return 'Nenhum registro encontrado';
    }
    return 'Nenhum paciente cadastrado';
  }, [loadError, search]);

  function handleFilter() {
    Alert.alert('Em breve', 'Filtros avançados de pacientes virão na Fase D.');
  }

  return (
    <View style={styles.root}>
      <TabBlueHeader title="Paciente">
        <SearchBar value={search} onChangeText={setSearch} onFilterPress={handleFilter} />
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

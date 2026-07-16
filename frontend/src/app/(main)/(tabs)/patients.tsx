import { Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PatientListItem } from '@/components/patients/PatientListItem';
import { SearchBar } from '@/components/main/SearchBar';
import { TabBlueHeader } from '@/components/main/TabBlueHeader';
import { MOCK_PATIENTS } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** Figma — Lista de Pacientes (RF005). */
export default function PatientsTabScreen() {
  const [search, setSearch] = useState('');

  const patients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return MOCK_PATIENTS;
    }
    return MOCK_PATIENTS.filter((patient) => patient.fullName.toLowerCase().includes(query));
  }, [search]);

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

        <View style={styles.list}>
          {patients.length === 0 ? (
            <Text style={styles.empty}>Nenhum paciente encontrado.</Text>
          ) : (
            patients.map((patient) => (
              <PatientListItem
                key={patient.id}
                fullName={patient.fullName}
                age={patient.age}
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

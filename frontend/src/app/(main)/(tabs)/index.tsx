import { router, Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { HomeHeader } from '@/components/main/HomeHeader';
import { QuickActionCard } from '@/components/main/QuickActionCard';
import { SearchBar } from '@/components/main/SearchBar';
import { MOCK_RECENT_ACTIVITIES } from '@/features/patients/constants';
import { ACTIVITY_PATIENT_ID } from '@/features/patients/mock-patients';
import { useSessionUser } from '@/hooks/use-session-user';
import { tokens } from '@/theme/tokens';

/** Figma — Início / Home (RF005 parcial — dashboard com atividade recente). */
export default function HomeTabScreen() {
  const sessionUser = useSessionUser();
  const [search, setSearch] = useState('');

  const displayName = sessionUser?.fullName ?? 'Profissional';

  const activities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return MOCK_RECENT_ACTIVITIES;
    }
    return MOCK_RECENT_ACTIVITIES.filter((item) =>
      item.patientName.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <View style={styles.root}>
      <HomeHeader
        userName={displayName}
        onProfilePress={() => router.push('/(main)/(tabs)/settings' as Href)}
        searchSlot={<SearchBar value={search} onChangeText={setSearch} />}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.actionsRow}>
          <QuickActionCard
            label="Adicionar Paciente"
            icon="person-add-outline"
            onPress={() => router.push('/(main)/patients/new' as Href)}
            accessibilityHint="Abre o formulário de cadastro de paciente"
          />
          <QuickActionCard
            label="Aplicar Teste"
            icon="clipboard-outline"
            onPress={() => router.push('/(main)/assessments/apply' as Href)}
            accessibilityHint="Abre a seleção de paciente e teste"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Atividade Recente
          </Text>
          <Pressable accessibilityRole="link" hitSlop={8}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </Pressable>
        </View>

        <View style={styles.activityList}>
          {activities.length === 0 ? (
            <Text style={styles.empty}>Nenhum registro encontrado</Text>
          ) : (
            activities.map((item, index) => {
              const patientId = ACTIVITY_PATIENT_ID[item.patientName];
              return (
                <ActivityCard
                  key={item.id}
                  patientName={item.patientName}
                  description={item.description}
                  when={item.when}
                  tone={activityToneForIndex(index)}
                  onPress={
                    patientId
                      ? () => router.push(`/(main)/patients/${patientId}` as Href)
                      : undefined
                  }
                />
              );
            })
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
  scroll: {
    flex: 1,
  },
  content: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...tokens.typography.title,
    fontSize: 18,
    color: tokens.colors.text,
  },
  sectionLink: {
    ...tokens.typography.link,
    color: tokens.colors.link,
  },
  activityList: {
    gap: tokens.spacing.sm,
  },
  empty: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.lg,
  },
});

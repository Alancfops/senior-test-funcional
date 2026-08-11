import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { ActivityListFilterSheet } from '@/components/main/ActivityListFilterSheet';
import { HomeHeader } from '@/components/main/HomeHeader';
import { QuickActionCard } from '@/components/main/QuickActionCard';
import { SearchBar } from '@/components/main/SearchBar';
import { listRecentActivitiesRequest, RecentActivityRecord } from '@/features/assessments/api';
import {
  ActivityListFilters,
  countActiveActivityFilters,
  DEFAULT_ACTIVITY_LIST_FILTERS,
  normalizeActivityListFilters,
} from '@/features/filters/activity-list-filters';
import { formatRelativeWhen } from '@/features/patients/assessment-history';
import { useSessionUser } from '@/hooks/use-session-user';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

const HOME_RECENT_LIMIT = 5;

/** Figma — Início / Home (RF005 — dashboard com atividade recente da API). */
export default function HomeTabScreen() {
  const sessionUser = useSessionUser();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActivityListFilters>(DEFAULT_ACTIVITY_LIST_FILTERS);
  const [draftFilters, setDraftFilters] = useState<ActivityListFilters>(DEFAULT_ACTIVITY_LIST_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [activities, setActivities] = useState<RecentActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const displayName = sessionUser?.fullName ?? 'Profissional';
  const hasActiveFilters = countActiveActivityFilters(filters) > 0;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setLoadError(null);

      void (async () => {
        try {
          const response = await listRecentActivitiesRequest({
            limit: HOME_RECENT_LIMIT,
            search,
            instrumentCodes:
              filters.instrumentCodes.length > 0 ? filters.instrumentCodes : undefined,
          });
          if (cancelled) {
            return;
          }
          setActivities(response.data);
        } catch (error) {
          if (cancelled) {
            return;
          }
          setActivities([]);
          if (error instanceof ApiError) {
            setLoadError(error.message);
          } else {
            setLoadError('Não foi possível carregar atividades recentes.');
          }
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

  function openFilterSheet() {
    setDraftFilters(filters);
    setFilterSheetVisible(true);
  }

  function applyFilters() {
    setFilters(normalizeActivityListFilters(draftFilters));
    setFilterSheetVisible(false);
  }

  function clearFilters() {
    setDraftFilters(DEFAULT_ACTIVITY_LIST_FILTERS);
    setFilters(DEFAULT_ACTIVITY_LIST_FILTERS);
    setFilterSheetVisible(false);
  }

  return (
    <View style={styles.root}>
      <HomeHeader
        userName={displayName}
        onProfilePress={() => router.push('/(main)/(tabs)/settings' as Href)}
        searchSlot={
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onFilterPress={openFilterSheet}
            filterActive={hasActiveFilters}
            placeholder="Buscar paciente ou teste…"
          />
        }
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
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Ver todos os históricos de avaliação"
            accessibilityHint="Abre a aba Histórico com a lista completa"
            hitSlop={8}
            onPress={() => router.push('/(main)/(tabs)/history' as Href)}>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </Pressable>
        </View>

        <View style={styles.activityList}>
          {loading ? (
            <ActivityIndicator color={tokens.colors.primary} accessibilityLabel="Carregando atividades" />
          ) : loadError ? (
            <Text style={styles.empty} accessibilityRole="alert">
              {loadError}
            </Text>
          ) : activities.length === 0 ? (
            <Text style={styles.empty}>
              {search.trim() || hasActiveFilters
                ? 'Nenhum registro encontrado.'
                : 'Nenhuma avaliação finalizada ainda.'}
            </Text>
          ) : (
            activities.map((item, index) => (
              <ActivityCard
                key={item.id}
                patientName={item.patientName}
                patientGender={item.patientGender}
                description={item.instrumentDisplayName}
                when={formatRelativeWhen(item.finalizedAt)}
                tone={activityToneForIndex(index)}
                onPress={() =>
                  router.push(
                    `/(main)/patients/${item.patientId}/assessment/${item.id}` as Href,
                  )
                }
              />
            ))
          )}
        </View>
      </ScrollView>

      <ActivityListFilterSheet
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
    minHeight: 48,
    justifyContent: 'center',
  },
  empty: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    paddingVertical: tokens.spacing.lg,
  },
});

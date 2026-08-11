import { Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityCard, activityToneForIndex } from '@/components/main/ActivityCard';
import { ActivityListFilterSheet } from '@/components/main/ActivityListFilterSheet';
import { TabBlueHeader } from '@/components/main/TabBlueHeader';
import { SearchBar } from '@/components/main/SearchBar';
import { listRecentActivitiesRequest, RecentActivityRecord } from '@/features/assessments/api';
import {
  ActivityListFilters,
  countActiveActivityFilters,
  DEFAULT_ACTIVITY_LIST_FILTERS,
  normalizeActivityListFilters,
} from '@/features/filters/activity-list-filters';
import { formatRelativeWhen } from '@/features/patients/assessment-history';
import { ApiError } from '@/lib/api/client';
import { tokens } from '@/theme/tokens';

const HISTORY_LIST_LIMIT = 50;

/** Aba Histórico — avaliações finalizadas do fisioterapeuta (consolidado). */
export default function HistoryTabScreen() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ActivityListFilters>(DEFAULT_ACTIVITY_LIST_FILTERS);
  const [draftFilters, setDraftFilters] = useState<ActivityListFilters>(DEFAULT_ACTIVITY_LIST_FILTERS);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [activities, setActivities] = useState<RecentActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const hasActiveFilters = countActiveActivityFilters(filters) > 0;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setLoadError(null);

      void (async () => {
        try {
          const response = await listRecentActivitiesRequest({
            limit: HISTORY_LIST_LIMIT,
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
            setLoadError('Não foi possível carregar o histórico.');
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
      <TabBlueHeader title="Histórico">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onFilterPress={openFilterSheet}
          filterActive={hasActiveFilters}
          placeholder="Buscar paciente ou teste…"
        />
      </TabBlueHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Avaliações realizadas
        </Text>

        <View style={styles.activityList}>
          {loading ? (
            <ActivityIndicator color={tokens.colors.primary} accessibilityLabel="Carregando histórico" />
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
  content: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    ...tokens.typography.title,
    fontSize: 18,
    color: tokens.colors.text,
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

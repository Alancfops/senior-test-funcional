import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SYSTEM_INFO } from '@/features/settings/system-info';
import { tokens } from '@/theme/tokens';

function CreditSection({ title, names }: { title: string; names: readonly string[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.nameList}>
        {names.map((name) => (
          <Text key={name} style={styles.nameItem}>
            {name}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** Figma — Informações do Sistema (cores #3666E0 / #F6F7FC). */
export default function SystemInfoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.topBand, { paddingTop: insets.top }]} />

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={[
          styles.sheetContent,
          { paddingBottom: insets.bottom + tokens.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Informações do Sistema
          </Text>
          <View style={styles.headerSide} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvido por:</Text>
          <Image
            source={SYSTEM_INFO.developedByLogo}
            style={styles.partnerLogo}
            contentFit="contain"
            accessibilityLabel="CESMAC CITEC"
          />
        </View>

        <CreditSection
          title="Professores e Pesquisadores envolvidos:"
          names={SYSTEM_INFO.professorsAndResearchers}
        />

        <CreditSection title="Desenvolvedores responsáveis:" names={SYSTEM_INFO.developers} />

        <CreditSection title="Designers:" names={SYSTEM_INFO.designers} />

        <View style={styles.collaborationBlock}>
          <Text style={styles.sectionTitle}>Colaboração:</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Versão Atual</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>{SYSTEM_INFO.versionLabel}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Última Atualização</Text>
          <Text style={styles.metaValue}>{SYSTEM_INFO.lastUpdate}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
  },
  topBand: {
    backgroundColor: tokens.colors.primary,
    height: tokens.spacing.sm,
  },
  sheet: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radius.cardTop,
    borderTopRightRadius: tokens.radius.cardTop,
  },
  sheetContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    gap: tokens.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  backButton: {
    minWidth: tokens.touchTargetMin,
    minHeight: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSide: {
    width: tokens.touchTargetMin,
  },
  headerTitle: {
    flex: 1,
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.primary,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  partnerLogo: {
    width: 140,
    height: 128,
    alignSelf: 'flex-start',
  },
  nameList: {
    gap: 4,
    paddingLeft: tokens.spacing.xs,
  },
  nameItem: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
  collaborationBlock: {
    gap: tokens.spacing.sm,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: tokens.colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  metaLabel: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
    flex: 1,
  },
  metaValue: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  versionBadge: {
    backgroundColor: 'rgba(124, 197, 180, 0.35)',
    borderRadius: tokens.radius.pill,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
  },
  versionText: {
    ...tokens.typography.caption,
    fontWeight: '600',
    color: '#2D6B5A',
  },
});

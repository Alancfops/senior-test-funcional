import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PRIVACY_TERMS_SECTIONS } from '@/features/settings/privacy-terms-content';
import { tokens } from '@/theme/tokens';

/** Aviso de privacidade e termos de uso (Configurações). */
export default function PrivacyTermsScreen() {
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
            LGPD e Termos de uso
          </Text>
          <View style={styles.headerSide} />
        </View>

        <Text style={styles.lead}>
          Resumo do tratamento de dados e condições de uso do aplicativo. Para solicitações de
          titulares (acesso, correção ou exclusão), contate o responsável institucional do projeto.
        </Text>

        {PRIVACY_TERMS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {section.title}
            </Text>
            {section.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
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
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
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
    minHeight: tokens.touchTargetMin,
    marginBottom: tokens.spacing.sm,
  },
  backButton: {
    width: tokens.touchTargetMin,
    height: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSide: {
    width: tokens.touchTargetMin,
  },
  headerTitle: {
    flex: 1,
    ...tokens.typography.title,
    fontSize: 18,
    color: tokens.colors.text,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  lead: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    lineHeight: 20,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  paragraph: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
    lineHeight: 22,
  },
});

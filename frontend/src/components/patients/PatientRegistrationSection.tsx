import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';

import { tokens } from '@/theme/tokens';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type PatientRegistrationSectionProps = {
  genderLabel: string;
  contact: string;
  schoolingLabel?: string | null;
  defaultExpanded?: boolean;
};

/** RF006 — dados cadastrais colapsáveis no perfil (libera espaço para testes). */
export function PatientRegistrationSection({
  genderLabel,
  contact,
  schoolingLabel,
  defaultExpanded = false,
}: PatientRegistrationSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  function toggleExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((value) => !value);
  }

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dados cadastrais"
        accessibilityHint={
          expanded
            ? 'Toque para recolher os dados cadastrais do paciente.'
            : 'Toque para expandir e ver sexo, contato e escolaridade.'
        }
        accessibilityState={{ expanded }}
        onPress={toggleExpanded}
        hitSlop={8}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}>
        <Text style={styles.title} accessibilityRole="header">
          Dados cadastrais
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={tokens.colors.primary}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.content} accessibilityRole="summary">
          <View style={styles.row}>
            <Text style={styles.label}>Sexo</Text>
            <Text style={styles.value}>{genderLabel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Contato</Text>
            <Text style={styles.value}>{contact}</Text>
          </View>

          {schoolingLabel ? (
            <View style={styles.row}>
              <Text style={styles.label}>Escolaridade</Text>
              <Text style={styles.value}>{schoolingLabel}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: tokens.touchTargetMin,
    gap: tokens.spacing.sm,
  },
  headerPressed: {
    opacity: 0.85,
  },
  title: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
    flex: 1,
  },
  content: {
    gap: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tokens.colors.border,
    marginTop: tokens.spacing.sm,
  },
  row: {
    gap: 4,
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  value: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
});

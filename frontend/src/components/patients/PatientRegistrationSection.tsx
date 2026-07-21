import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type PatientRegistrationSectionProps = {
  genderLabel: string;
  contact: string;
  schoolingLabel?: string | null;
};

/** RF006 — dados cadastrais do paciente no perfil. */
export function PatientRegistrationSection({
  genderLabel,
  contact,
  schoolingLabel,
}: PatientRegistrationSectionProps) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.title} accessibilityRole="header">
        Dados cadastrais
      </Text>

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
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
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

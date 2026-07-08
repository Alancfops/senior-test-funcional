import { Href, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { MOCK_PATIENTS } from '@/features/patients/mock-patients';
import { tokens } from '@/theme/tokens';

/** RF005 — lista mock de pacientes (Fase A). */
export default function PatientsTabScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title} accessibilityRole="header">
          Pacientes
        </Text>
        <Text style={styles.subtitle}>
          Toque em um paciente para abrir o perfil e o histórico de testes.
        </Text>

        <View style={styles.list}>
          {MOCK_PATIENTS.map((patient) => (
            <Pressable
              key={patient.id}
              accessibilityRole="button"
              accessibilityLabel={`${patient.fullName}, ${patient.age} anos`}
              accessibilityHint={
                patient.assessments.length === 0
                  ? 'Perfil sem testes cadastrados'
                  : `${patient.assessments.length} testes no histórico`
              }
              onPress={() => router.push(`/(main)/patients/${patient.id}` as Href)}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={28} color={tokens.colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.name}>{patient.fullName}</Text>
                <Text style={styles.meta}>
                  {patient.age} anos ·{' '}
                  {patient.assessments.length === 0
                    ? 'Sem testes'
                    : `${patient.assessments.length} teste(s)`}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={tokens.colors.textMuted} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  content: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  title: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
  list: {
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  pressed: {
    opacity: 0.92,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.md,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  meta: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
});

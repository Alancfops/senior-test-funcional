import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PatientAvatar } from '@/components/patients/PatientAvatar';
import { tokens } from '@/theme/tokens';

type PatientProfileHeaderProps = {
  fullName: string;
  age: number;
  avatarUrl?: string | null;
  onEditPatient?: () => void;
};

/** Figma — Perfil de Paciente: header azul, avatar/iniciais, nome/idade e lápis. */
export function PatientProfileHeader({
  fullName,
  age,
  avatarUrl,
  onEditPatient,
}: PatientProfileHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={24} color={tokens.colors.onPrimary} />
        </Pressable>
        <Text style={styles.screenTitle} accessibilityRole="header">
          Perfil de Paciente
        </Text>
        <View style={styles.topBarSpacer} />
      </View>

      <View style={styles.profileRow}>
        <PatientAvatar
          fullName={fullName}
          avatarUrl={avatarUrl}
          size={72}
          shape="circle"
          tone="onPrimary"
        />
        <View style={styles.identity}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.age}>{age} Anos</Text>
        </View>
        {onEditPatient ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar paciente"
            accessibilityHint="Abre o formulário para alterar os dados cadastrais"
            onPress={onEditPatient}
            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
            <Ionicons name="pencil-outline" size={18} color={tokens.colors.primary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    borderBottomLeftRadius: tokens.radius.lg,
    borderBottomRightRadius: tokens.radius.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
    marginBottom: tokens.spacing.md,
  },
  backButton: {
    minWidth: tokens.touchTargetMin,
    minHeight: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    flex: 1,
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  topBarSpacer: {
    width: tokens.touchTargetMin,
  },
  pressed: {
    opacity: 0.85,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    color: tokens.colors.onPrimary,
  },
  age: {
    ...tokens.typography.subtitle,
    color: 'rgba(255,255,255,0.92)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

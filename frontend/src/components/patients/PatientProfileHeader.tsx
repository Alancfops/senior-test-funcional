import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { resolvePatientAvatarUrl } from '@/features/patients/avatar-url';
import { tokens } from '@/theme/tokens';

type PatientProfileHeaderProps = {
  fullName: string;
  age: number;
  avatarUrl?: string | null;
};

/** Figma — Perfil de Paciente: header azul, avatar, nome e idade. */
export function PatientProfileHeader({ fullName, age, avatarUrl }: PatientProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const resolvedAvatar = resolvePatientAvatarUrl(avatarUrl);

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
        <View style={styles.avatarRing}>
          <Image
            source={
              resolvedAvatar
                ? { uri: resolvedAvatar }
                : require('@/assets/images/brand/seniortest-logo-circle.png')
            }
            style={styles.avatar}
            contentFit="cover"
            accessibilityIgnoresInvertColors
          />
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.age}>{age} Anos</Text>
        </View>
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
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: tokens.radius.full,
    backgroundColor: 'rgba(255,255,255,0.35)',
    padding: 3,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.radius.full,
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
});

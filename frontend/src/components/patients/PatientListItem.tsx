import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { resolvePatientAvatarUrl } from '@/features/patients/avatar-url';
import { tokens } from '@/theme/tokens';

type PatientListItemProps = {
  fullName: string;
  age: number;
  avatarUrl?: string | null;
  onPress: () => void;
};

/** Figma — card da lista de pacientes (RF005). */
export function PatientListItem({ fullName, age, avatarUrl, onPress }: PatientListItemProps) {
  const resolvedAvatar = resolvePatientAvatarUrl(avatarUrl);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${fullName}, ${age} anos`}
      accessibilityHint="Abre o perfil do paciente"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.photoWrap}>
        <Image
          source={
            resolvedAvatar
              ? { uri: resolvedAvatar }
              : require('@/assets/images/brand/seniortest-logo-circle.png')
          }
          style={styles.photo}
          contentFit="cover"
          accessibilityIgnoresInvertColors
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.age}>{age} Anos</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tokens.colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
  },
  photoWrap: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.md,
    overflow: 'hidden',
    backgroundColor: '#EEF3FF',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.primary,
  },
  age: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
});

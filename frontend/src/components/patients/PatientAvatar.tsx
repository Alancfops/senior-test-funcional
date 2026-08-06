import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { resolvePatientAvatarUrl } from '@/features/patients/avatar-url';
import { getPatientInitials } from '@/features/patients/initials';
import { tokens } from '@/theme/tokens';

type PatientAvatarProps = {
  fullName: string;
  avatarUrl?: string | null;
  size?: number;
  /** `circle` (header/perfil) ou `rounded` (lista). */
  shape?: 'circle' | 'rounded';
  /** Fundo claro (lista) ou anel translúcido no header azul. */
  tone?: 'light' | 'onPrimary';
  style?: StyleProp<ViewStyle>;
};

/**
 * Avatar do paciente: foto se existir; senão iniciais (ex.: ML).
 * Substitui logo/Memoji como placeholder.
 */
export function PatientAvatar({
  fullName,
  avatarUrl,
  size = 52,
  shape = 'circle',
  tone = 'light',
  style,
}: PatientAvatarProps) {
  const resolved = resolvePatientAvatarUrl(avatarUrl);
  const initials = getPatientInitials(fullName);
  const radius = shape === 'circle' ? tokens.radius.full : tokens.radius.md;
  const fontSize = Math.max(14, Math.round(size * 0.36));

  if (resolved) {
    return (
      <View
        style={[
          styles.shell,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: tone === 'onPrimary' ? 'rgba(255,255,255,0.35)' : '#EEF3FF',
            padding: tone === 'onPrimary' ? 3 : 0,
          },
          style,
        ]}>
        <Image
          source={{ uri: resolved }}
          style={[styles.image, { borderRadius: radius }]}
          contentFit="cover"
          accessibilityIgnoresInvertColors
          accessibilityLabel={`Foto de ${fullName}`}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.shell,
        styles.initialsWrap,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: tone === 'onPrimary' ? 'rgba(255,255,255,0.92)' : '#EEF3FF',
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar com iniciais ${initials} de ${fullName}`}>
      <Text
        style={[
          styles.initials,
          {
            fontSize,
            lineHeight: fontSize + 4,
            color: tokens.colors.primary,
          },
        ]}
        importantForAccessibility="no">
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsWrap: {
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

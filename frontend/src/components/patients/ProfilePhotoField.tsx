import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type ProfilePhotoFieldProps = {
  onPress?: () => void;
};

/** Placeholder RF004 — upload real virá com integração API/câmera. */
export function ProfilePhotoField({ onPress }: ProfilePhotoFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Foto de perfil</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adicionar foto de perfil"
        accessibilityHint="Opcional. Abrirá seleção de imagem quando a API estiver integrada."
        onPress={onPress}
        style={({ pressed }) => [styles.photoWrap, pressed && styles.pressed]}>
        <View style={styles.circle}>
          <Ionicons name="person-outline" size={48} color={tokens.colors.textMuted} />
          <View style={styles.addBadge}>
            <Ionicons name="add" size={16} color={tokens.colors.onPrimary} />
          </View>
        </View>
      </Pressable>
      <Text style={styles.hint}>Adicionar foto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: tokens.spacing.xs,
    marginBottom: tokens.spacing.sm,
  },
  label: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  photoWrap: {
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 28,
    height: 28,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    ...tokens.typography.caption,
    color: tokens.colors.link,
  },
});

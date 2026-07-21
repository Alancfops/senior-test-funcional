import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

export type PatientAvatarSelection = {
  uri: string;
  mimeType: 'image/jpeg' | 'image/png';
  base64: string;
};

type ProfilePhotoFieldProps = {
  value?: PatientAvatarSelection | null;
  onChange?: (value: PatientAvatarSelection | null) => void;
  error?: string;
};

/** RF004 — foto opcional (galeria → API). */
export function ProfilePhotoField({ value, onChange, error }: ProfilePhotoFieldProps) {
  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso às fotos para escolher a imagem do paciente.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets[0]?.base64) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';

    onChange?.({
      uri: asset.uri,
      mimeType,
      base64: asset.base64,
    });
  }

  function handleRemovePhoto() {
    onChange?.(null);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Foto de perfil</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value ? 'Alterar foto de perfil' : 'Adicionar foto de perfil'}
        accessibilityHint="Abre a galeria para escolher uma foto JPG ou PNG"
        onPress={handlePickPhoto}
        onLongPress={value ? handleRemovePhoto : undefined}
        style={({ pressed }) => [styles.photoWrap, pressed && styles.pressed]}>
        <View style={styles.avatarShell}>
          <View style={styles.circle}>
            {value ? (
              <Image source={{ uri: value.uri }} style={styles.preview} contentFit="cover" />
            ) : (
              <Ionicons name="person-outline" size={48} color={tokens.colors.textMuted} />
            )}
          </View>

          {!value ? (
            <View style={styles.addBadge} pointerEvents="none">
              <Ionicons name="add" size={16} color={tokens.colors.onPrimary} />
            </View>
          ) : null}
        </View>
      </Pressable>
      <Text style={styles.hint}>{value ? 'Toque para trocar · segure para remover' : 'Adicionar foto'}</Text>
      {error ? (
        <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const AVATAR_SIZE = 120;
const BADGE_SIZE = 28;

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
  avatarShell: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: 'relative',
  },
  circle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  addBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primary,
    borderWidth: 2,
    borderColor: tokens.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  hint: {
    ...tokens.typography.caption,
    color: tokens.colors.link,
    textAlign: 'center',
  },
  error: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    textAlign: 'center',
  },
});

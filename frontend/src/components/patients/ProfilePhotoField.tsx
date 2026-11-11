import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

export type PatientAvatarSelection = {
  uri: string;
  mimeType: 'image/jpeg' | 'image/png';
  base64: string;
};

type ProfilePhotoFieldProps = {
  value?: PatientAvatarSelection | null;
  onChange?: (value: PatientAvatarSelection | null) => void;
  /** URI já salva no servidor (modo edição), exibida até o usuário escolher outra. */
  existingUri?: string | null;
  /** Remove a foto exibida (nova ou já salva); efetivado ao salvar o formulário. */
  onRemove?: () => void;
  error?: string;
};

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  /** Mais baixo para caber no limite da API (~250 KB / 350k chars base64). */
  quality: 0.4,
  base64: true,
};

/** Alinhado ao `avatarImageSchema` do backend. */
const MAX_AVATAR_BASE64_LENGTH = 350_000;

function assetToSelection(asset: ImagePicker.ImagePickerAsset): PatientAvatarSelection | null {
  if (!asset.base64) {
    Alert.alert('Foto inválida', 'Não foi possível ler a imagem. Tente outra foto.');
    return null;
  }

  if (asset.base64.length > MAX_AVATAR_BASE64_LENGTH) {
    Alert.alert(
      'Foto muito grande',
      'A imagem ultrapassa o tamanho permitido (~250 KB). Aproxime o enquadramento ou escolha outra foto.',
    );
    return null;
  }

  const mimeType = asset.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';

  return {
    uri: asset.uri,
    mimeType,
    base64: asset.base64,
  };
}

/** RF004 — foto opcional; permissões de câmera/galeria só ao escolher a foto. */
export function ProfilePhotoField({
  value,
  onChange,
  existingUri,
  onRemove,
  error,
}: ProfilePhotoFieldProps) {
  const previewUri = value?.uri ?? existingUri ?? null;
  const hasPhoto = Boolean(previewUri);
  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso às fotos para escolher a imagem do paciente.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled || !result.assets[0]) {
      return;
    }

    const selection = assetToSelection(result.assets[0]);
    if (selection) {
      onChange?.(selection);
    }
  }

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita acesso à câmera para fotografar o paciente.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
    if (result.canceled || !result.assets[0]) {
      return;
    }

    const selection = assetToSelection(result.assets[0]);
    if (selection) {
      onChange?.(selection);
    }
  }

  function handlePickPhoto() {
    if (Platform.OS === 'web') {
      void pickFromLibrary();
      return;
    }

    Alert.alert('Foto do paciente', 'Como deseja adicionar a foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Tirar foto', onPress: () => void pickFromCamera() },
      { text: 'Escolher da galeria', onPress: () => void pickFromLibrary() },
    ]);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Foto de perfil</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hasPhoto ? 'Alterar foto de perfil' : 'Adicionar foto de perfil'}
        accessibilityHint="Abre câmera ou galeria para escolher uma foto JPG ou PNG"
        onPress={handlePickPhoto}
        style={({ pressed }) => [styles.photoWrap, pressed && styles.pressed]}>
        <View style={styles.avatarShell}>
          <View style={styles.circle}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.preview} contentFit="cover" />
            ) : (
              <Ionicons name="person-outline" size={48} color={tokens.colors.textMuted} />
            )}
          </View>

          <View style={styles.addBadge} pointerEvents="none">
            <Ionicons
              name={hasPhoto ? 'camera' : 'add'}
              size={hasPhoto ? 14 : 16}
              color={tokens.colors.onPrimary}
            />
          </View>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hasPhoto ? 'Trocar foto de perfil' : 'Adicionar foto de perfil'}
          accessibilityHint="Abre câmera ou galeria para escolher uma foto JPG ou PNG"
          onPress={handlePickPhoto}
          hitSlop={8}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
          <Ionicons
            name={hasPhoto ? 'camera-outline' : 'add-circle-outline'}
            size={16}
            color={tokens.colors.link}
          />
          <Text style={styles.actionText}>{hasPhoto ? 'Trocar foto' : 'Adicionar foto'}</Text>
        </Pressable>
        {hasPhoto && onRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remover foto de perfil"
            accessibilityHint="O paciente fica sem foto ao salvar"
            onPress={onRemove}
            hitSlop={8}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
            <Ionicons name="trash-outline" size={16} color={tokens.colors.error} />
            <Text style={[styles.actionText, styles.removeText]}>Remover foto</Text>
          </Pressable>
        ) : null}
      </View>
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
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: tokens.spacing.lg,
    rowGap: tokens.spacing.xs,
    alignSelf: 'stretch',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 32,
  },
  actionText: {
    ...tokens.typography.caption,
    fontWeight: '600',
    color: tokens.colors.link,
    // Folga para o Android não cortar a última letra ao medir o texto.
    paddingRight: 1,
  },
  removeText: {
    color: tokens.colors.error,
  },
  error: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
    textAlign: 'center',
    alignSelf: 'stretch',
  },
});
